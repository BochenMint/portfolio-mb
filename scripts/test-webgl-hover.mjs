import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = process.env.PREVIEW_URL ?? 'http://localhost:5190'
const SAVE_SHOTS = process.env.SAVE_SHOTS === '1'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SHOTS_DIR = path.join(__dirname, 'screenshots', 'webgl-hover')

async function main() {
  if (SAVE_SHOTS) await mkdir(SHOTS_DIR, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(`${BASE}/#work`, { waitUntil: 'networkidle', timeout: 60_000 })
  await page.waitForSelector('[data-featured-project]', { timeout: 15_000 })

  const count = await page.locator('[data-webgl-status="ready"]').count()
  if (count < 4) {
    throw new Error(`Expected 4 ready WebGL layers, got ${count}`)
  }

  const visual = page.locator('[data-featured-visual]').first()
  const visualBox = await visual.boundingBox()
  if (!visualBox) throw new Error('No featured visual box')
  const viewportW = page.viewportSize()?.width ?? 1440
  if (visualBox.width < viewportW * 0.92) {
    throw new Error(
      `Featured image not edge-to-edge: ${Math.round(visualBox.width)}px vs viewport ${viewportW}px`,
    )
  }

  const projects = await page.locator('[data-featured-project]').all()
  for (let i = 0; i < projects.length; i++) {
    const el = projects[i]
    await el.scrollIntoViewIfNeeded()
    const box = await el.boundingBox()
    if (!box) throw new Error(`No box for project #${i + 1}`)

    const before = await el.screenshot({ type: 'png' })
    await page.mouse.move(box.x + box.width * 0.55, box.y + box.height * 0.4)
    await page.waitForTimeout(520)
    const during = await el.screenshot({ type: 'png' })
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.35)
    await page.waitForTimeout(520)
    const after = await el.screenshot({ type: 'png' })

    if (SAVE_SHOTS) {
      const prefix = `project-${i + 1}`
      await writeFile(path.join(SHOTS_DIR, `${prefix}-before.png`), before)
      await writeFile(path.join(SHOTS_DIR, `${prefix}-hover.png`), during)
      await writeFile(path.join(SHOTS_DIR, `${prefix}-after.png`), after)
    }

    const blank = (buf) => buf.length < 8_000
    if (blank(before) || blank(during) || blank(after)) {
      throw new Error(`Project #${i + 1}: screenshot too small`)
    }

    let diff = 0
    for (let j = 0; j < Math.min(before.length, during.length); j++) {
      if (before[j] !== during[j]) diff++
    }
    const ratio = diff / before.length
    if (ratio < 0.0015) {
      throw new Error(`Project #${i + 1}: hover produced no visible change (${(ratio * 100).toFixed(2)}%)`)
    }
  }

  console.log('OK: 4 featured projects — WebGL ready + hover displacement + full-bleed width')
  if (SAVE_SHOTS) console.log(`Screenshots: ${SHOTS_DIR}`)
  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
