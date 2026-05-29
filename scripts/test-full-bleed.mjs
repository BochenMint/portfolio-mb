/**
 * Asserts featured project visuals span viewport width (edge-to-edge).
 * Run: npm run dev (5190) then npm run test:full-bleed
 */
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = process.env.PREVIEW_URL ?? 'http://localhost:5190'
const MIN_RATIO = 0.98
const VIEWPORTS = [
  { width: 390, height: 844, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1440, height: 900, name: 'desktop' },
  { width: 1920, height: 1080, name: 'wide' },
]

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SHOTS_DIR = path.join(__dirname, 'screenshots', 'full-bleed')

async function measureBleed(page) {
  return page.evaluate(() => {
    const vw = window.innerWidth
    const visuals = [...document.querySelectorAll('#work [data-featured-visual]')]
    return visuals.map((el, i) => {
      const r = el.getBoundingClientRect()
      const img = el.querySelector('img')
      const canvas = el.querySelector('.project-webgl canvas')
      const media = img ?? canvas
      const mr = media?.getBoundingClientRect()
      return {
        index: i + 1,
        id: el.closest('[id^="project-"]')?.id ?? `visual-${i}`,
        visualW: r.width,
        visualLeft: r.left,
        visualRightGap: vw - r.right,
        mediaW: mr?.width ?? 0,
        mediaLeft: mr?.left ?? 0,
        vw,
        visualPct: (r.width / vw) * 100,
        mediaPct: mr ? (mr.width / vw) * 100 : 0,
      }
    })
  })
}

async function main() {
  await mkdir(SHOTS_DIR, { recursive: true })

  const browser = await chromium.launch()
  const failures = []

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
    await page.goto(`${BASE}/#work`, { waitUntil: 'networkidle', timeout: 60_000 })
    await page.waitForTimeout(1600)

    const rows = await measureBleed(page)
    const minW = vp.width * MIN_RATIO

    for (const row of rows) {
      if (row.visualW < minW) {
        failures.push(
          `${vp.name} ${row.id}: visual ${Math.round(row.visualW)}px (${row.visualPct.toFixed(1)}% of ${row.vw}px), need ≥${Math.round(minW)}px`,
        )
      }
      if (row.mediaW > 0 && row.mediaW < minW) {
        failures.push(
          `${vp.name} ${row.id}: media ${Math.round(row.mediaW)}px (${row.mediaPct.toFixed(1)}%), need ≥${Math.round(minW)}px`,
        )
      }
      if (Math.abs(row.visualLeft) > 2) {
        failures.push(`${vp.name} ${row.id}: visual left offset ${row.visualLeft.toFixed(1)}px`)
      }
    }

    const first = page.locator('#work [data-featured-visual]').first()
    await first.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)
    const shot = path.join(SHOTS_DIR, `bleed-${vp.name}.png`)
    await page.screenshot({ path: shot, fullPage: false })
    console.log(`[${vp.name}] ${rows.length} visuals — widths: ${rows.map((r) => `${r.visualPct.toFixed(1)}%`).join(', ')}`)
    console.log(`  screenshot: ${shot}`)

    await page.close()
  }

  await browser.close()

  if (failures.length) {
    console.error('FAIL:\n' + failures.join('\n'))
    process.exit(1)
  }

  console.log(`OK: all featured visuals ≥${MIN_RATIO * 100}% viewport at ${VIEWPORTS.length} breakpoints`)
}

main().catch((err) => {
  console.error('FAIL:', err.message || err)
  process.exit(1)
})
