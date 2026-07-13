import { createRequire } from 'node:module';
const require = createRequire('D:/PORTFOLIO MB/package.json');
const sharp = require('sharp');
import fs from 'node:fs';

function parseArgs(argv) {
  const out = { _: [] };
  for (const a of argv) {
    const m = a.match(/^--([^=]+)=(.*)$/);
    if (m) out[m[1]] = m[2]; else out._.push(a);
  }
  return out;
}

// Build a radial vignette buffer (RGB) : white(255) center -> dark ink edges.
// vignetteStrength: 0..1, how dark the corners get. focusX/focusY: 0..1 normalized center of the "bright" zone.
function buildVignette(w, h, strength, focusX, focusY, ink) {
  const buf = Buffer.alloc(w * h * 3);
  const cx = w * focusX, cy = h * focusY;
  const maxR = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x - cx, dy = y - cy;
      const r = Math.hypot(dx, dy) / maxR; // 0 center .. 1 far corner
      // smooth falloff, keep central ~55% radius essentially full brightness
      let t = Math.max(0, (r - 0.28) / (1 - 0.28));
      t = Math.min(1, t);
      t = t * t * (3 - 2 * t); // smoothstep
      const mult = 1 - t * strength;
      const idx = (y * w + x) * 3;
      buf[idx] = Math.round(ink[0] + (255 - ink[0]) * mult);
      buf[idx + 1] = Math.round(ink[1] + (255 - ink[1]) * mult);
      buf[idx + 2] = Math.round(ink[2] + (255 - ink[2]) * mult);
    }
  }
  return buf;
}

// Build a fine luminance-noise buffer (grayscale) centered at 128, small variance.
function buildGrain(w, h, amount, seed) {
  let a = seed | 0;
  function rnd() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  const buf = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) {
    const n = (rnd() * 2 - 1) * amount; // -amount..amount
    buf[i] = Math.max(0, Math.min(255, Math.round(128 + n * 255)));
  }
  return buf;
}

async function grade(inputPath, outputPath, opts) {
  const img = sharp(inputPath);
  const meta = await img.metadata();
  const w = meta.width, h = meta.height;
  const ink = opts.ink || [8, 8, 7];

  const vignette = buildVignette(w, h, opts.vignetteStrength ?? 0.55, opts.focusX ?? 0.58, opts.focusY ?? 0.46, ink);
  const vignetteImg = sharp(vignette, { raw: { width: w, height: h, channels: 3 } }).png();

  let pipeline = sharp(inputPath).composite([
    { input: await vignetteImg.toBuffer(), blend: 'multiply' },
  ]);

  if (opts.grain) {
    const grain = buildGrain(w, h, opts.grainAmount ?? 0.035, opts.seed ?? 99);
    const grainImg = await sharp(grain, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer();
    pipeline = sharp(await pipeline.png().toBuffer()).composite([
      { input: grainImg, blend: 'overlay', tile: false },
    ]);
  }

  await pipeline.toFile(outputPath);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await grade(args.in, args.out, {
    vignetteStrength: parseFloat(args.vignette || '0.55'),
    grain: args.grain !== '0',
    grainAmount: parseFloat(args.grainAmount || '0.035'),
    focusX: parseFloat(args.focusX || '0.58'),
    focusY: parseFloat(args.focusY || '0.46'),
  });
  console.log('graded ->', args.out);
}

main().catch((e) => { console.error(e); process.exit(1); });
