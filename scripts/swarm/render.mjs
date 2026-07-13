import { createRequire } from 'node:module';
const require = createRequire('D:/PORTFOLIO MB/package.json');
const { chromium } = require('playwright');
import { startServer } from './server.mjs';
import path from 'node:path';
import fs from 'node:fs';

const PORT = 5391;
const LAUNCH_ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];

function parseArgs(argv) {
  const out = { _: [] };
  for (const a of argv) {
    const m = a.match(/^--([^=]+)=(.*)$/);
    if (m) out[m[1]] = m[2]; else out._.push(a);
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const mode = args._[0]; // 'still' | 'loop'
  await startServer(PORT);

  const browser = await chromium.launch({ headless: true, args: LAUNCH_ARGS });
  const w = parseInt(args.w || '1280', 10);
  const h = parseInt(args.h || '720', 10);
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  page.on('console', (msg) => console.log('[page]', msg.text()));
  page.on('pageerror', (err) => console.error('[pageerror]', err.message));

  const known = new Set(['w', 'h', 'out', 'outdir', 'frames', '_']);
  const passthrough = [];
  for (const k of Object.keys(args)) {
    if (!known.has(k)) passthrough.push(`${k}=${encodeURIComponent(args[k])}`);
  }

  if (mode === 'still') {
    const url = `http://localhost:${PORT}/scene.html?w=${w}&h=${h}&mode=still&${passthrough.join('&')}`;
    console.log('rendering still:', url);
    const t0 = Date.now();
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForFunction('window.__ready === true', { timeout: 180000 });
    const outPath = args.out || path.join(process.cwd(), 'out', 'still.png');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    await page.screenshot({ path: outPath });
    console.log('saved', outPath, 'in', ((Date.now() - t0) / 1000).toFixed(1), 's');
  } else if (mode === 'loop') {
    const frames = parseInt(args.frames || '150', 10);
    const url = `http://localhost:${PORT}/scene.html?w=${w}&h=${h}&mode=loop&frames=${frames}&${passthrough.join('&')}`;
    console.log('rendering loop:', url);
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForFunction('window.__ready === true', { timeout: 180000 });
    const outDir = args.outdir || path.join(process.cwd(), 'frames');
    fs.mkdirSync(outDir, { recursive: true });
    const t0 = Date.now();
    for (let i = 0; i < frames; i++) {
      await page.evaluate((idx) => window.renderLoopFrame(idx), i);
      const outPath = path.join(outDir, `frame${String(i).padStart(3, '0')}.png`);
      await page.screenshot({ path: outPath });
      if (i % 10 === 0) console.log('frame', i, 'at', ((Date.now() - t0) / 1000).toFixed(1), 's');
    }
    console.log('done', frames, 'frames in', ((Date.now() - t0) / 1000).toFixed(1), 's');
  } else {
    console.error('unknown mode', mode, '(use still|loop)');
    process.exitCode = 1;
  }

  await browser.close();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
