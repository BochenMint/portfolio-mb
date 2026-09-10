/**
 * Hero drag verification + poster bake.
 *
 * The hero car no longer moves on its own: it sits at a front three-quarter
 * view and only turns when it is dragged. This checks that (a) the default
 * view is the one we asked for, (b) nothing moves while nobody is touching it,
 * (c) a drag turns it without changing its size, and (d) the poster and the
 * first live frame are the same picture.
 *
 * Run: npm run dev (5190), then `node scripts/verify-hero-drag.mjs`.
 * Pass `--bake` to also rewrite public/chrome/f1-hero{,-960}.webp.
 */
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const BASE = process.env.PREVIEW_URL ?? 'http://localhost:5190'
const OUT_DIR =
  process.env.OUT_DIR ??
  'C:/Users/marci/AppData/Local/Temp/claude/D--PORTFOLIO-MB/82147a35-e1b2-47a5-be8e-a9aeec29f6de/scratchpad/herodrag'
const ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
const BAKE = process.argv.includes('--bake')

const log = []
const say = (line) => {
  console.log(line)
  log.push(line)
}

async function open(browser, { width, height, theme = 'dark', touch = false }) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
    hasTouch: touch,
    isMobile: touch,
  })
  const errors = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.addInitScript(() => {
    // Vite's HMR client otherwise keeps a socket open and the page never idles.
    class Dead {
      addEventListener() {}
      removeEventListener() {}
      send() {}
      close() {}
    }
    window.WebSocket = Dead
  })
  await page.goto(`${BASE}/?debug=1`, { waitUntil: 'load' })
  await page.evaluate((t) => {
    document.documentElement.dataset.theme = t
  }, theme)
  await page.waitForFunction(() => window.__hero?.ready, null, { timeout: 60_000 })
  // The intro tween scales `[data-hero-object]` from 0.92 for 1.4 s; measuring
  // through it would compare the car against a host that is still moving.
  await page.waitForTimeout(2800)
  page.__errors = errors
  return page
}

/**
 * Bounding box of the car inside the hero canvas, in canvas pixels.
 *
 * The canvas is transparent everywhere the car is not, so the alpha channel is
 * the silhouette. Read it straight off the drawing buffer via a 2D copy.
 */
async function carBox(page) {
  return page.evaluate(() => {
    const host = document.querySelector('[data-hero-object]')
    const canvas = host.querySelector('canvas')
    window.__hero.render()
    const w = canvas.width
    const h = canvas.height
    const c2 = document.createElement('canvas')
    c2.width = w
    c2.height = h
    const ctx = c2.getContext('2d')
    ctx.drawImage(canvas, 0, 0)
    const { data } = ctx.getImageData(0, 0, w, h)
    let x0 = w
    let x1 = -1
    let y0 = h
    let y1 = -1
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (data[(y * w + x) * 4 + 3] > 24) {
          if (x < x0) x0 = x
          if (x > x1) x1 = x
          if (y < y0) y0 = y
          if (y > y1) y1 = y
        }
      }
    }
    return { x0, x1, y0, y1, w, h, width: x1 - x0 + 1, height: y1 - y0 + 1 }
  })
}

const metrics = (page) => page.evaluate(() => window.__hero.metrics())

/** Scripted pointer drag over the hero host, in `steps` moves. */
async function drag(page, { dx, dy, steps = 30, shots = null, tag = '', measure = false }) {
  const box = await page.locator('[data-hero-object]').boundingBox()
  const sx = box.x + box.width / 2
  const sy = box.y + box.height / 2
  await page.mouse.move(sx, sy)
  await page.mouse.down()
  const samples = []
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(sx + (dx * i) / steps, sy + (dy * i) / steps)
    await page.waitForTimeout(16)
    const m = await metrics(page)
    const b = measure ? await carBox(page) : null
    samples.push({ px: m.pxPerMetre, dist: m.dist, az: m.az, el: m.el, w: b?.width ?? null })
    if (shots && shots.includes(i)) {
      await page.screenshot({ path: path.join(OUT_DIR, `${tag}-during-${i}.png`) })
    }
  }
  await page.mouse.up()
  return samples
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch({ args: ARGS })
  const allErrors = []

  /* ---- 1. Default view, both themes ------------------------------- */
  for (const theme of ['dark', 'light']) {
    const page = await open(browser, { width: 1440, height: 900, theme })
    const m = await metrics(page)
    const b = await carBox(page)
    say(
      `default/${theme}  az=${m.az.toFixed(2)}°  el=${m.el.toFixed(2)}°  ` +
        `dist=${m.dist.toFixed(3)}  fitDist=${m.fitDist.toFixed(3)}  ` +
        `car=${b.width}×${b.height}px of ${b.w}×${b.h}  fillW=${(b.width / b.w).toFixed(3)}`,
    )
    await page.screenshot({ path: path.join(OUT_DIR, `default-${theme}-1440.png`) })

    /* ---- 2. Nothing moves on its own ------------------------------ */
    if (theme === 'dark') {
      const before = await metrics(page)
      await page.waitForTimeout(3000)
      const after = await metrics(page)
      const moved = Math.abs(after.az - before.az) + Math.abs(after.el - before.el)
      say(`idle/3s     drift=${moved.toFixed(6)}° (must be 0)`)
      // And with the cursor moving across it — the old build leaned toward it.
      const box = await page.locator('[data-hero-object]').boundingBox()
      for (let i = 0; i <= 10; i++) {
        await page.mouse.move(box.x + (box.width * i) / 10, box.y + box.height * 0.4)
      }
      await page.waitForTimeout(400)
      const hovered = await metrics(page)
      say(
        `idle/hover  drift=${(Math.abs(hovered.az - before.az) + Math.abs(hovered.el - before.el)).toFixed(6)}° (must be 0)`,
      )
      await page.screenshot({ path: path.join(OUT_DIR, 'idle-after-hover-dark-1440.png') })
    }
    allErrors.push(...page.__errors.map((e) => `${theme}: ${e}`))
    await page.close()
  }

  /* ---- 3. Scripted drag: size must not change --------------------- */
  {
    const page = await open(browser, { width: 1440, height: 900 })
    const start = await metrics(page)
    const b0 = await carBox(page)
    await page.screenshot({ path: path.join(OUT_DIR, 'drag-before.png') })
    const samples = await drag(page, {
      dx: 220,
      dy: -40,
      steps: 30,
      shots: [10, 20],
      tag: 'drag',
      measure: true,
    })
    await page.waitForTimeout(1600) // let the inertia finish
    const end = await metrics(page)
    await page.screenshot({ path: path.join(OUT_DIR, 'drag-after.png') })
    say(
      `drag        az ${start.az.toFixed(2)}° → ${end.az.toFixed(2)}°  ` +
        `el ${start.el.toFixed(2)}° → ${end.el.toFixed(2)}°  ` +
        `dist ${start.dist.toFixed(4)} → ${end.dist.toFixed(4)}`,
    )
    // Scale, not silhouette: an object that turns has a bounding box that
    // breathes by design (a 5.6 m car is 2 m wide head-on and 5.6 m broadside).
    // What must not move is how many pixels a metre is worth.
    const px = [start.pxPerMetre, ...samples.map((s) => s.px), end.pxPerMetre]
    const pmin = Math.min(...px)
    const pmax = Math.max(...px)
    say(
      `drag/scale  px per metre ${pmin.toFixed(4)}…${pmax.toFixed(4)}  ` +
        `spread=${(((pmax - pmin) / ((pmax + pmin) / 2)) * 100).toFixed(4)}% ` +
        `over ${px.length} samples (budget ±1%)`,
    )
    // And the same picture from the pixels: the car's projected width measured
    // back at the angle it started from.
    await page.evaluate(
      ([az, el]) => {
        window.__hero.setCamera(az, el)
      },
      [start.az, start.el],
    )
    const b1 = await carBox(page)
    await page.evaluate(() => window.__hero.setCamera(null, null))
    say(
      `drag/width  car ${b0.width}px before, ${b1.width}px after the drag at the same angle ` +
        `(Δ=${(((b1.width - b0.width) / b0.width) * 100).toFixed(3)}%)`,
    )
    const swept = samples.map((s) => s.w)
    say(
      `drag/bbox   silhouette ${Math.min(...swept)}…${Math.max(...swept)}px across the sweep ` +
        `(expected to vary — this is the car turning, not resizing)`,
    )

    /* ---- 3b. Fling: the release has to keep going ----------------- */
    {
      // No measuring between moves this time — the round trips would put the
      // last sample outside FLING_STALE_MS and the release would stop dead,
      // which is exactly what the paused-then-released case is meant to do.
      const box = await page.locator('[data-hero-object]').boundingBox()
      const sx = box.x + box.width / 2
      const sy = box.y + box.height / 2
      await page.mouse.move(sx, sy)
      await page.mouse.down()
      for (let i = 1; i <= 12; i++) await page.mouse.move(sx + i * 12, sy)
      await page.mouse.up()
      const atRelease = await metrics(page)
      await page.waitForTimeout(120)
      const mid = await metrics(page)
      await page.waitForTimeout(1600)
      const rest = await metrics(page)
      say(
        `fling       glide after release: +${(mid.az - atRelease.az).toFixed(2)}° @120ms, ` +
          `+${(rest.az - atRelease.az).toFixed(2)}° at rest, then ` +
          `${(await metrics(page)).az === rest.az ? 'still' : 'STILL MOVING'}`,
      )

      // A drag that stops before letting go must not fling.
      await page.mouse.move(sx, sy)
      await page.mouse.down()
      for (let i = 1; i <= 12; i++) await page.mouse.move(sx - i * 12, sy)
      await page.waitForTimeout(300)
      await page.mouse.up()
      const held = await metrics(page)
      await page.waitForTimeout(700)
      const after = await metrics(page)
      say(`fling/held  paused before release: +${(after.az - held.az).toFixed(3)}° (must be 0)`)
    }

    /* ---- 4. Tilt clamp ------------------------------------------- */
    await drag(page, { dx: 0, dy: -900, steps: 20 })
    await page.waitForTimeout(1200)
    const up = await metrics(page)
    await drag(page, { dx: 0, dy: 900, steps: 20 })
    await page.waitForTimeout(1200)
    const down = await metrics(page)
    say(`tilt        max el=${up.el.toFixed(2)}° (≤28)   min el=${down.el.toFixed(2)}° (≥-4)`)

    /* ---- 5. Keyboard --------------------------------------------- */
    await page.locator('[data-hero-object]').focus()
    const kb0 = await metrics(page)
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(120)
    const kb1 = await metrics(page)
    say(`keyboard    ArrowRight Δaz=${(kb1.az - kb0.az).toFixed(2)}° (want 15)`)

    allErrors.push(...page.__errors.map((e) => `drag: ${e}`))
    await page.close()
  }

  /* ---- 6. Mobile touch drag -------------------------------------- */
  {
    const page = await open(browser, { width: 390, height: 844, touch: true })
    const host = page.locator('[data-hero-object]')
    await host.scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    await page.screenshot({ path: path.join(OUT_DIR, 'default-dark-390.png') })
    await host.screenshot({ path: path.join(OUT_DIR, 'default-dark-390-object.png') })
    const before = await metrics(page)
    const box = await page.locator('[data-hero-object]').boundingBox()
    const cx = box.x + box.width / 2
    const cy = box.y + box.height / 2
    // Mostly-horizontal: must rotate.
    await page
      .locator('[data-hero-object]')
      .dispatchEvent('pointerdown', { pointerId: 1, pointerType: 'touch', clientX: cx, clientY: cy, isPrimary: true })
    for (let i = 1; i <= 20; i++) {
      await page
        .locator('[data-hero-object]')
        .dispatchEvent('pointermove', {
          pointerId: 1,
          pointerType: 'touch',
          clientX: cx + (120 * i) / 20,
          clientY: cy + (6 * i) / 20,
          isPrimary: true,
        })
      await page.waitForTimeout(16)
    }
    await page
      .locator('[data-hero-object]')
      .dispatchEvent('pointerup', { pointerId: 1, pointerType: 'touch', clientX: cx + 120, clientY: cy + 6, isPrimary: true })
    await page.waitForTimeout(1200)
    const afterH = await metrics(page)
    say(`touch/horiz Δaz=${(afterH.az - before.az).toFixed(2)}° (must be non-zero)`)
    await host.screenshot({ path: path.join(OUT_DIR, 'touch-after-390-object.png') })

    // Mostly-vertical: must NOT rotate (the page keeps the gesture).
    const beforeV = await metrics(page)
    await page
      .locator('[data-hero-object]')
      .dispatchEvent('pointerdown', { pointerId: 2, pointerType: 'touch', clientX: cx, clientY: cy, isPrimary: true })
    for (let i = 1; i <= 20; i++) {
      await page
        .locator('[data-hero-object]')
        .dispatchEvent('pointermove', {
          pointerId: 2,
          pointerType: 'touch',
          clientX: cx + (8 * i) / 20,
          clientY: cy - (140 * i) / 20,
          isPrimary: true,
        })
      await page.waitForTimeout(16)
    }
    await page
      .locator('[data-hero-object]')
      .dispatchEvent('pointerup', { pointerId: 2, pointerType: 'touch', clientX: cx + 8, clientY: cy - 140, isPrimary: true })
    await page.waitForTimeout(600)
    const afterV = await metrics(page)
    say(
      `touch/vert  Δaz=${(afterV.az - beforeV.az).toFixed(4)}° Δel=${(afterV.el - beforeV.el).toFixed(4)}° (must be 0)`,
    )
    const ta = await page.evaluate(
      () => getComputedStyle(document.querySelector('[data-hero-object]')).touchAction,
    )
    say(`touch/css   touch-action=${ta}`)
    allErrors.push(...page.__errors.map((e) => `mobile: ${e}`))
    await page.close()
  }

  /* ---- 7. Poster bake -------------------------------------------- */
  if (BAKE) {
    const page = await open(browser, { width: 1440, height: 900 })
    const url = await page.evaluate(() => window.__hero.snapshot(1920, 1200))
    const png = Buffer.from(url.split(',')[1], 'base64')
    const pngPath = path.join(OUT_DIR, 'f1-hero-1920.png')
    await writeFile(pngPath, png)
    await sharp(png).webp({ quality: 82 }).toFile(path.join(ROOT, 'public/chrome/f1-hero.webp'))
    await sharp(png)
      .resize(960, 600)
      .webp({ quality: 82 })
      .toFile(path.join(ROOT, 'public/chrome/f1-hero-960.webp'))
    const meta = await sharp(png).metadata()
    say(`poster      baked ${meta.width}×${meta.height} → public/chrome/f1-hero{,-960}.webp`)
    // The scene must have come back to the host's own size afterwards.
    const after = await metrics(page)
    say(`poster/back aspect=${after.aspect.toFixed(4)} az=${after.az.toFixed(2)}° el=${after.el.toFixed(2)}°`)
    allErrors.push(...page.__errors.map((e) => `bake: ${e}`))
    await page.close()
  }

  /* ---- 8. Poster vs first frame ---------------------------------- */
  {
    const page = await open(browser, { width: 1440, height: 900 })
    const cmp = await page.evaluate(async () => {
      // The canvas box, not the host's: the intro tween leaves a transform on
      // the host and `getBoundingClientRect` reports the transformed size.
      const canvas = document.querySelector('[data-hero-object] canvas')
      const r = canvas.getBoundingClientRect()
      const img = new Image()
      await new Promise((res, rej) => {
        img.onload = res
        img.onerror = rej
        img.src = '/chrome/f1-hero.webp?cachebust=' + Date.now()
      })
      // Reproduce object-contain inside the host box, then measure the car's
      // painted width the same way the canvas is measured.
      const scale = Math.min(r.width / img.naturalWidth, r.height / img.naturalHeight)
      const dw = Math.round(img.naturalWidth * scale)
      const dh = Math.round(img.naturalHeight * scale)
      const c = document.createElement('canvas')
      c.width = dw
      c.height = dh
      const ctx = c.getContext('2d')
      ctx.drawImage(img, 0, 0, dw, dh)
      const { data } = ctx.getImageData(0, 0, dw, dh)
      let x0 = dw
      let x1 = -1
      let y0 = dh
      let y1 = -1
      for (let y = 0; y < dh; y++) {
        for (let x = 0; x < dw; x++) {
          if (data[(y * dw + x) * 4 + 3] > 24) {
            if (x < x0) x0 = x
            if (x > x1) x1 = x
            if (y < y0) y0 = y
            if (y > y1) y1 = y
          }
        }
      }
      return {
        hostW: r.width,
        hostH: r.height,
        posterW: img.naturalWidth,
        posterH: img.naturalHeight,
        drawnAt: [dw, dh],
        car: { w: x1 - x0 + 1, h: y1 - y0 + 1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 + (r.height - dh) / 2 },
      }
    })
    const live = await carBox(page)
    const dpr = await page.evaluate(() => {
      const c = document.querySelector('[data-hero-object] canvas')
      return c.width / c.getBoundingClientRect().width
    })
    const liveW = live.width / dpr
    const liveCx = ((live.x0 + live.x1) / 2) / dpr
    const liveCy = ((live.y0 + live.y1) / 2) / dpr
    say(
      `poster      ${cmp.posterW}×${cmp.posterH}, drawn ${cmp.drawnAt[0]}×${cmp.drawnAt[1]} in a ` +
        `${Math.round(cmp.hostW)}×${Math.round(cmp.hostH)} host`,
    )
    say(
      `handover    poster car w=${cmp.car.w.toFixed(1)}  live car w=${liveW.toFixed(1)}  ` +
        `Δ=${(((liveW - cmp.car.w) / cmp.car.w) * 100).toFixed(2)}%`,
    )
    say(
      `handover    centre poster (${cmp.car.cx.toFixed(1)}, ${cmp.car.cy.toFixed(1)}) ` +
        `live (${liveCx.toFixed(1)}, ${liveCy.toFixed(1)})`,
    )
    allErrors.push(...page.__errors.map((e) => `handover: ${e}`))
    await page.close()
  }

  say(allErrors.length ? `console    ${allErrors.length} error(s):\n  ${allErrors.join('\n  ')}` : 'console     clean')

  await browser.close()
  await writeFile(path.join(OUT_DIR, 'report.txt'), log.join('\n') + '\n', 'utf8')
  console.log('\nwrote', OUT_DIR)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
