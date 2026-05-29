/**

 * Capture live sites + local dev + optimize to WebP (full 3840w, hero 1920w, card 1200w).

 * Run: npm run capture:screens

 */

import { spawn } from 'node:child_process'

import { mkdir, readFile } from 'node:fs/promises'

import { dirname, join } from 'node:path'

import { fileURLToPath } from 'node:url'

import sharp from 'sharp'



const __dirname = dirname(fileURLToPath(import.meta.url))

const ROOT = join(__dirname, '..')

const OUT = join(ROOT, 'public', 'projects')

const IDRIVE_ROOT = 'D:\\IDRIVECARS 2.0'

const IDRIVE_PORT = 5191

const VIEWPORT_W = 3840

const VIEWPORT_H = 2160

const WEBP_QUALITY = 91

const WEBP_EFFORT = 6



const WEBP_WIDTHS = [

  { suffix: 'full', width: 3840 },

  { suffix: 'hero', width: 1920 },

  { suffix: 'card', width: 1200 },

]



const LIVE_CAPTURES = [

  {

    id: 'mint',

    name: 'hero',

    url: 'https://mintapartments.pl/',

    wait: 5000,

  },

  {

    id: 'mint',

    name: 'listings',

    url: 'https://mintapartments.pl/apartamenty',

    wait: 4500,

  },

  {

    id: 'mint',

    name: 'apartment',

    url: 'https://mintapartments.pl/apartamenty/luksusowy-seaside/',

    wait: 5000,

  },

  {

    id: 'mint',

    name: 'booking',

    url: 'https://mintapartments.pl/apartamenty/luksusowy-seaside/',

    wait: 4000,

    scrollTo: '[data-booking-widget], form, .booking',

  },

  {

    id: 'plumm',

    name: 'hero',

    url: 'https://plumm.pl/',

    wait: 8000,

    scrollTo: '.hero-section-v3',

  },

  {

    id: 'plumm',

    name: 'app',

    url: 'https://plumm.pl/',

    wait: 3000,

    scrollTo: '#funkcje',

    element: '#funkcje .app-mockup >> nth=1',

  },

  {

    id: 'plumm',

    name: 'dashboard',

    url: 'https://plumm.pl/',

    wait: 3000,

    scrollTo: '#panel',

  },

  {

    id: 'plumm',

    name: 'pricing',

    url: 'https://plumm.pl/cennik-ksiegowosci-online',

    wait: 5000,

  },

  {

    id: 'idrive',

    name: 'hero',

    url: 'https://idrivecars.pl/',

    wait: 5000,

    fallbackLocal: true,

  },

]



const AGENTIC_MOCK_HTML = `<!DOCTYPE html>

<html lang="pl">

<head>

<meta charset="utf-8">

<meta name="viewport" content="width=device-width, initial-scale=1">

<style>

  *{box-sizing:border-box;margin:0}

  body{font-family:system-ui,-apple-system,sans-serif;background:#f4f5f7;color:#1a1d21;min-height:100vh}

  .app{display:grid;grid-template-columns:240px 1fr;min-height:100vh}

  .side{background:#fff;border-right:1px solid #e5e7eb;padding:24px 16px}

  .logo{font-weight:700;font-size:15px;letter-spacing:-.02em}

  .logo span{color:#2E54FE}

  .nav{margin-top:32px;display:flex;flex-direction:column;gap:4px}

  .nav a{font-size:13px;color:#6b7280;padding:10px 12px;border-radius:8px;text-decoration:none}

  .nav a.on{background:#eef2ff;color:#2E54FE;font-weight:500}

  main{padding:28px 32px}

  .top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px}

  h1{font-size:22px;font-weight:600}

  .sub{color:#6b7280;font-size:13px;margin-top:4px}

  .pill{font-size:11px;background:#ecfdf5;color:#047857;padding:6px 12px;border-radius:999px;font-weight:500}

  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px}

  .card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px}

  .card .n{font-size:28px;font-weight:700;letter-spacing:-.03em}

  .card .l{font-size:12px;color:#6b7280;margin-top:4px}

  .panel{background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}

  .panel-h{padding:16px 20px;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:600}

  table{width:100%;border-collapse:collapse;font-size:13px}

  th,td{text-align:left;padding:12px 20px;border-bottom:1px solid #f3f4f6}

  th{color:#6b7280;font-weight:500;font-size:11px;text-transform:uppercase;letter-spacing:.06em}

  .status{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px}

  .ok{background:#22c55e}.run{background:#f59e0b}.wait{background:#94a3b8}

  .tag{font-size:11px;padding:3px 8px;border-radius:6px;background:#f3f4f6;color:#374151}

</style>

</head>

<body>

<div class="app">

  <aside class="side">

    <div class="logo">Agentic <span>OS</span></div>

    <nav class="nav">

      <a class="on">Workflow</a>

      <a>Agenci</a>

      <a>Audyt</a>

      <a>Narzędzia</a>

      <a>Ustawienia</a>

    </nav>

  </aside>

  <main>

    <div class="top">

      <div>

        <h1>Orkiestracja — Q2 automatyzacje</h1>

        <p class="sub">SMB · faktury, CRM, raporty tygodniowe</p>

      </div>

      <span class="pill">3 workflow aktywne</span>

    </div>

    <div class="grid">

      <div class="card"><div class="n">847</div><div class="l">Zadania w tym miesiącu</div></div>

      <div class="card"><div class="n">99.2%</div><div class="l">Kroki z audytem</div></div>

      <div class="card"><div class="n">12</div><div class="l">Eskalacje do człowieka</div></div>

    </div>

    <div class="panel">

      <div class="panel-h">Ostatnie uruchomienia</div>

      <table>

        <thead><tr><th>Workflow</th><th>Agent</th><th>Status</th><th>Czas</th></tr></thead>

        <tbody>

          <tr><td>Eksport JPK → MINTAX</td><td><span class="tag">plumm-sync</span></td><td><span class="status ok"></span>Zakończone</td><td>2.4s</td></tr>

          <tr><td>Raport occupancy</td><td><span class="tag">mint-ops</span></td><td><span class="status run"></span>W toku</td><td>—</td></tr>

          <tr><td>Lead follow-up</td><td><span class="tag">crm-agent</span></td><td><span class="status wait"></span>Kolejka</td><td>—</td></tr>

        </tbody>

      </table>

    </div>

  </main>

</div>

</body>

</html>`



async function optimizePng(pngBuffer, projectId, baseName) {

  const dir = join(OUT, projectId)

  await mkdir(dir, { recursive: true })



  const meta = await sharp(pngBuffer).metadata()

  const srcW = meta.width || VIEWPORT_W

  console.log(`  PNG ${srcW}×${meta.height ?? '?'} → WebP q=${WEBP_QUALITY}`)



  for (const { suffix, width } of WEBP_WIDTHS) {

    const targetW = Math.min(width, srcW)

    const outPath = join(dir, `${baseName}-${suffix}.webp`)

    await sharp(pngBuffer)

      .resize(targetW, null, { withoutEnlargement: true })

      .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })

      .toFile(outPath)

    console.log('  ✓', outPath.replace(ROOT, ''))

  }

}



async function dismissCookies(page) {

  for (const sel of [

    'button:has-text("Akceptuj")',

    'button:has-text("Zgadzam")',

    'button:has-text("Accept")',

    '[data-testid="cookie-accept"]',

  ]) {

    const btn = page.locator(sel).first()

    if (await btn.isVisible({ timeout: 600 }).catch(() => false)) {

      await btn.click().catch(() => {})

      await page.waitForTimeout(400)

    }

  }

}



async function scrollToTarget(page, selector) {

  const selectors = selector.split(',').map((s) => s.trim())

  for (const sel of selectors) {

    const loc = page.locator(sel).first()

    if (await loc.isVisible({ timeout: 2500 }).catch(() => false)) {

      await loc.scrollIntoViewIfNeeded()

      await page.waitForTimeout(800)

      return true

    }

  }

  await page.evaluate(() => window.scrollTo(0, Math.floor(document.body.scrollHeight * 0.45)))

  await page.waitForTimeout(600)

  return false

}



async function screenshotCapture(page, cap) {

  if (cap.element) {

    const selectors = cap.element.split(',').map((s) => s.trim())

    for (const sel of selectors) {

      const loc = page.locator(sel).first()

      if (await loc.isVisible({ timeout: 10000 }).catch(() => false)) {

        console.log(`  ↳ element: ${sel}`)

        return loc.screenshot({ type: 'png' })

      }

    }

    console.log('  ↳ element not found, viewport fallback')

  }

  return page.screenshot({ type: 'png', fullPage: false })

}



async function loadPlummDemoEnv() {

  try {

    const raw = await readFile(join(ROOT, '.env'), 'utf8')

    for (const line of raw.split('\n')) {

      const trimmed = line.trim()

      if (!trimmed || trimmed.startsWith('#')) continue

      const eq = trimmed.indexOf('=')

      if (eq < 0) continue

      const key = trimmed.slice(0, eq).trim()

      if (key !== 'PLUMM_DEMO_EMAIL' && key !== 'PLUMM_DEMO_PASSWORD') continue

      let val = trimmed.slice(eq + 1).trim()

      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {

        val = val.slice(1, -1)

      }

      if (!process.env[key]) process.env[key] = val

    }

  } catch {

    /* brak .env */

  }

}



async function tryPlummAppLogin(context) {

  const email = process.env.PLUMM_DEMO_EMAIL

  const password = process.env.PLUMM_DEMO_PASSWORD

  if (!email || !password) return false



  const loginUrls = ['https://app.plumm.pl/logowanie', 'https://plumm.pl/logowanie']

  const page = await context.newPage()

  try {

    for (const url of loginUrls) {

      try {

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })

      } catch {

        continue

      }

      await page.waitForTimeout(2500)

      await dismissCookies(page)

      const emailInput = page.locator('input[type="email"], input[name="email"]').first()

      if (!(await emailInput.isVisible({ timeout: 3000 }).catch(() => false))) continue

      await emailInput.fill(email)

      await page.locator('input[type="password"]').first().fill(password)

      await page.locator('button[type="submit"], button:has-text("Zaloguj")').first().click()

      await page.waitForTimeout(6000)

      if (page.url().includes('logowanie')) continue

      console.log('  ✓ Plumm login →', page.url())

      const png = await screenshotCapture(page, {

        element: 'main, [class*="sidebar"], [class*="dashboard"]',

      })

      await optimizePng(png, 'plumm', 'dashboard')

      return true

    }

    return false

  } finally {

    await page.close()

  }

}



async function capturePage(context, cap) {

  console.log(`\n→ ${cap.id}/${cap.name}: ${cap.url}`)

  const page = await context.newPage()

  try {

    await page.goto(cap.url, { waitUntil: 'networkidle', timeout: 90000 })

    await page.waitForTimeout(cap.wait ?? 4000)

    await dismissCookies(page)

    if (cap.scrollTo) {

      await scrollToTarget(page, cap.scrollTo)

    }

    const png = await screenshotCapture(page, cap)

    await optimizePng(png, cap.id, cap.name)

    return true

  } catch (err) {

    console.error(`  ✗ failed ${cap.url}:`, err.message)

    return false

  } finally {

    await page.close()

  }

}



function startIdriveDev() {

  return new Promise((resolve, reject) => {

    const child = spawn('npm', ['run', 'dev', '--', '-p', String(IDRIVE_PORT)], {

      cwd: IDRIVE_ROOT,

      shell: true,

      stdio: ['ignore', 'pipe', 'pipe'],

      env: { ...process.env, PORT: String(IDRIVE_PORT) },

    })

    let ready = false

    const onData = (chunk) => {

      const text = chunk.toString()

      if (!ready && (text.includes('Ready') || text.includes('started server') || text.includes('Local:'))) {

        ready = true

        resolve(child)

      }

    }

    child.stdout?.on('data', onData)

    child.stderr?.on('data', onData)

    child.on('error', reject)

    setTimeout(() => {

      if (!ready) {

        ready = true

        resolve(child)

      }

    }, 45000)

  })

}



function killProcessOnPort(port) {

  return new Promise((resolve) => {

    const killer = spawn(

      'powershell',

      [

        '-NoProfile',

        '-Command',

        `$p = Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique; if ($p) { $p | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue } }`,

      ],

      { shell: true },

    )

    killer.on('close', () => resolve())

    killer.on('error', () => resolve())

  })

}



async function captureLive() {

  const { chromium } = await import('playwright')



  const browser = await chromium.launch({ headless: true })

  const context = await browser.newContext({

    viewport: { width: VIEWPORT_W, height: VIEWPORT_H },

    deviceScaleFactor: 1,

    locale: 'pl-PL',

    userAgent:

      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',

  })



  const plummLoggedIn = await tryPlummAppLogin(context)

  if (plummLoggedIn) {

    console.log('  (plumm/dashboard-* z rzeczywistego panelu po logowaniu)')

  } else {

    console.log('  Plumm: brak logowania (app.plumm.pl niedostępne lub brak PLUMM_DEMO_* w .env)')

  }



  const onlyIds = process.argv

    .find((a) => a.startsWith('--only='))

    ?.slice(7)

    .split(',')

    .map((s) => s.trim())

    .filter(Boolean)



  for (const cap of LIVE_CAPTURES) {

    if (onlyIds?.length && !onlyIds.includes(cap.id)) continue

    if (cap.id === 'plumm' && cap.name === 'dashboard' && plummLoggedIn) continue

    const ok = await capturePage(context, cap)

    if (!ok && cap.fallbackLocal) {

      console.log(`  ↻ fallback local :${IDRIVE_PORT}`)

      let child = null

      try {

        child = await startIdriveDev()

        await new Promise((r) => setTimeout(r, 3000))

        await capturePage(context, {

          ...cap,

          url: `http://127.0.0.1:${IDRIVE_PORT}/`,

        })

      } finally {

        if (child) child.kill('SIGTERM')

        await killProcessOnPort(IDRIVE_PORT)

      }

    }

  }



  console.log('\n→ agentic/hero: UI mock')

  const page = await context.newPage()

  await page.setContent(AGENTIC_MOCK_HTML, { waitUntil: 'load' })

  await page.setViewportSize({ width: VIEWPORT_W, height: VIEWPORT_H })

  await page.waitForTimeout(400)

  const agenticPng = await page.screenshot({ type: 'png' })

  await optimizePng(agenticPng, 'agentic', 'hero')

  await page.close()



  await browser.close()

}



await mkdir(OUT, { recursive: true })

await loadPlummDemoEnv()

console.log(

  'Capturing screenshots (%d×%d, WebP full/hero/card @ q=%d, effort=%d)…',

  VIEWPORT_W,

  VIEWPORT_H,

  WEBP_QUALITY,

  WEBP_EFFORT,

)

await captureLive()

console.log('\nDone.')


