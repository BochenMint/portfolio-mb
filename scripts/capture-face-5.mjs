/**
 * Capture ONE additional cube-face screenshot per project (face-5) matching the
 * exact pipeline that produced face-1..4.webp in public/projects/<id>/:
 * Playwright viewport screenshot @ 1600x1600, deviceScaleFactor 1, locale pl-PL,
 * then sharp .webp({ quality: 91, effort: 6 }), with a -sm variant resized to 800w.
 *
 * Run: node scripts/capture-face-5.mjs
 *      node scripts/capture-face-5.mjs --only=mint,plumm
 */

import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'public', 'projects')

const IDRIVE_ROOT = process.env.IDRIVE_ROOT || 'D:\\IDRIVECARS 2.0'
const IDRIVE_PORT = Number(process.env.IDRIVE_PORT || 5192)

const VIEWPORT = { width: 1600, height: 1600 }
const WEBP_QUALITY = 91
const WEBP_EFFORT = 6
const SM_WIDTH = 800

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

async function writeFace(pngBuffer, projectId, baseName) {
  const dir = join(OUT, projectId)
  await mkdir(dir, { recursive: true })
  const fullPath = join(dir, `${baseName}.webp`)
  const smPath = join(dir, `${baseName}-sm.webp`)
  await sharp(pngBuffer).webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT }).toFile(fullPath)
  await sharp(pngBuffer)
    .resize(SM_WIDTH)
    .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
    .toFile(smPath)
  const meta = await sharp(pngBuffer).metadata()
  console.log(`  ✓ ${fullPath.replace(ROOT, '')} (${meta.width}x${meta.height})`)
  console.log(`  ✓ ${smPath.replace(ROOT, '')}`)
  return pngBuffer
}

async function newContext(browser, opts = {}) {
  return browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    locale: 'pl-PL',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    ...opts,
  })
}

async function captureMint(browser) {
  console.log('\n→ mint: face-5')
  const context = await newContext(browser)
  const page = await context.newPage()
  try {
    let url = 'https://mintapartments.pl/o-nas'
    let resp
    try {
      resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
    } catch {
      resp = null
    }
    const thin = !resp || resp.status() >= 400 || (await page.locator('body').innerText()).trim().length < 200
    if (thin) {
      url = 'https://mintapartments.pl/blog'
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
    }
    await page.waitForTimeout(6000)
    await dismissCookies(page)
    const png = await page.screenshot({ type: 'png' })
    await writeFace(png, 'mint', 'face-5')
    console.log(`  captured: ${url}`)
  } catch (err) {
    console.error('  ✗ mint failed:', err.message)
  } finally {
    await page.close()
    await context.close()
  }
}

async function capturePlumm(browser) {
  console.log('\n→ plumm: face-5 (+ light)')
  const context = await newContext(browser)
  const page = await context.newPage()
  await page.emulateMedia({ colorScheme: 'light' })
  try {
    let url = 'https://plumm.pl/cennik-ksiegowosci-online'
    let resp
    try {
      resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
    } catch {
      resp = null
    }
    const bodyText = await page.locator('body').innerText().catch(() => '')
    const broken = !resp || resp.status() >= 400 || bodyText.trim().length < 200
    if (broken) {
      url = 'https://plumm.pl/ai-asystent-ksiegowy'
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
    }
    await page.waitForTimeout(6000)
    await dismissCookies(page)
    const png = await page.screenshot({ type: 'png' })
    await writeFace(png, 'plumm', 'face-5')
    await writeFace(png, 'plumm', 'face-5-light')
    console.log(`  captured: ${url}`)
  } catch (err) {
    console.error('  ✗ plumm failed:', err.message)
  } finally {
    await page.close()
    await context.close()
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
    }, 60000)
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

async function captureIdrive(browser) {
  console.log('\n→ idrive: face-5 (local dev)', IDRIVE_ROOT)
  let child = null
  try {
    child = await startIdriveDev()
    await new Promise((r) => setTimeout(r, 4000))
    const context = await newContext(browser)
    const page = await context.newPage()
    try {
      const url = `http://127.0.0.1:${IDRIVE_PORT}/galerie`
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
      await page.waitForTimeout(6000)
      await dismissCookies(page)
      const png = await page.screenshot({ type: 'png' })
      await writeFace(png, 'idrive', 'face-5')
      console.log(`  captured: /galerie`)
    } finally {
      await page.close()
      await context.close()
    }
  } catch (err) {
    console.error('  ✗ idrive failed:', err.message)
  } finally {
    if (child) child.kill('SIGTERM')
    await killProcessOnPort(IDRIVE_PORT)
  }
}

async function main() {
  const onlyIds = process.argv
    .find((a) => a.startsWith('--only='))
    ?.slice(7)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const wants = (id) => !onlyIds?.length || onlyIds.includes(id)

  await mkdir(OUT, { recursive: true })

  const { chromium } = await import('playwright')
  const browser = await chromium.launch({ headless: true })

  try {
    if (wants('mint')) await captureMint(browser)
    if (wants('plumm')) await capturePlumm(browser)
    if (wants('idrive')) await captureIdrive(browser)
    if (wants('agentic')) {
      console.log(
        '\n→ agentic: skipped by default — see docs/task, run separately with a real dev session if the app comes up.',
      )
    }
  } finally {
    await browser.close()
  }

  console.log('\nDone.')
}

await main()
