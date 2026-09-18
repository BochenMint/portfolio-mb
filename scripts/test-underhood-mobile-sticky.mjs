/**
 * Mobile UnderHood scrollytelling: sticky stage, no GSAP pin, copy+canvas
 * visible together, progress 0→1, no CLS from pin-spacers.
 *
 * Run: npm run dev (5190), then `node scripts/test-underhood-mobile-sticky.mjs`
 */
import { chromium } from 'playwright'

const BASE = process.env.PREVIEW_URL ?? 'http://localhost:5190'
const ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']

const MOBILE = [
  { name: '320x568', width: 320, height: 568, hasTouch: true, isMobile: true },
  { name: '360x800', width: 360, height: 800, hasTouch: true, isMobile: true },
  { name: '390x844', width: 390, height: 844, hasTouch: true, isMobile: true },
  { name: '430x932', width: 430, height: 932, hasTouch: true, isMobile: true },
  { name: '844x390-land', width: 844, height: 390, hasTouch: true, isMobile: true },
]
const TABLET = [
  { name: '768x1024', width: 768, height: 1024, hasTouch: true, isMobile: true },
  { name: '1024x768', width: 1024, height: 768, hasTouch: true, isMobile: false },
]
const DESKTOP = [{ name: '1440x900', width: 1440, height: 900, hasTouch: false, isMobile: false }]

const failures = []
const log = []
const say = (line) => {
  console.log(line)
  log.push(line)
}
const fail = (msg) => {
  failures.push(msg)
  say(`FAIL  ${msg}`)
}
const ok = (msg) => say(`OK    ${msg}`)

function installCls(page) {
  return page.addInitScript(() => {
    window.__uhCls = 0
    window.__uhShifts = []
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (e.hadRecentInput) continue
          window.__uhCls += e.value
          window.__uhShifts.push({
            v: Math.round(e.value * 1000) / 1000,
            t: Math.round(e.startTime),
          })
        }
      }).observe({ type: 'layout-shift', buffered: true })
    } catch {
      /* layout-shift not available */
    }
  })
}

async function open(browser, vp, { reduced = false, theme = 'dark' } = {}) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    hasTouch: vp.hasTouch,
    isMobile: vp.isMobile,
    deviceScaleFactor: 1,
    colorScheme: theme,
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  })
  const page = await context.newPage()
  await page.addInitScript(() => {
    class Dead {
      addEventListener() {}
      removeEventListener() {}
      send() {}
      close() {}
    }
    window.WebSocket = Dead
  })
  await installCls(page)
  await page.goto(BASE, { waitUntil: 'load', timeout: 60_000 })
  await page.evaluate((t) => {
    document.documentElement.dataset.theme = t
  }, theme)
  await page.waitForSelector('#pod-maska', { timeout: 30_000 })
  await page.waitForTimeout(reduced ? 400 : 900)
  return { context, page }
}

async function measure(page) {
  return page.evaluate(() => {
    const section = document.querySelector('#pod-maska')
    const stage = document.querySelector('#pod-maska .uh-stage')
    const runway = document.querySelector('#pod-maska .uh-runway')
    const host = document.querySelector('#pod-maska .uh-canvas-host')
    const canvas = document.querySelector('#pod-maska canvas, #pod-maska video')
    const col = document.querySelector('#pod-maska .uh-col')
    const title =
      document.querySelector('#pod-maska .uh-ch[data-on="true"] .uh-ch-title') ||
      document.querySelector('#pod-maska .uh-intro[data-on="true"] h2') ||
      document.querySelector('#pod-maska h2')
    const progress = document.querySelector('#pod-maska .uh-progress')
    const stepper = document.querySelector('#pod-maska .uh-step-count')
    const nav = document.querySelector('header')
    const pinSpacers = document.querySelectorAll('.pin-spacer')
    const vh = window.innerHeight
    const vw = window.innerWidth
    const vis = (el) => {
      if (!el) return null
      const r = el.getBoundingClientRect()
      const overlap = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0))
      return {
        top: Math.round(r.top * 10) / 10,
        bottom: Math.round(r.bottom * 10) / 10,
        left: Math.round(r.left * 10) / 10,
        right: Math.round(r.right * 10) / 10,
        height: Math.round(r.height * 10) / 10,
        visible: overlap > 8,
        overlap: Math.round(overlap),
      }
    }
    const body = getComputedStyle(document.body)
    const stageCs = stage ? getComputedStyle(stage) : null
    const p = Number.parseFloat(stage?.dataset.uhP || stage?.style.getPropertyValue('--uh-p') || 'NaN')
    const rr = runway?.getBoundingClientRect()
    const span = rr ? rr.height - window.innerHeight : 0
    const geomP = span > 0 ? Math.min(1, Math.max(0, -rr.top / span)) : null
    return {
      scrollY: Math.round(window.scrollY),
      vh,
      vw,
      cls: window.__uhCls ?? null,
      pinSpacers: pinSpacers.length,
      stagePosition: stageCs?.position ?? null,
      stageOverflow: stageCs?.overflow ?? null,
      bodyOverflowY: body.overflowY,
      bodyOverflow: body.overflow,
      uhP: Number.isFinite(p) ? Math.round(p * 1000) / 1000 : null,
      geomP: geomP == null ? null : Math.round(geomP * 1000) / 1000,
      runwayH: runway?.getBoundingClientRect().height ?? null,
      sectionH: section?.getBoundingClientRect().height ?? null,
      stage: vis(stage),
      host: vis(host),
      canvas: vis(canvas),
      col: vis(col),
      title: vis(title),
      titleText: title?.textContent?.trim() ?? null,
      progress: vis(progress),
      stepper: vis(stepper),
      nav: vis(nav),
      accordion: !!document.querySelector('#pod-maska details'),
    }
  })
}

function inViewTogether(m) {
  const canvasOn = m.canvas?.visible || m.host?.visible
  const copyOn = m.title?.visible || m.col?.visible
  return canvasOn && copyOn
}

async function sampleSequence(page, steps = 10, waitMs = 80) {
  const sectionTop = await page.evaluate(() => {
    const el = document.querySelector('#pod-maska')
    return el.getBoundingClientRect().top + window.scrollY
  })
  const runwayBottom = await page.evaluate(() => {
    const el = document.querySelector('#pod-maska .uh-runway') || document.querySelector('#pod-maska')
    return el.getBoundingClientRect().bottom + window.scrollY
  })
  const vh = await page.evaluate(() => window.innerHeight)
  const start = Math.max(0, Math.round(sectionTop))
  const end = Math.max(start + 10, Math.round(runwayBottom - vh))
  const samples = []
  for (let i = 0; i <= steps; i++) {
    const y = Math.round(start + ((end - start) * i) / steps)
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
    await page.evaluate(
      () =>
        Promise.race([
          new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
          new Promise((r) => setTimeout(r, 50)),
        ]),
    )
    if (waitMs > 80) await page.waitForTimeout(waitMs)
    const m = await measure(page)
    samples.push({ i, y, ...m })
  }
  return { start, end, samples }
}

function stickyDelta(samples) {
  const active = samples.filter((s, idx) => {
    if (idx === 0 || idx === samples.length - 1) return false
    const stage = s.stage
    if (!stage) return false
    return stage.top <= 2 && stage.bottom >= s.vh - 8
  })
  if (active.length < 2) {
    const mids = samples.slice(1, -1).map((s) => s.stage?.top).filter((n) => typeof n === 'number')
    if (!mids.length) return { max: Infinity, n: 0, tops: [] }
    const min = Math.min(...mids)
    const max = Math.max(...mids)
    return { max: max - min, n: mids.length, tops: mids }
  }
  const tops = active.map((s) => s.stage.top)
  return { max: Math.max(...tops) - Math.min(...tops), n: active.length, tops }
}

async function runMobile(browser, vp) {
  say(`\n=== ${vp.name} ===`)
  const { context, page } = await open(browser, vp)
  const before = await measure(page)
  say(
    `boot  scrollY=${before.scrollY} pos=${before.stagePosition} pins=${before.pinSpacers} ` +
      `cls=${before.cls?.toFixed?.(3) ?? before.cls} accordion=${before.accordion}`,
  )

  if (before.accordion) {
    fail(`${vp.name}: motion path rendered accordion (WebGL/reduced?)`)
    await context.close()
    return
  }
  if (before.pinSpacers > 0) fail(`${vp.name}: pin-spacer present (${before.pinSpacers})`)
  else ok(`${vp.name}: no pin-spacer`)
  if (before.stagePosition !== 'sticky') fail(`${vp.name}: stage position=${before.stagePosition}, expected sticky`)
  else ok(`${vp.name}: stage position sticky`)
  if (before.bodyOverflowY === 'hidden' || before.bodyOverflow === 'hidden') {
    fail(`${vp.name}: body overflow hidden (${before.bodyOverflow}/${before.bodyOverflowY})`)
  }

  const { samples } = await sampleSequence(page, 12)
  const delta = stickyDelta(samples)
  const mid = samples[Math.floor(samples.length / 2)]
  say(
    `seq   stickyΔ=${delta.max === Infinity ? 'n/a' : delta.max.toFixed(1)}px n=${delta.n} ` +
      `midP=${mid.uhP} canvas=${mid.canvas?.visible} title="${mid.titleText}" ` +
      `titleVis=${mid.title?.visible} cls=${mid.cls?.toFixed?.(3)}`,
  )

  if (delta.max > 1.5) fail(`${vp.name}: stage moved ${delta.max.toFixed(1)}px during sequence (need ≤1px)`)
  else if (delta.n >= 3) ok(`${vp.name}: stage sticky Δ=${delta.max.toFixed(1)}px`)
  else fail(`${vp.name}: stage never locked in viewport (n=${delta.n})`)

  const together = samples.slice(1, -1).filter(inViewTogether)
  if (together.length < Math.max(3, samples.length - 4)) {
    fail(`${vp.name}: canvas+copy simultaneous only ${together.length}/${samples.length - 2} mid samples`)
  } else ok(`${vp.name}: canvas+copy together ${together.length} samples`)

  const navCover = samples.slice(1, -1).some((s) => {
    const navBottom = s.nav?.bottom ?? 0
    const titleTop = s.title?.top
    return typeof titleTop === 'number' && titleTop + 2 < navBottom && (s.title?.visible ?? false)
  })
  // Title under nav is only a fail if the title is the thing being read and is covered.
  const copyUnderCanvas = samples.slice(1, -1).some((s) => {
    if (!s.title || !s.host) return false
    const t = s.title
    const c = s.host
    const overlapX = t.left < c.right - 4 && t.right > c.left + 4
    const overlapY = t.top < c.bottom - 4 && t.bottom > c.top + 4
    return t.visible && overlapX && overlapY && t.top > c.top + 10
  })
  if (copyUnderCanvas) fail(`${vp.name}: chapter copy overlaps canvas host`)
  else ok(`${vp.name}: copy clear of canvas`)
  void navCover

  const ps = samples.map((s) => s.geomP ?? s.uhP).filter((p) => typeof p === 'number')
  if (ps.length >= 4) {
    const first = ps[0]
    const last = ps[ps.length - 1]
    if (last - first < 0.7) fail(`${vp.name}: progress ${first}→${last}, expected ~0→1`)
    else ok(`${vp.name}: progress ${first}→${last}`)
    let rewind = 0
    for (let i = 1; i < ps.length; i++) if (ps[i] + 0.04 < ps[i - 1]) rewind++
    if (rewind > 1) fail(`${vp.name}: progress rewound ${rewind} times`)
  } else fail(`${vp.name}: progress not readable (${JSON.stringify(ps.slice(0, 3))})`)

  const yMid = samples[Math.floor(samples.length / 2)].y
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), yMid)
  await page.waitForTimeout(50)
  const y1 = await page.evaluate(() => window.scrollY)
  await page.waitForTimeout(400)
  const y2 = await page.evaluate(() => window.scrollY)
  if (Math.abs(y2 - y1) > 2) fail(`${vp.name}: scrollY auto-rewound ${Math.round(y1)}→${Math.round(y2)}`)
  else ok(`${vp.name}: scrollY stable at ${Math.round(y2)}`)

  // Reverse
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), samples[samples.length - 1].y)
  await page.waitForTimeout(40)
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), samples[1].y)
  await page.waitForTimeout(80)
  const back = await measure(page)
  if (!inViewTogether(back)) fail(`${vp.name}: reverse scroll lost canvas+copy`)
  else ok(`${vp.name}: reverse still shows canvas+copy`)

  // Fast fling through the track
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), samples[0].y)
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), samples[samples.length - 1].y)
  await page.waitForTimeout(120)
  const afterFling = await measure(page)
  if (afterFling.cls > 0.1) fail(`${vp.name}: CLS ${afterFling.cls.toFixed(3)} after fling`)
  else ok(`${vp.name}: CLS ${afterFling.cls?.toFixed?.(3) ?? afterFling.cls}`)

  await page.evaluate((t) => {
    document.documentElement.dataset.theme = t
  }, 'light')
  await page.waitForTimeout(200)
  const light = await measure(page)
  if (!inViewTogether(light) && light.stage?.visible) {
    fail(`${vp.name}: light theme lost simultaneous canvas+copy`)
  }

  await context.close()
}

async function runDesktop(browser, vp) {
  say(`\n=== ${vp.name} desktop ===`)
  const { context, page } = await open(browser, vp)
  const boot = await measure(page)
  const { samples } = await sampleSequence(page, 8, 500)
  const mid = samples[Math.floor(samples.length / 2)]
  say(
    `boot pos=${boot.stagePosition} pins=${boot.pinSpacers} ` +
      `mid canvas=${mid.canvas?.visible} title="${mid.titleText}" p=${mid.uhP} cls=${mid.cls?.toFixed?.(3)}`,
  )
  if (!inViewTogether(mid)) fail(`${vp.name}: desktop mid-sequence missing canvas+copy`)
  else ok(`${vp.name}: desktop scrollytelling still shows canvas+copy`)
  const ps = samples.map((s) => s.geomP ?? s.uhP).filter((p) => typeof p === 'number')
  if (ps.length && ps[ps.length - 1] - ps[0] < 0.5) {
    fail(`${vp.name}: desktop progress ${ps[0]}→${ps[ps.length - 1]}`)
  }
  await context.close()
}

async function runReduced(browser) {
  say(`\n=== reduced-motion 390x844 ===`)
  const { context, page } = await open(browser, MOBILE[2], { reduced: true })
  const m = await measure(page)
  say(`accordion=${m.accordion} sectionH=${m.sectionH} vh=${m.vh} pos=${m.stagePosition}`)
  if (!m.accordion) fail('reduced: expected accordion fallback, got scrollytelling track')
  else ok('reduced: accordion fallback')
  if (m.sectionH && m.sectionH > m.vh * 2.2) fail(`reduced: track still tall (${Math.round(m.sectionH)}px)`)
  else ok(`reduced: compact section ${Math.round(m.sectionH ?? 0)}px`)
  await context.close()
}

async function launchBrowser() {
  try {
    return await chromium.launch({ args: ARGS })
  } catch {
    return await chromium.launch({ channel: 'chrome', args: ARGS })
  }
}

async function main() {
  const browser = await launchBrowser()
  try {
    for (const vp of MOBILE) await runMobile(browser, vp)
    for (const vp of TABLET) {
      if (vp.width >= 1024) await runDesktop(browser, vp)
      else await runMobile(browser, vp)
    }
    for (const vp of DESKTOP) await runDesktop(browser, vp)
    await runReduced(browser)
  } finally {
    await browser.close()
  }

  say(`\n${failures.length ? `FAILED ${failures.length}` : 'PASSED'} (${log.length} lines)`)
  if (failures.length) {
    for (const f of failures) console.error(' -', f)
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
