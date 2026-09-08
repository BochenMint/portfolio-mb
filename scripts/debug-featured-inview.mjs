import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BASE = process.env.PREVIEW_URL ?? 'http://localhost:5190'

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 60_000 })
  await page.waitForTimeout(2600)

  const visual = page.locator('#work [data-featured-visual]').first()
  await visual.scrollIntoViewIfNeeded()
  await page.waitForTimeout(1200)

  const metrics = await page.evaluate(() => {
    const el = document.querySelector('#work [data-featured-visual]')
    const r = el.getBoundingClientRect()
    const img = el.querySelector('img')
    const canvas = el.querySelector('canvas')
    const ir = img?.getBoundingClientRect()
    const cr = canvas?.getBoundingClientRect()
    const fillRatio =
      img && r.height > 0 ? Math.min(ir.width / r.width, ir.height / r.height) : 0
    return {
      visual: { w: r.width, h: r.height, top: r.top, left: r.left },
      img: ir
        ? {
            w: ir.width,
            h: ir.height,
            top: ir.top,
            left: ir.left,
            fillRatio,
            objectFit: getComputedStyle(img).objectFit,
            visibility: getComputedStyle(img).visibility,
            transform: getComputedStyle(img).transform,
          }
        : null,
      canvas: cr ? { w: cr.width, h: cr.height, top: cr.top } : null,
      webgl: el.querySelector('[data-webgl-status]')?.getAttribute('data-webgl-status'),
    }
  })

  console.log(JSON.stringify(metrics, null, 2))
  const shot = path.join(__dirname, 'screenshots', 'fullscreen-verify', 'mint-element-only-1440.png')
  await visual.screenshot({ path: shot })
  console.log('element screenshot:', shot)
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
