/**
 * Capture live sites + optimize to WebP (hero 1920w, card 1200w).
 * Run: node scripts/capture-and-optimize.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'public', 'projects')

const CAPTURES = [
  {
    id: 'mint',
    name: 'hero',
    url: 'https://mintapartments.pl/',
    wait: 4000,
    clip: null,
  },
  {
    id: 'mint',
    name: 'apartment',
    url: 'https://mintapartments.pl/apartamenty/luksusowy-seaside/',
    wait: 3500,
    clip: null,
  },
  {
    id: 'plumm',
    name: 'hero',
    url: 'https://plumm.pl/',
    wait: 4000,
    clip: null,
  },
]

const PLACEHOLDER_HTML = {
  idrive: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0}body{font-family:system-ui,sans-serif;background:linear-gradient(145deg,#1a1510,#050508);color:#f5f0e8;min-height:100vh;padding:48px}
  .badge{color:#c9a962;font-size:11px;letter-spacing:.25em;text-transform:uppercase}
  h1{font-size:42px;margin:12px 0 8px;font-weight:700}
  .sub{color:#9ca3af;font-size:15px;max-width:520px;line-height:1.5}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:40px;max-width:640px}
  .card{border:1px solid rgba(201,169,98,.25);background:rgba(201,169,98,.06);border-radius:16px;padding:24px}
  .card b{display:block;font-size:28px;color:#c9a962}
  .car{margin:48px auto 0;width:280px;height:120px;border-radius:12px;background:linear-gradient(180deg,rgba(201,169,98,.35),transparent),#1c1c22;box-shadow:0 24px 48px rgba(201,169,98,.15)}
  </style></head><body>
  <div class="badge">iDrive Cars · mobility</div>
  <h1>Flota online 24/7</h1>
  <p class="sub">Rezerwacje, dostępność pojazdów i panel operacyjny — warstwa cyfrowa wokół wynajmu.</p>
  <div class="car"></div>
  <div class="grid"><div class="card"><b>24/7</b><span style="color:#9ca3af;font-size:12px">Pickup &amp; zwrot</span></div>
  <div class="card"><b>Fleet</b><span style="color:#9ca3af;font-size:12px">Live status</span></div></div>
  </body></html>`,
  agentic: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0}body{font-family:ui-monospace,monospace;background:#0e0c14;color:#e8e4ff;min-height:100vh;padding:40px}
  .hdr{display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.1);padding-bottom:20px}
  .logo{width:40px;height:40px;border-radius:10px;background:rgba(167,139,250,.25)}
  h1{font-size:18px;font-weight:600}
  .step{margin-top:16px;margin-left:var(--i);padding:14px 16px;border:1px solid rgba(255,255,255,.06);border-radius:12px;background:rgba(255,255,255,.03);display:flex;align-items:center;gap:10px}
  .dot{width:8px;height:8px;border-radius:50%;background:#a78bfa}
  </style></head><body>
  <div class="hdr"><div class="logo"></div><div><div style="color:#9ca3af;font-size:11px">Agentic OS</div><div style="height:6px;width:120px;background:rgba(255,255,255,.2);border-radius:4px;margin-top:6px"></div></div></div>
  <div class="step" style="--i:0"><span class="dot"></span>Plan — workflow &amp; tools</div>
  <div class="step" style="--i:24px"><span class="dot"></span>Execute — tool calling</div>
  <div class="step" style="--i:48px"><span class="dot"></span>Audit — pełny ślad decyzji</div>
  </body></html>`,
}

async function optimizePng(pngBuffer, projectId, baseName) {
  const dir = join(OUT, projectId)
  await mkdir(dir, { recursive: true })

  const meta = await sharp(pngBuffer).metadata()
  const srcW = meta.width || 1920

  const sizes = [
    { suffix: 'hero', width: Math.min(1920, srcW) },
    { suffix: 'card', width: Math.min(1200, srcW) },
  ]

  for (const { suffix, width } of sizes) {
    const outPath = join(dir, `${baseName}-${suffix}.webp`)
    await sharp(pngBuffer)
      .resize(width, null, { withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(outPath)
    console.log('  ✓', outPath.replace(ROOT, ''))
  }
}

async function captureLive() {
  const { chromium } = await import('playwright')

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    locale: 'pl-PL',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  })

  for (const cap of CAPTURES) {
    console.log(`\n→ ${cap.id}/${cap.name}: ${cap.url}`)
    const page = await context.newPage()
    try {
      await page.goto(cap.url, { waitUntil: 'networkidle', timeout: 60000 })
      await page.waitForTimeout(cap.wait)
      // dismiss cookie banners if present
      for (const sel of [
        'button:has-text("Akceptuj")',
        'button:has-text("Zgadzam")',
        '[data-testid="cookie-accept"]',
      ]) {
        const btn = page.locator(sel).first()
        if (await btn.isVisible({ timeout: 800 }).catch(() => false)) {
          await btn.click().catch(() => {})
          await page.waitForTimeout(500)
        }
      }
      const png = await page.screenshot({ type: 'png', fullPage: false })
      await optimizePng(png, cap.id, cap.name)
    } catch (err) {
      console.error(`  ✗ failed ${cap.url}:`, err.message)
    } finally {
      await page.close()
    }
  }

  // Branded placeholders for idrive + agentic
  for (const [id, html] of Object.entries(PLACEHOLDER_HTML)) {
    console.log(`\n→ ${id}/hero: placeholder`)
    const page = await context.newPage()
    await page.setContent(html, { waitUntil: 'load' })
    await page.waitForTimeout(300)
    const png = await page.screenshot({ type: 'png' })
    await optimizePng(png, id, 'hero')
    await page.close()
  }

  await browser.close()
}

await mkdir(OUT, { recursive: true })
console.log('Capturing screenshots…')
await captureLive()
console.log('\nDone.')
