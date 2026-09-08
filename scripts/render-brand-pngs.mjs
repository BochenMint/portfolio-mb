import sharp from 'sharp'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const brand = join(root, 'public', 'brand')

async function renderSvg(name, outName, width, height, options = {}) {
  const svg = await readFile(join(brand, name), 'utf8')
  let pipeline = sharp(Buffer.from(svg)).resize(width, height, {
    fit: 'contain',
    background: options.background ?? '#0A100D',
  })

  if (options.extend) {
    pipeline = pipeline.extend(options.extend)
  }

  await pipeline.png({ compressionLevel: 9, palette: options.palette }).toFile(join(brand, outName))
  console.log(`✓ ${outName} (${width}×${height})`)
}

async function renderOg(name, outName) {
  const svg = await readFile(join(brand, name), 'utf8')
  await sharp(Buffer.from(svg))
    .resize(1200, 630)
    .png({ compressionLevel: 9 })
    .toFile(join(brand, outName))
  console.log(`✓ ${outName} (1200×630)`)
}

await renderSvg('mark.svg', 'apple-touch-icon.png', 180, 180, {
  background: '#0A100D',
  extend: { top: 0, bottom: 0, left: 0, right: 0 },
})

const publicDir = join(root, 'public')
const faviconSvg = await readFile(join(publicDir, 'favicon.svg'), 'utf8')
await sharp(Buffer.from(faviconSvg))
  .resize(32, 32, { fit: 'contain', background: '#0A100D' })
  .png({ compressionLevel: 9 })
  .toFile(join(brand, 'favicon-32.png'))
console.log('✓ favicon-32.png (32×32)')

await renderOg('og-default.svg', 'og-default.png')
await renderOg('og-mb-ai.svg', 'og-mb-ai.png')

console.log('Brand PNGs rendered.')
