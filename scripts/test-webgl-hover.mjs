/**
 * Verifies WebGL displacement ripple on featured Mint image.
 * Run: npm run dev (5190) then node scripts/test-webgl-hover.mjs
 */
import { chromium } from 'playwright'
import sharp from 'sharp'
import { createHash } from 'node:crypto'
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const BASE = process.env.PREVIEW_URL ?? 'http://localhost:5190'
const OUT_DIR = join(process.cwd(), 'scripts', '.test-output')

function hash(buf) {
  return createHash('sha256').update(buf).digest('hex').slice(0, 16)
}

async function decodePng(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return { data, width: info.width, height: info.height }
}

/** Fraction of pixels that differ by more than threshold (0–255). */
function diffRatio(a, b, threshold = 12) {
  if (a.length !== b.length) throw new Error('Raw buffer size mismatch')
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
  mkdirSync(OUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
  })

  const logs = []
  page.on('console', (msg) => {
    const t = msg.text()
    if (msg.type() === 'error' || t.includes('WebGL') || t.includes('ProjectImage')) {
      logs.push(`[${msg.type()}] ${t}`)
    }
  })
  page.on('pageerror', (err) => logs.push(`[pageerror] ${err.message}`))

  await page.goto(`${BASE}/#work`, { waitUntil: 'networkidle', timeout: 60_000 })
  await page.waitForTimeout(1800)

  const mint = page.locator('[data-featured-project]').first()
  await mint.scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)

  const webgl = mint.locator('.project-webgl').first()
  await webgl.waitFor({ state: 'attached', timeout: 12_000 })

  const status = await webgl.getAttribute('data-webgl-status')
  if (status !== 'ready') {
    throw new Error(`Expected data-webgl-status=ready, got "${status}"`)
  }

  const meta = await mint.evaluate((node) => {
    const canvas = node.querySelector('.project-webgl canvas')
    const webglEl = node.querySelector('.project-webgl')
    return {
      hasCanvas: !!canvas,
      canvasOpacity: canvas ? getComputedStyle(canvas).opacity : null,
      pointerEvents: webglEl ? getComputedStyle(webglEl).pointerEvents : null,
      zIndex: webglEl ? getComputedStyle(webglEl).zIndex : null,
    }
  })
  if (meta.canvasOpacity !== '1' || meta.pointerEvents !== 'auto') {
    throw new Error(`Canvas not interactive: ${JSON.stringify(meta)}`)
  }

  const box = await mint.boundingBox()
  if (!box) throw new Error('No bounding box for featured project')

  const cx = box.x + box.width * 0.5
  const cy = box.y + box.height * 0.45

  const canvas = webgl.locator('canvas')
  const beforePng = await canvas.screenshot({ type: 'png' })
  writeFileSync(join(OUT_DIR, 'hover-before.png'), beforePng)

  await page.mouse.move(cx - 80, cy - 40)
  await page.waitForTimeout(120)
  await page.mouse.move(cx, cy, { steps: 12 })
  await page.waitForTimeout(350)
  await page.mouse.move(cx + 60, cy + 30, { steps: 8 })
  await page.waitForTimeout(450)

  const duringPng = await canvas.screenshot({ type: 'png' })
  writeFileSync(join(OUT_DIR, 'hover-during.png'), duringPng)

  const before = await decodePng(beforePng)
  const during = await decodePng(duringPng)
  if (before.width !== during.width || before.height !== during.height) {
    throw new Error(
      `Canvas dimensions changed (${before.width}x${before.height} vs ${during.width}x${during.height})`,
    )
  }

  const ratio = diffRatio(before.data, during.data)
  const beforeHash = hash(before.data)
  const duringHash = hash(during.data)

  console.log('Screenshots:', join(OUT_DIR, 'hover-{before,during}.png'))
  console.log('SHA before/during:', beforeHash, duringHash)
  console.log('Pixel diff ratio (hover):', (ratio * 100).toFixed(3) + '%')

  if (beforeHash === duringHash) {
    throw new Error('Screenshots identical — no visible displacement on hover')
  }
  if (ratio < 0.008) {
    throw new Error(
      `Displacement too weak (${(ratio * 100).toFixed(3)}% pixels changed, need ≥0.8%)`,
    )
  }

  if (logs.length) console.warn('Console warnings/errors:\n', logs.join('\n'))

  console.log('PASS: visible WebGL ripple on featured project hover')
  await browser.close()
}

main().catch((err) => {
  console.error('FAIL:', err.message || err)
  process.exit(1)
})
