/**
 * Optimize founder portrait → public/images (WebP q=88, 400w/800w srcset, JPG fallback).
 * Run: node scripts/optimize-portrait.mjs [sourcePath]
 */
import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'public', 'images')
const WEBP_QUALITY = 88
const JPG_QUALITY = 88

const defaultSource = join(
  ROOT,
  '..',
  '..',
  'Users',
  'marci',
  '.cursor',
  'projects',
  'c-MINT-APARTMENTS-MINTAPARTMENTS-2-0',
  'assets',
  'c__Users_marci_AppData_Roaming_Cursor_User_workspaceStorage_27a1cac5279a0c7112fc9f0b31d3d2d0_images_marcin-bochenek-founder-ceo-plumm-fbdc1a1c-c388-4aea-84c4-72b9f245ca20.png',
)

const source = process.argv[2] || defaultSource
const base = 'marcin-bochenek'

async function writeVariant(input, width, filename) {
  const outPath = join(OUT, filename)
  await sharp(input)
    .resize(width, null, { withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outPath)
  console.log('  ✓', outPath.replace(ROOT, ''))
}

const meta = await sharp(source).metadata()
const srcW = meta.width || 1200
const mainW = Math.min(1200, srcW)

await mkdir(OUT, { recursive: true })
console.log('Source:', source)
console.log('Optimizing portrait (WebP q=%d)…', WEBP_QUALITY)

await writeVariant(source, mainW, `${base}.webp`)
await writeVariant(source, 400, `${base}-400w.webp`)
await writeVariant(source, 800, `${base}-800w.webp`)

const jpgPath = join(OUT, `${base}.jpg`)
await sharp(source)
  .resize(mainW, null, { withoutEnlargement: true })
  .jpeg({ quality: JPG_QUALITY, mozjpeg: true })
  .toFile(jpgPath)
console.log('  ✓', jpgPath.replace(ROOT, ''))

console.log('\nDone.')
