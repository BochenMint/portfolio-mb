#!/usr/bin/env node
/**
 * Procedural "brushed mercury" texture generator.
 *
 * Produces a strictly horizontal brushed-metal texture (no diagonal
 * scratches, no grain speckles) in a neutral, slightly cool grey —
 * mercury, not champagne. Tileable horizontally: every row's value
 * array is built from segments that sum exactly to the image width,
 * and the softening pass wraps around (circular), so placing two
 * copies side by side produces no seam.
 *
 * Usage: node scripts/generate-brushed-texture.mjs
 * Outputs:
 *   public/chrome/brushed.webp      (2048x1024, q80)
 *   public/chrome/brushed-960.webp  (960x480,  q80 — half-size for srcset)
 */
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../public/chrome');

const WIDTH = 2048;
const HEIGHT = 1024;

// Mercury tone targets — subtle brushed metal, not TV static. Base sits at
// roughly #8f949c; per-pixel streak noise is a tight ±5% band riding on top
// of a broad, smooth sheen (see below), which is what actually reads as
// "brushed" rather than "interlaced".
const BASE_LUM = 147; // ~#8f949c mid, pre-tint
const STREAK_AMPLITUDE = BASE_LUM * 0.05; // ±5% fine streak contrast
const SUBSTREAK_AMPLITUDE = BASE_LUM * 0.022; // subtler sub-streak layer
const ROW_JITTER = BASE_LUM * 0.02; // ±2% row-to-row jitter
const SHEEN_AMPLITUDE = BASE_LUM * 0.08; // ±8% large-scale horizontal bands
const SHEEN_BANDS = 2.5; // ~2-3 soft bright bands across the height
const FALLOFF_AMPLITUDE = BASE_LUM * 0.06; // +6% top, -6% bottom
const VERTICAL_BLUR_RADIUS = 2; // 3-4px window (2*radius + 1) across rows
// Overall clamp — generous; the tight per-pixel amplitudes above plus the
// smooth sheen/falloff below never approach these, they just guard against
// pathological stacking at the extremes.
const SHADOW_LUM = 74;
const HIGHLIGHT_LUM = 232;

// Simple deterministic PRNG (mulberry32) so re-runs are reproducible.
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(0xb2005ea1);
const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const randRange = (min, max) => rand() * (max - min) + min;

function buildRow() {
  const row = new Float32Array(WIDTH);

  // 1) Base horizontal streak segments — piecewise brightness runs of
  //    300-1600px that sum exactly to WIDTH, so the row tiles perfectly.
  //    Long runs at low amplitude read as fine brush hairs; short, high-
  //    contrast runs are what made the old texture look like static.
  let x = 0;
  while (x < WIDTH) {
    let len = randInt(300, 1600);
    if (x + len > WIDTH) len = WIDTH - x;
    const delta = randRange(-STREAK_AMPLITUDE, STREAK_AMPLITUDE);
    for (let i = 0; i < len; i++) row[x + i] = delta;
    x += len;
  }

  // 2) Occasional finer sub-streaks layered on top — shorter (10-40px),
  //    subtler runs that break up the coarse segments a bit, still
  //    strictly horizontal, still wrapped within [0, WIDTH).
  if (rand() < 0.55) {
    const count = randInt(1, 4);
    for (let i = 0; i < count; i++) {
      const start = randInt(0, WIDTH - 1);
      const len = randInt(10, 40);
      const delta = randRange(-SUBSTREAK_AMPLITUDE, SUBSTREAK_AMPLITUDE);
      for (let j = 0; j < len; j++) {
        const xi = (start + j) % WIDTH;
        row[xi] += delta;
      }
    }
  }

  // 3) Circular smoothing (moving average) to soften hard segment edges
  //    into brush-hair transitions rather than blocky steps. Wraps at
  //    the row boundary to preserve horizontal tileability.
  const WINDOW = 5;
  const half = Math.floor(WINDOW / 2);
  const smoothed = new Float32Array(WIDTH);
  for (let i = 0; i < WIDTH; i++) {
    let sum = 0;
    for (let k = -half; k <= half; k++) {
      sum += row[(i + k + WIDTH) % WIDTH];
    }
    smoothed[i] = sum / WINDOW;
  }
  return smoothed;
}

// Vertical box blur (3-4px window) across rows of the streak field, clamped
// at the top/bottom edges (not circular — the texture only tiles
// horizontally). This is what keeps single-pixel-row hairlines from
// aliasing into a scanline/interlace look when the image is displayed at
// less than 1:1.
function verticalBlur(field, width, height, radius) {
  const window = radius * 2 + 1;
  const out = new Float32Array(width * height);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let sum = 0;
      let count = 0;
      for (let k = -radius; k <= radius; k++) {
        const yy = y + k;
        if (yy < 0 || yy >= height) continue;
        sum += field[yy * width + x];
        count++;
      }
      out[y * width + x] = sum / count;
    }
  }
  return out;
}

function generate() {
  const raw = Buffer.alloc(WIDTH * HEIGHT * 3);

  // 1) Build the fine streak field (row jitter + horizontal streaks) for
  //    every row first, unblurred, so the vertical blur pass can act on
  //    the whole 2D field at once.
  const streakField = new Float32Array(WIDTH * HEIGHT);
  for (let y = 0; y < HEIGHT; y++) {
    const rowJitter = randRange(-ROW_JITTER, ROW_JITTER);
    const rowLine = buildRow();
    for (let x = 0; x < WIDTH; x++) {
      streakField[y * WIDTH + x] = rowJitter + rowLine[x];
    }
  }

  // 2) Soften across rows (3-4px window) so individual hairlines don't
  //    alias into scanlines/interlace at display size.
  const blurred = verticalBlur(streakField, WIDTH, HEIGHT, VERTICAL_BLUR_RADIUS);

  for (let y = 0; y < HEIGHT; y++) {
    // 3) Large-scale anisotropic sheen: a smooth cosine band gradient
    //    (2-3 soft bright bands down the height) plus a gentle top-to-
    //    bottom falloff. Both vary only with y — strictly horizontal
    //    streaks, no diagonal features.
    const t = HEIGHT > 1 ? y / (HEIGHT - 1) : 0;
    const sheen = SHEEN_AMPLITUDE * Math.cos(2 * Math.PI * SHEEN_BANDS * t + 0.4);
    const falloff = FALLOFF_AMPLITUDE * (1 - 2 * t); // +amp at top, -amp at bottom

    for (let x = 0; x < WIDTH; x++) {
      let v = BASE_LUM + falloff + sheen + blurred[y * WIDTH + x];
      v = Math.min(HIGHLIGHT_LUM, Math.max(SHADOW_LUM, v));
      v = Math.min(255, Math.max(0, Math.round(v)));

      // Neutral, slightly cool mercury cast: R <= G <= B, spread of 2-3
      // levels, never a warm (R > G/B) reading.
      const r = Math.max(0, v - 2);
      const g = v;
      const b = Math.min(255, v + 2);

      const idx = (y * WIDTH + x) * 3;
      raw[idx] = r;
      raw[idx + 1] = g;
      raw[idx + 2] = b;
    }
  }
  return raw;
}

async function main() {
  const raw = generate();

  const full = sharp(raw, { raw: { width: WIDTH, height: HEIGHT, channels: 3 } });
  const fullPath = path.join(OUT_DIR, 'brushed.webp');
  await full.clone().webp({ quality: 80 }).toFile(fullPath);
  console.log('Wrote', fullPath);

  const halfPath = path.join(OUT_DIR, 'brushed-960.webp');
  await sharp(raw, { raw: { width: WIDTH, height: HEIGHT, channels: 3 } })
    .resize(960, 480)
    .webp({ quality: 80 })
    .toFile(halfPath);
  console.log('Wrote', halfPath);

  // Report channel means as a quick neutrality check (R <= G <= B).
  const { data } = await sharp(fullPath).raw().toBuffer({ resolveWithObject: true });
  let sr = 0,
    sg = 0,
    sb = 0;
  const n = data.length / 3;
  for (let i = 0; i < data.length; i += 3) {
    sr += data[i];
    sg += data[i + 1];
    sb += data[i + 2];
  }
  console.log('Channel means:', { r: sr / n, g: sg / n, b: sb / n });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
