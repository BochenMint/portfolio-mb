#!/usr/bin/env node
/**
 * Local fallback: pushes the contents of dist/ to the `production` branch.
 *
 * Mirrors the GitHub Actions workflow (.github/workflows/deploy-production.yml)
 * so a deploy can be triggered from a dev machine when needed, without
 * waiting on CI. Maintains a separate orphan branch `production` whose only
 * tracked content is the build payload — SEOhost's DirectAdmin Git deploy
 * pulls just that branch into public_html/ (see docs/DEPLOY-SEOHOST.md).
 *
 * Run:  npm run deploy         (build + push)
 *       npm run deploy:push    (push only — dist/ must already exist)
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdtempSync, cpSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const PAYLOAD = join(ROOT, 'dist');
const PROD_BRANCH = process.env.PORTFOLIO_PROD_BRANCH || 'production';
const PROD_REMOTE = process.env.PORTFOLIO_PROD_REMOTE || 'origin';
const FORCE_DEPLOY = process.env.PORTFOLIO_FORCE_DEPLOY === '1';

const log = (msg) => process.stdout.write(`[deploy-push] ${msg}\n`);
const fail = (msg) => {
  process.stderr.write(`[deploy-push] ERROR: ${msg}\n`);
  process.exit(1);
};

function run(cmd, opts = {}) {
  log(`$ ${cmd}`);
  try {
    return execSync(cmd, { stdio: 'inherit', cwd: ROOT, ...opts });
  } catch {
    fail(`failed: ${cmd}`);
  }
}

function runCapture(cmd, opts = {}) {
  return execSync(cmd, { encoding: 'utf8', cwd: ROOT, ...opts }).trim();
}

// ---------------------------------------------------------------------------

if (!existsSync(PAYLOAD)) {
  fail('dist/ not found — run `npm run build` first (or `npm run deploy` to build+push)');
}
if (!existsSync(join(PAYLOAD, '.htaccess'))) {
  log('WARN: dist/.htaccess not found — did `public/.htaccess` get copied by the Vite build?');
}

let currentSha;
try {
  currentSha = runCapture('git rev-parse HEAD');
} catch {
  fail('could not resolve current git HEAD');
}
const currentBranch = (() => {
  try {
    return runCapture('git rev-parse --abbrev-ref HEAD');
  } catch {
    return 'unknown';
  }
})();

// Refuse to push if working tree is dirty (uncommitted changes in source) —
// otherwise we ship a build that doesn't correspond to any committed code.
const dirty = runCapture('git status --porcelain');
if (dirty && !FORCE_DEPLOY) {
  log('working tree has uncommitted changes:');
  process.stderr.write(dirty + '\n');
  fail('commit or stash before deploying (set PORTFOLIO_FORCE_DEPLOY=1 to override)');
}
if (dirty && FORCE_DEPLOY) {
  log('WARN: working tree is dirty — proceeding anyway (PORTFOLIO_FORCE_DEPLOY=1)');
}

// Regenerate the deploy manifest so it always reflects THIS push, even if
// dist/ was built a while ago.
const manifest = {
  builtAt: new Date().toISOString(),
  gitSha: currentSha,
  gitBranch: currentBranch,
};
writeFileSync(join(PAYLOAD, 'DEPLOY-MANIFEST.json'), JSON.stringify(manifest, null, 2) + '\n');
log(`manifest: ${manifest.gitSha.slice(0, 8)} (${manifest.gitBranch}) at ${manifest.builtAt}`);
log(`target branch: ${PROD_BRANCH}`);
log(`target remote: ${PROD_REMOTE}`);

// Use a worktree so we don't disturb the current checkout.
const tmp = mkdtempSync(join(tmpdir(), 'portfolio-mb-deploy-'));
log(`staging worktree: ${tmp}`);

try {
  let prodExists = false;
  try {
    runCapture(`git rev-parse --verify --quiet refs/heads/${PROD_BRANCH}`);
    prodExists = true;
  } catch {
    /* branch does not exist locally */
  }

  if (prodExists) {
    run(`git worktree add "${tmp}" ${PROD_BRANCH}`);
  } else {
    run(`git worktree add --orphan -B ${PROD_BRANCH} "${tmp}"`);
  }

  // Wipe the worktree contents (keep .git pointer file) and replace with payload.
  try {
    runCapture('git rm -rf .', { cwd: tmp });
  } catch {
    /* empty branch — nothing to remove */
  }

  // Copy payload — including dotfiles like .htaccess.
  cpSync(PAYLOAD, tmp, { recursive: true, filter: (src) => !src.endsWith('.git') });

  run('git add -A', { cwd: tmp });

  let pendingChanges = '';
  try {
    pendingChanges = runCapture('git diff --cached --name-only', { cwd: tmp });
  } catch {
    pendingChanges = 'initial';
  }
  if (!pendingChanges) {
    log('no changes since last deploy — nothing to push');
  } else {
    const msg = `deploy: ${manifest.gitSha.slice(0, 8)} (${manifest.gitBranch}) at ${manifest.builtAt}`;
    run(`git commit -m "${msg}"`, { cwd: tmp });
    run(`git push --force ${PROD_REMOTE} ${PROD_BRANCH}`, { cwd: tmp });
    log(`pushed ${PROD_BRANCH} to ${PROD_REMOTE}`);
  }
} finally {
  try {
    run(`git worktree remove --force "${tmp}"`);
  } catch {
    log(`WARN: failed to clean up worktree at ${tmp} — remove manually`);
  }
  try {
    rmSync(tmp, { recursive: true, force: true });
  } catch {
    /* already gone */
  }
}

log('');
log('=== DEPLOY PUSHED ===');
log('');
log('SEOhost DirectAdmin Git deploy should auto-pull `production` via webhook.');
log('See docs/DEPLOY-SEOHOST.md to verify and for manual-pull fallback.');
log('');
