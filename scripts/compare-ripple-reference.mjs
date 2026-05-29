/**
 * Hover ripple on featured work — pixel delta + short character notes for manual compare vs fromanother.love.
 * Run: npm run dev then npm run compare:ripple
 */
import { chromium } from 'playwright'
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = process.env.PREVIEW_URL ?? 'http://localhost:5190'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'screenshots', 'ripple-compare')

const NOTES = [
  'Expect: soft liquid bulge under cursor, slow trailing ripples, no full-image tilt.',
  'Avoid: harsh RGB fringing, sharp pow-brush spikes, entire plane flipping.',
  'Reference: fromanother.love → Featured work → Year of the Rabbit hover.',
]

async function decodePng(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return { data, width: info.width, height: info.height }
}

function diffRatio(a, b, threshold = 12) {
  let diff = 0
  const pixels = a.length / 4
  for (let i = 0; i < a.length; i += 4) {
    const d =
      Math.abs(a[i] - b[i]) +
      Math.abs(a[i + 1] - b[i + 1]) +
      Math.abs(a[i + 2] - b[i + 2])
    if (d > threshold) diff++
  }
  return diff / pixels
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(`${BASE}/#work`, { waitUntil: 'networkidle', timeout: 60_000 })
  await page.waitForTimeout(1400)

  const project = page.locator('[data-featured-project]').first()
  const visual = project.locator('[data-featured-visual]').first()
  const canvas = project.locator('.project-webgl canvas')
  await project.scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)

  const box = await visual.boundingBox()
  if (!box) throw new Error('no visual box')

  const cx = box.x + box.width * 0.48
  const cy = box.y + box.height * 0.42

  const restPng = await canvas.screenshot({ type: 'png' })
  await page.mouse.move(cx - 120, cy)
  await page.waitForTimeout(80)
  await page.mouse.move(cx, cy, { steps: 18 })
  await page.waitForTimeout(520)
  await page.mouse.move(box.x + box.width * 0.58, box.y + box.height * 0.4, { steps: 12 })
  await page.waitForTimeout(600)
  const hoverPng = await canvas.screenshot({ type: 'png' })

  await writeFile(path.join(OUT, 'mint-rest.png'), restPng)
  await writeFile(path.join(OUT, 'mint-hover.png'), hoverPng)

  const rest = await decodePng(restPng)
  const hover = await decodePng(hoverPng)
  const ratio = diffRatio(rest.data, hover.data)

  const report = [
    '# Ripple compare (Mint flagship)',
    '',
    `Viewport: 1440×900 | Visual: ${Math.round(box.width)}×${Math.round(box.height)}px`,
    `Pixel change on hover: ${(ratio * 100).toFixed(2)}%`,
    '',
    '## Character checklist',
    ...NOTES.map((n) => `- ${n}`),
    '',
    'Screenshots: scripts/screenshots/ripple-compare/mint-rest.png, mint-hover.png',
  ].join('\n')

  await writeFile(path.join(OUT, 'REPORT.md'), report)
  console.log(report)
  console.log(`\nWrote ${OUT}`)

  await browser.close()
}

main().catch((err) => {
  console.error('FAIL:', err.message || err)
  process.exit(1)
})
