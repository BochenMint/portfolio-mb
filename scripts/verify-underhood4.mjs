/**
 * "Pod maską" round 4 — chapters, flicker, wheel interior.
 *
 * Run: npm run dev (5190), then `node scripts/verify-underhood4.mjs`.
 * Output: the scratchpad folder named by OUT_DIR below.
 */
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const BASE = process.env.PREVIEW_URL ?? 'http://localhost:5190'
const OUT_DIR =
  process.env.OUT_DIR ??
  'C:/Users/marci/AppData/Local/Temp/claude/D--PORTFOLIO-MB/82147a35-e1b2-47a5-be8e-a9aeec29f6de/scratchpad/underhood4'

const ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']

/** Explode windows, mirrored from carAssets.ts. */
const WINDOWS = {
  body: [0, 0],
  engineCover: [0.1, 0.2],
  powerUnit: [0.19, 0.3],
  rearWing: [0.29, 0.4],
  frontWing: [0.39, 0.5],
  wheels: [0.49, 0.6],
  halo: [0.59, 0.7],
  steering: [0.69, 0.8],
}
const ORDER = Object.keys(WINDOWS)

async function open(browser, { width, height, theme = 'dark', debug = false }) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
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
  await page.goto(`${BASE}/${debug ? '?debug=1' : ''}`, { waitUntil: 'load' })
  await page.evaluate((t) => {
    document.documentElement.dataset.theme = t
  }, theme)
  await page.waitForFunction(() => !!document.querySelector('#pod-maska canvas'), null, {
    timeout: 30_000,
  })
  // Give the Draco decode + first fit time on swiftshader.
  await page.waitForTimeout(4000)
  return page
}

/** Scroll the pin to a given 0..1 progress and let the scrub catch up. */
async function toProgress(page, p) {
  await page.evaluate((prog) => {
    const section = document.querySelector('#pod-maska')
    const top = section.getBoundingClientRect().top + window.scrollY
    const perChapter = window.innerWidth >= 1024 ? 0.7 : 0.55
    window.scrollTo({ top: top + prog * 8 * perChapter * window.innerHeight, behavior: 'instant' })
  }, p)
  await page.waitForTimeout(1600)
}

async function readState(page) {
  return page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('#pod-maska .uh-row'))
    const cur = rows.findIndex((r) => r.dataset.state === 'current')
    const card = document.querySelector('#pod-maska .uh-ch[data-on="true"]')
    return {
      railIndex: cur,
      railStates: rows.map((r) => r.dataset.state),
      chapterTitle: card?.querySelector('.uh-ch-title')?.textContent ?? null,
      chapterIndex: card?.querySelector('.uh-ch-index')?.textContent ?? null,
      introOn: document.querySelector('#pod-maska .uh-intro')?.dataset.on ?? null,
    }
  })
}

const log = []
const say = (line) => {
  console.log(line)
  log.push(line)
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const browser = await chromium.launch({ args: ARGS })

  /* ---- 1. Desktop chapters, dark ---------------------------------- */
  {
    const page = await open(browser, { width: 1440, height: 900 })
    for (const n of [1, 3, 5, 8]) {
      const id = ORDER[n - 1]
      const [a, b] = WINDOWS[id]
      const p = b > a ? a + 0.045 : 0.08
      await toProgress(page, p)
      const state = await readState(page)
      say(
        `chapter-${String(n).padStart(2, '0')}  p=${p.toFixed(3)}  ` +
          `rail=${state.railIndex + 1}  card="${state.chapterIndex}" "${state.chapterTitle}"  ` +
          `intro=${state.introOn}`,
      )
      await page.screenshot({ path: path.join(OUT_DIR, `chapter-${String(n).padStart(2, '0')}.png`) })
    }

    /* ---- 3. Hover path, 40 steps -------------------------------- */
    await toProgress(page, 0.55)
    const probe = await page.evaluate(() => {
      const host = document.querySelector('#pod-maska canvas').getBoundingClientRect()
      const rail = document.querySelector('#pod-maska .uh-rail').getBoundingClientRect()
      window.__hoverLog = []
      window.__mutations = 0
      const mo = new MutationObserver((recs) => {
        window.__mutations += recs.length
      })
      mo.observe(document.querySelector('#pod-maska'), {
        childList: true,
        subtree: true,
        characterData: true,
      })
      // Sample what the section believes is current, on every frame.
      const tick = () => {
        const row = document.querySelector('#pod-maska .uh-row[data-state="current"]')
        const id = row ? row.querySelector('.uh-row-n').textContent : null
        const last = window.__hoverLog[window.__hoverLog.length - 1]
        if (!last || last.id !== id) window.__hoverLog.push({ id, t: performance.now() })
        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
      return { host, rail }
    })

    const rects = []
    const { host } = probe
    const y = host.y + host.height / 2
    for (let i = 0; i <= 40; i++) {
      const x = host.x + 12 + ((host.width - 24) * i) / 40
      await page.mouse.move(x, y + Math.sin(i / 3) * host.height * 0.28, { steps: 3 })
      await page.waitForTimeout(45)
      rects.push(
        await page.evaluate(() => {
          const r = document.querySelector('#pod-maska .uh-rail').getBoundingClientRect()
          return [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 100) / 100).join(',')
        }),
      )
    }

    const result = await page.evaluate(() => ({
      log: window.__hoverLog,
      mutations: window.__mutations,
    }))

    const gaps = []
    for (let i = 1; i < result.log.length; i++) {
      gaps.push(Math.round(result.log[i].t - result.log[i - 1].t))
    }
    const fast = gaps.filter((g) => g < 160)
    const stable = new Set(rects).size === 1

    say('')
    say('--- hover path (40 mouse steps across the canvas, p=0.55) ---')
    say(`current-layer changes: ${result.log.length - 1}`)
    say(`gaps between changes (ms): ${gaps.join(', ') || '(none)'}`)
    say(`gaps under 160 ms: ${fast.length} ${fast.length === 0 ? 'OK' : 'FAIL ' + fast.join(',')}`)
    say(`rail getBoundingClientRect distinct values across 41 samples: ${new Set(rects).size} ` +
      `${stable ? 'OK (no layout shift)' : 'FAIL'}`)
    say(`rail rect: ${rects[0]}`)
    say(`DOM mutations inside the section during the path: ${result.mutations}`)
    say('')

    // Hover from the rail must win over the scene.
    await page.hover('#pod-maska .uh-row >> nth=6')
    await page.waitForTimeout(400)
    const railHover = await readState(page)
    say(`rail hover on row 07 -> card "${railHover.chapterIndex}" "${railHover.chapterTitle}" (expect 07)`)
    await page.screenshot({ path: path.join(OUT_DIR, 'rail-hover-07.png') })

    // And the rail must actually move the pin.
    const before = await page.evaluate(() => window.scrollY)
    await page.click('#pod-maska .uh-row >> nth=3')
    await page.waitForTimeout(1600)
    const after = await page.evaluate(() => window.scrollY)
    const jumped = await readState(page)
    say(
      `rail click on row 04: scrollY ${Math.round(before)} -> ${Math.round(after)}; ` +
        `card now "${jumped.chapterIndex}" (expect 04)`,
    )

    await page.close()
  }

  /* ---- 2. Light ----------------------------------------------------- */
  {
    const page = await open(browser, { width: 1440, height: 900, theme: 'light' })
    await toProgress(page, WINDOWS.frontWing[0] + 0.045)
    await page.screenshot({ path: path.join(OUT_DIR, 'chapter-05-light.png') })
    await page.close()
  }

  /* ---- 4. Mobile ---------------------------------------------------- */
  {
    const page = await open(browser, { width: 390, height: 844 })
    await toProgress(page, WINDOWS.powerUnit[0] + 0.045)
    const state = await page.evaluate(() => {
      const card = document.querySelector('#pod-maska .uh-ch[data-on="true"]')
      const stage = document.querySelector('#pod-maska .uh-stage')
      return {
        title: card?.querySelector('.uh-ch-title')?.textContent,
        count: document.querySelector('#pod-maska .uh-step-count')?.textContent,
        overflow: Math.round(stage.scrollHeight - stage.clientHeight),
      }
    })
    say(`mobile 390x844 chapter 03: "${state.title}" stepper=${state.count} stageOverflow=${state.overflow}px`)
    await page.screenshot({ path: path.join(OUT_DIR, 'mobile-chapter-03.png') })
    await page.close()
  }

  /* ---- 5. Wheel interior close-up ----------------------------------- */
  {
    const page = await open(browser, { width: 1200, height: 900, debug: true })
    await toProgress(page, 0.95)
    await page.waitForFunction(() => window.__underhood?.ready, null, { timeout: 30_000 })
    // Front-left wheel (z = −0.81) at p = 1, seen from inside the car looking
    // outboard: exactly the view where a hollow rim or a dark plate shows.
    // Front-left wheel: assembled at z = −0.81, and at p = 1 it has slid a
    // further 0.42 out along its axle, so it sits at (1.55, 0.36, −1.23).
    // Azimuth is measured off +Z, so an azimuth near 0 puts the eye on the +Z
    // side of it — inside the car, looking outboard at the rim's inner face,
    // which is the view Marcin's screenshot was taken from.
    const shots = [
      ['wheel-inside', 20, 8, 2.8],
      ['wheel-inside-2', 48, 18, 3.0],
      ['wheel-outside', 200, 10, 2.8],
    ]
    for (const [name, az, el, dist] of shots) {
      await page.evaluate(
        ([a, e, d]) => {
          window.__underhood.setProgress(1)
          window.__underhood.setCamera(a, e, { dist: d, target: [1.55, 0.36, -1.23] })
          window.__underhood.render()
        },
        [az, el, dist],
      )
      await page.waitForTimeout(700)
      await page.evaluate(() => window.__underhood.render())
      await page.screenshot({
        path: path.join(OUT_DIR, `${name}.png`),
        clip: { x: 250, y: 150, width: 700, height: 620 },
      })
    }
    await page.close()
  }

  /* ---- 6. Hero ------------------------------------------------------ */
  {
    const page = await open(browser, { width: 1440, height: 900 })
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.waitForTimeout(2500)
    await page.screenshot({ path: path.join(OUT_DIR, 'hero.png') })
    await page.close()
  }

  await browser.close()
  await writeFile(path.join(OUT_DIR, 'hover-path.log'), log.join('\n') + '\n', 'utf8')
  console.log(`\nSaved to ${OUT_DIR}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
