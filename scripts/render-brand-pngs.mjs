import sharp from 'sharp'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const brand = join(root, 'public', 'brand')

// The brand SVGs use a 64-unit viewBox. Rasterise at a density that matches the
// target size, otherwise sharp renders them at 64px and upscales the blur.
const DENSITY_BASE = 72 / 64

async function renderIcon(name, outName, size, { scale = 1, background = '#0b0c0f' } = {}) {
  const svg = await readFile(join(brand, name), 'utf8')
  const inner = Math.round(size * scale)
  const art = await sharp(Buffer.from(svg), { density: Math.round(DENSITY_BASE * inner * 4) })
    .resize(inner, inner)
    .png()
    .toBuffer()

  const pad = Math.round((size - inner) / 2)
  await sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: art, left: pad, top: pad }])
    .png({ compressionLevel: 9 })
    .toFile(join(brand, outName))
  console.log(`✓ ${outName} (${size}×${size})`)
}

async function renderOg(name, outName) {
  const svg = await readFile(join(brand, name), 'utf8')
  await sharp(Buffer.from(svg))
    .resize(1200, 630)
    .png({ compressionLevel: 9 })
    .toFile(join(brand, outName))
  console.log(`✓ ${outName} (1200×630)`)
}

// iOS applies its own rounded mask, so the tile is full-bleed with the helmet
// held back a little from the edges.
await renderIcon('mark.svg', 'apple-touch-icon.png', 180, { scale: 0.88 })
await renderIcon('mark.svg', 'icon-192.png', 192, { scale: 0.88 })
// Maskable: Android can crop to a circle inscribed in the 80% safe zone.
await renderIcon('mark.svg', 'icon-512.png', 512, { scale: 0.7 })
// Social / brand hero: the chrome variant on black.
await renderIcon('logo-mb-chrome.svg', 'logo-helmet-1200.png', 1200, { scale: 0.78 })

const publicDir = join(root, 'public')
const faviconSvg = await readFile(join(publicDir, 'favicon.svg'), 'utf8')
await sharp(Buffer.from(faviconSvg), { density: 288 })
  .resize(32, 32)
  .png({ compressionLevel: 9 })
  .toFile(join(brand, 'favicon-32.png'))
console.log('✓ favicon-32.png (32×32)')

await renderOg('og-default.svg', 'og-default.png')
await renderOg('og-mb-ai.svg', 'og-mb-ai.png')

console.log('Brand PNGs rendered.')
