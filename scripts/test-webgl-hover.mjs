import { chromium } from 'playwright'

const BASE = process.env.PREVIEW_URL ?? 'http://localhost:5190'

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.goto(`${BASE}/#work`, { waitUntil: 'networkidle', timeout: 60_000 })
  await page.waitForSelector('[data-featured-project]', { timeout: 15_000 })

  const first = page.locator('[data-featured-project]').first()
  const box = await first.boundingBox()
  if (!box) throw new Error('No featured project box')

  const before = await first.screenshot({ type: 'png' })
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.45)
  await page.waitForTimeout(400)
  const during = await first.screenshot({ type: 'png' })
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.3)
  await page.waitForTimeout(400)
  const after = await first.screenshot({ type: 'png' })

  const blank = (buf) => buf.length < 8_000
  if (blank(before) || blank(during) || blank(after)) {
    throw new Error('Screenshot too small — image may have disappeared')
  }

  const mean = (buf) => buf.reduce((a, b) => a + b, 0) / buf.length
  if (Math.abs(mean(during) - mean(before)) > mean(before) * 0.85) {
    console.warn('Large luminance shift on hover — check artifacts')
  }

  console.log('OK: featured project visible before/during/after hover')
  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
