/**
 * Screenshots hero variants at 1440×900.
 * Prerequisite: npm run dev (port 5190)
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'screenshots', 'hero-variants')
const BASE = process.env.HERO_CAPTURE_URL ?? 'http://127.0.0.1:5190'
const VARIANTS = ['retro', 'type', 'orbit']

async function waitForHero(page) {
  await page.waitForSelector('[data-hero]', { timeout: 30_000 })
  await page.waitForTimeout(2500)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  for (const variant of VARIANTS) {
    const url = `${BASE}/?hero=${variant}`
    console.log('capture', url)
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
    await waitForHero(page)
    await page.screenshot({
      path: path.join(OUT, `hero-${variant}-1440.png`),
      fullPage: false,
    })
  }

  await browser.close()
  console.log('saved to', OUT)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
