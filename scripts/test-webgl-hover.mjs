import { chromium } from 'playwright'

const BASE = process.env.PREVIEW_URL ?? 'http://localhost:5190'

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.goto(`${BASE}/#work`, { waitUntil: 'networkidle', timeout: 60_000 })
  await page.waitForSelector('[data-featured-project]', { timeout: 15_000 })

  const count = await page.locator('[data-webgl-status="ready"]').count()
  if (count < 4) {
    throw new Error(`Expected 4 ready WebGL layers, got ${count}`)
  }

  const projects = await page.locator('[data-featured-project]').all()
  for (let i = 0; i < projects.length; i++) {
    const el = projects[i]
    await el.scrollIntoViewIfNeeded()
    const box = await el.boundingBox()
    if (!box) throw new Error(`No box for project #${i + 1}`)

    const before = await el.screenshot({ type: 'png' })
    await page.mouse.move(box.x + box.width * 0.55, box.y + box.height * 0.4)
    await page.waitForTimeout(450)
    const during = await el.screenshot({ type: 'png' })
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.35)
    await page.waitForTimeout(450)
    const after = await el.screenshot({ type: 'png' })

    const blank = (buf) => buf.length < 8_000
    if (blank(before) || blank(during) || blank(after)) {
      throw new Error(`Project #${i + 1}: screenshot too small`)
    }

    let diff = 0
    for (let j = 0; j < Math.min(before.length, during.length); j++) {
      if (before[j] !== during[j]) diff++
    }
    const ratio = diff / before.length
    if (ratio < 0.002) {
      throw new Error(`Project #${i + 1}: hover produced no visible change (${(ratio * 100).toFixed(2)}%)`)
    }
  }

  console.log('OK: 4 featured projects — WebGL ready + hover displacement visible')
  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
