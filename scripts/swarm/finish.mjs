// One-shot: 4K master (mb1 params, density scaled to 4K area) -> grade -> tiers -> ship to repo.
import { createRequire } from 'node:module';
const require = createRequire('D:/PORTFOLIO MB/package.json');
const sharp = require('sharp');
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
process.chdir(here);

const OUT = path.join(here, 'out');
const REPO = 'D:/PORTFOLIO MB/public/projects/agentic';

// 1) render 4K master — mb1 look, N scaled by pixel-area ratio (x9) to keep grain density
const master = path.join(OUT, 'mb-master4k.png');
execFileSync('node', ['render.mjs', 'still', '--w=3840', '--h=2160', `--out=${master}`,
  '--n=4320000', '--curlAmp=0.55', '--coreBias=1.9', '--tubeR=0.85', '--exposure=1.35',
  '--haloFrac=0.10', '--phase=0.7',
], { stdio: 'inherit', timeout: 900000 });

// 2) grade (vignette + grain) — focus on swarm mass
const graded = path.join(OUT, 'mb-master4k-graded.png');
execFileSync('node', ['post.mjs', `--in=${master}`, `--out=${graded}`,
  '--vignette=0.5', '--focusX=0.52', '--focusY=0.45', '--grainAmount=0.03',
], { stdio: 'inherit', timeout: 300000 });

// 3) tiers matching the repo files' aspect ratios exactly.
// NOTE: writing directly over the pre-existing repo files from this Node process
// consistently hits EPERM/UNKNOWN on rename *and* copyFileSync (verified: not a
// transient AV lock -- an out-of-process PowerShell Move-Item onto the same path
// succeeds immediately). So we stage the finished bytes under OUT/ship-*.webp
// here, and the actual repo placement is done as a separate step outside this
// script (PowerShell Move-Item), which is unaffected.
const tiers = [
  { name: 'hero-full.webp', w: 3840, q: 85 },
  { name: 'hero-hero.webp', w: 1920, q: 85 },
  { name: 'hero-card.webp', w: 1280, q: 82 },
];
for (const t of tiers) {
  const repoFile = path.join(REPO, t.name);
  const stageFile = path.join(OUT, 'ship-' + t.name);
  const meta = await sharp(repoFile).metadata();
  const targetH = Math.round(t.w * meta.height / meta.width);
  await sharp(graded).resize(t.w, targetH, { fit: 'cover', position: 'centre' })
    .webp({ quality: t.q, effort: 5 })
    .toFile(stageFile);
  const out = await sharp(stageFile).metadata();
  console.log('staged', t.name, `${out.width}x${out.height}`, Math.round(fs.statSync(stageFile).size / 1024) + 'KB', `(repo aspect was ${meta.width}x${meta.height}) -> ${stageFile}`);
}

// 4) 1280 proof copy for visual check
await sharp(graded).resize(1280, 720, { fit: 'cover' }).png().toFile(path.join(OUT, 'mb-proof.png'));
console.log('ALL-DONE');
