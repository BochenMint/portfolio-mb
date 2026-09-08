/**
 * Diagonal split composite for Plumm portfolio hero:
 * top-left = marketing homepage, bottom-right = panel preview (#panel).
 *
 * Run: npm run composite:plumm
 * Sources: public/projects/plumm/hero-full.webp, dashboard-full.webp
 */

import { access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIR = join(ROOT, 'public', 'projects', 'plumm')

const CANVAS_W = 3840
const CANVAS_H = 2160
const GAP_PX = 2
const WEBP_QUALITY = 91
const WEBP_EFFORT = 6

const WEBP_WIDTHS = [
  { suffix: 'full', width: 3840 },
  { suffix: 'hero', width: 1920 },
  { suffix: 'card', width: 1200 },
]

const SOURCES = {
  topLeft: ['hero-full.webp', 'hero-hero.webp'],
  bottomRight: ['dashboard-full.webp', 'dashboard-hero.webp'],
}

async function pickSource(candidates) {
  for (const name of candidates) {
    const path = join(DIR, name)
    try {
      await access(path)
      return path
    } catch {
      /* try next */
    }
  }
  throw new Error(`Brak pliku źródłowego: ${candidates.join(' | ')}`)
}

function triangleSvg(w, h, which) {
  const inset = GAP_PX
  if (which === 'topLeft') {
    return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <polygon points="0,0 ${w - inset},0 0,${h - inset}" fill="white"/>
</svg>`
  }
  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <polygon points="${w},${inset} ${w},${h} ${inset},${h}" fill="white"/>
</svg>`
}

async function maskedHalf(inputPath, w, h, which, position) {
  const maskPng = await sharp(Buffer.from(triangleSvg(w, h, which))).png().toBuffer()
  const resized = await sharp(inputPath).resize(w, h, { fit: 'cover', position }).toBuffer()
  return sharp(resized)
    .composite([{ input: maskPng, blend: 'dest-in' }])
    .png()
    .toBuffer()
}

async function buildComposite(w, h, heroPath, dashboardPath) {
  const [topLeft, bottomRight] = await Promise.all([
    maskedHalf(heroPath, w, h, 'topLeft', 'top'),
    maskedHalf(dashboardPath, w, h, 'bottomRight', 'center'),
  ])

  return sharp({
    create: {
      width: w,
      height: h,
      channels: 3,
      background: { r: 10, g: 10, b: 12 },
    },
  })
    .composite([
      { input: topLeft, left: 0, top: 0 },
      { input: bottomRight, left: 0, top: 0 },
    ])
    .png()
    .toBuffer()
}

async function exportVariants(pngBuffer) {
  const meta = await sharp(pngBuffer).metadata()
  const srcW = meta.width ?? CANVAS_W

  for (const { suffix, width } of WEBP_WIDTHS) {
    const targetW = Math.min(width, srcW)
    const outPath = join(DIR, `split-${suffix}.webp`)
    await sharp(pngBuffer)
      .resize(targetW, null, { withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
      .toFile(outPath)
    console.log('  ✓', outPath.replace(ROOT, ''))
  }
}

async function main() {
  const heroPath = await pickSource(SOURCES.topLeft)
  const dashboardPath = await pickSource(SOURCES.bottomRight)

  const heroMeta = await sharp(heroPath).metadata()
  const dashMeta = await sharp(dashboardPath).metadata()
  console.log('Źródła:')
  console.log('  hero:', heroPath.replace(ROOT, ''), `${heroMeta.width}×${heroMeta.height}`)
  console.log(
    '  dashboard:',
    dashboardPath.replace(ROOT, ''),
    `${dashMeta.width}×${dashMeta.height}`,
  )

  const minW = 1600
  if ((heroMeta.width ?? 0) < minW || (dashMeta.width ?? 0) < minW) {
    console.warn(
      `\n⚠ Źródła < ${minW}px — uruchom: npm run capture:screens -- --only=plumm\n`,
    )
  }

  console.log(`\nKompozyt ${CANVAS_W}×${CANVAS_H} (przekątna + ${GAP_PX}px szczelina)…`)
  const png = await buildComposite(CANVAS_W, CANVAS_H, heroPath, dashboardPath)
  await exportVariants(png)
  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
