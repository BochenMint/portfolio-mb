/**
 * Mandatory edge-to-edge verification for #work featured visuals.
 * Run: npm run dev (5190) then node scripts/verify-fullscreen-visual.mjs
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = process.env.PREVIEW_URL ?? 'http://localhost:5190'
const MIN_RATIO = 0.99
const VIEWPORTS = [
  { width: 1440, height: 900, label: '1440' },
  { width: 1920, height: 1080, label: '1920' },
]

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SHOTS_DIR = path.join(__dirname, 'screenshots', 'fullscreen-verify')

async function dismissIntro(page) {
  const skip = page.locator('[data-intro-skip], button:has-text("Pomiń"), button:has-text("Skip")')
  if ((await skip.count()) > 0) {
    await skip.first().click({ timeout: 2000 }).catch(() => {})
  }
  await page.waitForTimeout(2100)
}

async function measure(page) {
  return page.evaluate(() => {
    const vw = window.innerWidth
    const visuals = [...document.querySelectorAll('#work [data-featured-visual]')]
    return visuals.map((el, i) => {
      const r = el.getBoundingClientRect()
      const img = el.querySelector('img')
      const canvas = el.querySelector('.project-webgl canvas')
      const media = img ?? canvas
      const mr = media?.getBoundingClientRect()
      let parent = el.parentElement
      const chain = []
      while (parent && parent !== document.body) {
        const pr = parent.getBoundingClientRect()
        const cs = getComputedStyle(parent)
        chain.push({
          tag: parent.tagName.toLowerCase(),
          id: parent.id || null,
          class: (parent.className && String(parent.className).slice(0, 80)) || null,
          w: pr.width,
          maxW: cs.maxWidth,
          padL: cs.paddingLeft,
          padR: cs.paddingRight,
        })
        parent = parent.parentElement
      }
      return {
        index: i + 1,
        id: el.closest('[id^="project-"]')?.id ?? `visual-${i}`,
        visualW: r.width,
        visualLeft: r.left,
        visualRight: r.right,
        vw,
        ratio: r.width / vw,
        mediaW: mr?.width ?? 0,
        mediaLeft: mr?.left ?? 0,
        mediaRatio: mr ? mr.width / vw : 0,
        chain,
      }
    })
  })
}

function pad(s, n) {
  return String(s).padEnd(n)
}

async function main() {
  await mkdir(SHOTS_DIR, { recursive: true })

  const browser = await chromium.launch()
  const allRows = []
  const failures = []

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
    await page.goto(`${BASE}/#work`, { waitUntil: 'domcontentloaded', timeout: 60_000 })
    await dismissIntro(page)
    await page.locator('#work').waitFor({ state: 'visible', timeout: 15_000 })

    const rows = await measure(page)
    const minW = vp.width * MIN_RATIO

    for (const row of rows) {
      allRows.push({ viewport: vp.label, ...row })
      if (row.visualW < minW) {
        failures.push(
          `${vp.label}px ${row.id}: visual ${row.visualW.toFixed(1)}px (${(row.ratio * 100).toFixed(2)}%) < ${minW.toFixed(1)}px required`,
        )
      }
      if (Math.abs(row.visualLeft) > 1.5) {
        failures.push(`${vp.label}px ${row.id}: left gap ${row.visualLeft.toFixed(1)}px`)
      }
      if (Math.abs(row.vw - row.visualRight) > 1.5) {
        failures.push(
          `${vp.label}px ${row.id}: right gap ${(row.vw - row.visualRight).toFixed(1)}px`,
        )
      }
      if (row.mediaW > 0 && row.mediaW < minW) {
        failures.push(
          `${vp.label}px ${row.id}: media ${row.mediaW.toFixed(1)}px (${(row.mediaRatio * 100).toFixed(2)}%)`,
        )
      }
    }

    for (let i = 0; i < rows.length; i++) {
      const el = page.locator('#work [data-featured-visual]').nth(i)
      await el.scrollIntoViewIfNeeded()
      await page.waitForTimeout(200)
      const shot = path.join(SHOTS_DIR, `work-${rows[i].id}-vp${vp.label}.png`)
      await page.screenshot({ path: shot, fullPage: false })
      console.log(`screenshot: ${shot}`)
    }

    await page.close()
  }

  await browser.close()

  console.log('\n--- Width table (visual vs viewport) ---')
  console.log(
    `${pad('viewport', 10)} ${pad('project', 22)} ${pad('visualW', 10)} ${pad('vw', 8)} ${pad('ratio%', 8)} ${pad('left', 8)} ${pad('status', 8)}`,
  )
  console.log('-'.repeat(80))

  for (const row of allRows) {
    const minW = Number(row.viewport) * MIN_RATIO
    const ok = row.visualW >= minW && Math.abs(row.visualLeft) <= 1.5
    console.log(
      `${pad(row.viewport, 10)} ${pad(row.id, 22)} ${pad(row.visualW.toFixed(1), 10)} ${pad(String(row.vw), 8)} ${pad((row.ratio * 100).toFixed(2), 8)} ${pad(row.visualLeft.toFixed(1), 8)} ${pad(ok ? 'PASS' : 'FAIL', 8)}`,
    )
  }

  if (failures.length) {
    console.error('\nFAILURES:')
    failures.forEach((f) => console.error(`  ${f}`))
    const failed = allRows.filter((r) => r.visualW < Number(r.viewport) * MIN_RATIO)
    if (failed[0]?.chain) {
      console.error('\nParent chain (first failure):')
      failed[0].chain.forEach((p) => {
        console.error(`  <${p.tag}${p.id ? `#${p.id}` : ''}> w=${p.w.toFixed(1)} maxW=${p.maxW} pad=${p.padL}/${p.padR}`)
      })
    }
    process.exit(1)
  }

  console.log(`\nOK: all visuals ≥${MIN_RATIO * 100}% viewport width at ${VIEWPORTS.map((v) => v.label).join(', ')}px`)
}

main().catch((err) => {
  console.error('ERROR:', err.message || err)
  process.exit(1)
})
