/**
 * Verifies WebGL displacement ripple on all featured projects.
 * Run: npm run dev (5190) then npm run test:webgl-hover
 */
import { chromium } from 'playwright'
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = process.env.PREVIEW_URL ?? 'http://localhost:5190'
const MIN_PIXEL_DIFF = 0.05
const SAVE_SHOTS = process.env.SAVE_SHOTS === '1'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SHOTS_DIR = path.join(__dirname, 'screenshots', 'webgl-hover')

async function decodePng(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return { data, width: info.width, height: info.height }
}

/** Fraction of pixels that differ by more than threshold (0–255 RGB sum). */
function diffRatio(a, b, width, height, threshold = 10) {
  if (a.length !== b.length) throw new Error('Raw buffer size mismatch')
  const x0 = Math.floor(width * 0.18)
  const x1 = Math.floor(width * 0.82)
  const y0 = Math.floor(height * 0.18)
  const y1 = Math.floor(height * 0.82)
  let diff = 0
  let pixels = 0
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * width + x) * 4
      const d =
        Math.abs(a[i] - b[i]) +
        Math.abs(a[i + 1] - b[i + 1]) +
        Math.abs(a[i + 2] - b[i + 2])
      if (d > threshold) diff++
      pixels++
    }
  }
  return diff / pixels
}

async function hoverRippleOnCanvas(page, projectEl, index) {
  await projectEl.scrollIntoViewIfNeeded()
  await projectEl.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await page.waitForTimeout(600)
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))

  const webgl = projectEl.locator('.project-webgl').first()
  await webgl.waitFor({ state: 'attached', timeout: 12_000 })
  await webgl.waitFor({ state: 'visible', timeout: 12_000 })

  const status = await webgl.getAttribute('data-webgl-status')
  if (status !== 'ready') {
    throw new Error(`Project #${index}: expected data-webgl-status=ready, got "${status}"`)
  }

  const meta = await projectEl.evaluate((node) => {
    const canvas = node.querySelector('.project-webgl canvas')
    const webglEl = node.querySelector('.project-webgl')
    return {
      canvasReady: canvas?.getAttribute('data-webgl-canvas-ready') ?? null,
      canvasDisplay: canvas ? getComputedStyle(canvas).display : null,
      pointerEvents: webglEl ? getComputedStyle(webglEl).pointerEvents : null,
    }
  })
  if (meta.canvasReady !== 'true') {
    throw new Error(`Project #${index}: canvas not marked ready: ${JSON.stringify(meta)}`)
  }
  if (meta.canvasDisplay === 'none' || meta.pointerEvents !== 'auto') {
    throw new Error(`Project #${index}: canvas not visible/interactive: ${JSON.stringify(meta)}`)
  }

  const target = projectEl.locator('.project-interactive, [data-featured-visual]').first()
  const box = await target.boundingBox()
  if (!box) throw new Error(`Project #${index}: no interactive/visual bounding box`)

  const cx = box.x + box.width * 0.5
  const cy = box.y + box.height * 0.45
  const canvas = webgl.locator('canvas')

  // Let scroll intro ripple settle so baseline ≈ flat image
  await page.waitForTimeout(1000)
  const beforePng = await canvas.screenshot({ type: 'png' })
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
  await page.mouse.move(cx - 90, cy - 50)
  await page.waitForTimeout(100)
  await page.mouse.move(cx, cy, { steps: 22 })
  await page.waitForTimeout(380)
  await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.38, { steps: 18 })
  const dwell = index >= 4 ? 1100 : 750
  await page.waitForTimeout(dwell)
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
  const duringPng = await canvas.screenshot({ type: 'png' })

  if (SAVE_SHOTS) {
    const prefix = `project-${index}`
    await writeFile(path.join(SHOTS_DIR, `${prefix}-before.png`), beforePng)
    await writeFile(path.join(SHOTS_DIR, `${prefix}-hover.png`), duringPng)
  }

  const before = await decodePng(beforePng)
  const during = await decodePng(duringPng)
  if (before.width !== during.width || before.height !== during.height) {
    throw new Error(`Project #${index}: canvas size changed during hover`)
  }

  const ratio = diffRatio(before.data, during.data, before.width, before.height)
  return ratio
}

async function main() {
  if (SAVE_SHOTS) await mkdir(SHOTS_DIR, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(`${BASE}/#work`, { waitUntil: 'networkidle', timeout: 60_000 })
  await page.waitForTimeout(1600)

  const count = await page.locator('[data-webgl-status="ready"]').count()
  if (count < 4) {
    throw new Error(`Expected 4 ready WebGL layers, got ${count}`)
  }

  const viewportW = page.viewportSize()?.width ?? 1440
  const minBleedW = viewportW * 0.95

  const bleedVisuals = page.locator('#work [data-featured-visual]')
  const bleedCount = await bleedVisuals.count()
  if (bleedCount < 4) {
    throw new Error(`Expected ≥4 bleed-full project visuals, got ${bleedCount}`)
  }

  for (let i = 0; i < bleedCount; i++) {
    const el = bleedVisuals.nth(i)
    await el.scrollIntoViewIfNeeded()
    const box = await el.boundingBox()
    if (!box) throw new Error(`Bleed visual #${i + 1}: no bounding box`)
    if (box.width < minBleedW) {
      throw new Error(
        `Bleed visual #${i + 1} not viewport-wide: ${Math.round(box.width)}px < ${Math.round(minBleedW)}px (95% of ${viewportW}px)`,
      )
    }
  }

  const visual = page.locator('#work [data-featured-visual]').first()

  const projects = await page.locator('[data-featured-project]').all()
  const ratios = []

  for (let i = 0; i < projects.length; i++) {
    const ratio = await hoverRippleOnCanvas(page, projects[i], i + 1)
    ratios.push(ratio)
  }

  const weak = ratios
    .map((r, i) => ({ i: i + 1, pct: (r * 100).toFixed(2) }))
    .filter((x) => ratios[x.i - 1] < MIN_PIXEL_DIFF)
  if (weak.length) {
    throw new Error(
      `Displacement too weak: ${weak.map((w) => `#${w.i} ${w.pct}%`).join(', ')} (need ≥${MIN_PIXEL_DIFF * 100}%)`,
    )
  }

  console.log(
    'OK: 4 featured projects — WebGL ready, canvas visible, hover ripple ≥5% (center ROI)',
  )
  ratios.forEach((r, i) => {
    console.log(`  project ${i + 1}: ${(r * 100).toFixed(2)}% pixels changed`)
  })
  if (SAVE_SHOTS) console.log(`Screenshots: ${SHOTS_DIR}`)

  await browser.close()
}

main().catch((err) => {
  console.error('FAIL:', err.message || err)
  process.exit(1)
})
