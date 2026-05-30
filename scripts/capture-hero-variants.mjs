/**
 * Screenshots hero variants at 1440×900.
 * Prerequisite: npm run dev (port 5190)
 *
 * Outputs:
 *   scripts/screenshots/hero-variants/hero-{variant}-1440.png
 *   public/hero/posters/hero-{variant}-1440.webp  (mobile posters)
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const OUT_PNG = path.join(__dirname, 'screenshots', 'hero-variants')
const OUT_WEBP = path.join(ROOT, 'public', 'hero', 'posters')
const BASE = process.env.HERO_CAPTURE_URL ?? 'http://localhost:5190'
const VARIANTS = ['retro', 'type', 'orbit']

async function waitForHero(page) {
  await page.waitForSelector('[data-hero]', { timeout: 30_000 })
  await page.waitForTimeout(3000)
}

async function main() {
  await mkdir(OUT_PNG, { recursive: true })
  await mkdir(OUT_WEBP, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  for (const variant of VARIANTS) {
    const url = `${BASE}/?hero=${variant}`
    console.log('capture', url)
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
    await waitForHero(page)
    const pngPath = path.join(OUT_PNG, `hero-${variant}-1440.png`)
    await page.screenshot({ path: pngPath, fullPage: false })
    const webpPath = path.join(OUT_WEBP, `hero-${variant}-1440.webp`)
    await sharp(pngPath).webp({ quality: 82 }).toFile(webpPath)
    console.log('  →', webpPath)
  }

  await browser.close()
  console.log('saved PNG:', OUT_PNG)
  console.log('saved WebP:', OUT_WEBP)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
