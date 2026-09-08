/**
 * Capture live sites + local dev → WebP tiers (full 3840w, hero 1920w, card 1200w)
 * + case-study gallery (2400×1500 + 1200w sm) and gallery-manifest.json sync.
 *
 * Run: npm run capture:screens
 *      npm run capture:screens -- --only=mint,plumm
 *      npm run capture:screens -- --skip-live   (agentic mocks + idrive local only)
 */

import { spawn } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'public', 'projects')
const IDRIVE_ROOT = process.env.IDRIVE_ROOT || 'D:\\IDRIVECARS 2.0'
const IDRIVE_PORT = Number(process.env.IDRIVE_PORT || 5191)

const VIEWPORT_W = 3840
const VIEWPORT_H = 2160
const WEBP_QUALITY = 91
const WEBP_EFFORT = 6
const GALLERY_W = 2400
const GALLERY_H = 1500
const GALLERY_SMALL_W = 1200

const WEBP_WIDTHS = [
  { suffix: 'full', width: 3840 },
  { suffix: 'hero', width: 1920 },
  { suffix: 'card', width: 1200 },
]

/** Narrative shot list — order = case study gallery swipe sequence. */
const GALLERY_SHOTS = [
  {
    project: 'mint',
    capture: 'hero',
    file: '01-strona-glowna',
    page: 'https://mintapartments.pl',
    caption:
      'Strona główna Mint Apartments — wyszukiwarka terminów, social proof (4,9/5 Google) i direct booking bez prowizji OTA.',
  },
  {
    project: 'mint',
    capture: 'listings',
    file: '02-lista-apartamentow',
    page: 'https://mintapartments.pl/apartamenty',
    caption:
      'Katalog 36 apartamentów — filtry lokalizacji, gości i budżetu; karty z ceną direct i oznaczeniem Premium.',
  },
  {
    project: 'mint',
    capture: 'booking',
    file: '03-apartament-rezerwacja',
    page: 'https://mintapartments.pl/apartamenty/luksusowy-seaside/',
    caption:
      'Karta apartamentu z galerią i widżetem rezerwacji — wybór dat, gości i bezpłatna anulacja do 7 dni przed przyjazdem.',
  },
  {
    project: 'plumm',
    capture: 'dashboard',
    file: '01-panel-operacyjny',
    page: 'https://plumm.pl/#panel',
    caption:
      'Podgląd panelu Plumm — faktury, rozliczenia i CRM w jednym UX (marketingowy mock na landing; pełny panel po logowaniu na app.plumm.pl).',
  },
  {
    project: 'plumm',
    capture: 'hero',
    file: '02-strona-glowna',
    page: 'https://plumm.pl',
    caption:
      'Landing Plumm — hub operacyjny firmy: księgowość, CRM, poczta i AI asystent podatkowy 24/7.',
  },
  {
    project: 'plumm',
    capture: 'pricing',
    file: '03-cennik',
    page: 'https://plumm.pl/cennik-ksiegowosci-online',
    caption:
      'Cennik — plany od 0 zł (Darmowy) do Enterprise; przełącznik miesięczny/roczny i netto/brutto.',
  },
  {
    project: 'plumm',
    capture: 'ai-assistant',
    file: '04-ai-asystent',
    page: 'https://plumm.pl/ai-asystent-ksiegowy',
    caption:
      'AI Asystent Podatkowy — odpowiedzi po polsku, baza wiedzy 2026, eskalacja do księgowej przy compliance.',
  },
  {
    project: 'idrive',
    capture: 'home',
    file: '01-strona-glowna',
    page: 'https://idrivecars.pl',
    caption:
      'Strona główna iDrive Cars — editorial layout, sekcje testów i felietonów, szybkie ładowanie bez WordPressa.',
  },
  {
    project: 'idrive',
    capture: 'testy',
    file: '02-katalog-testow',
    page: 'https://idrivecars.pl/testy',
    caption:
      'Katalog testów — karty artykułów z miniaturami WEBP, datą i kategorią; struktura pod SEO i indeksację.',
  },
  {
    project: 'idrive',
    capture: 'article',
    file: '03-artykul-test',
    page: 'https://idrivecars.pl/testy/test-mercedes-amg-gt-s-testujemy-rywala-911',
    caption:
      'Długi format testu — typografia pod czytanie, galeria zdjęć i responsywny layout pod mobile.',
  },
  {
    project: 'agentic',
    capture: 'hero',
    file: '01-workflow-dashboard',
    page: '',
    caption:
      'Dashboard orkiestracji — aktywne workflow, KPI zadań i ostatnie uruchomienia agentów z audytem każdego kroku.',
  },
  {
    project: 'agentic',
    capture: 'audit',
    file: '02-audyt-krokow',
    page: '',
    caption:
      'Widok audytu — log kto/co/dlaczego dla każdego kroku agenta; human-in-the-loop przy niskiej pewności.',
  },
  {
    project: 'agentic',
    capture: 'agents',
    file: '03-agenci-narzedzia',
    page: '',
    caption:
      'Rejestr agentów i whitelist narzędzi — kontrolowany dostęp zamiast dowolnego shell; szacowanie kosztów modeli.',
  },
]

const LIVE_CAPTURES = [
  // Mint — hospitality conversion funnel
  {
    id: 'mint',
    name: 'hero',
    url: 'https://mintapartments.pl/',
    wait: 6000,
    viewport: { width: 1920, height: 1080 },
    crop16x9: 'top',
    scrollTo: 'header, .hero, [class*="hero"]',
  },
  {
    id: 'mint',
    name: 'listings',
    url: 'https://mintapartments.pl/apartamenty',
    wait: 5000,
    scrollTo: 'main, [class*="listing"], [class*="grid"]',
  },
  {
    id: 'mint',
    name: 'apartment',
    url: 'https://mintapartments.pl/apartamenty/luksusowy-seaside/',
    wait: 5500,
    scrollTo: '[class*="gallery"], main',
  },
  {
    id: 'mint',
    name: 'booking',
    url: 'https://mintapartments.pl/apartamenty/luksusowy-seaside/',
    wait: 4500,
    scrollTo: '[data-booking-widget], [class*="booking"], form',
    crop16x9: 'center',
  },
  {
    id: 'mint',
    name: 'mobile-booking',
    url: 'https://mintapartments.pl/apartamenty/luksusowy-seaside/',
    wait: 4000,
    viewport: { width: 390, height: 844 },
    scrollTo: '[data-booking-widget], [class*="booking"], form',
    deviceScaleFactor: 2,
  },
  // Plumm — ops hub / SaaS dashboard story
  {
    id: 'plumm',
    name: 'hero',
    url: 'https://plumm.pl/',
    wait: 8000,
    scrollTo: '.hero-section-v3, .hero, header',
  },
  {
    id: 'plumm',
    name: 'dashboard',
    url: 'https://plumm.pl/',
    wait: 3500,
    scrollTo: '#panel, [class*="platform-preview"], [class*="panel"]',
  },
  {
    id: 'plumm',
    name: 'app',
    url: 'https://plumm.pl/',
    wait: 3000,
    scrollTo: '#funkcje',
    element: '#funkcje .app-mockup >> nth=1, #funkcje [class*="mockup"]',
  },
  {
    id: 'plumm',
    name: 'pricing',
    url: 'https://plumm.pl/cennik-ksiegowosci-online',
    wait: 5000,
    scrollTo: 'main, [class*="pricing"], [class*="cennik"]',
  },
  {
    id: 'plumm',
    name: 'ai-assistant',
    url: 'https://plumm.pl/ai-asystent-ksiegowy',
    wait: 5500,
    scrollTo: 'main, .hero, [class*="hero"]',
  },
  // iDrive — live parking page probe (fallback → local dev)
  {
    id: 'idrive',
    name: 'hero',
    url: 'https://idrivecars.pl/',
    wait: 5000,
    fallbackLocal: true,
  },
]

const IDRIVE_LOCAL_CAPTURES = [
  {
    id: 'idrive',
    name: 'home',
    path: '/',
    wait: 4000,
    scrollTo: 'main, header',
  },
  {
    id: 'idrive',
    name: 'testy',
    path: '/testy',
    wait: 4500,
    scrollTo: 'main, [class*="grid"], article',
  },
  {
    id: 'idrive',
    name: 'article',
    path: '/testy/test-mercedes-amg-gt-s-testujemy-rywala-911',
    wait: 5000,
    scrollTo: 'article, main h1, [class*="prose"]',
  },
]

const AGENTIC_MOCKS = {
  hero: `<!DOCTYPE html>
<html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box;margin:0}body{font-family:system-ui,-apple-system,sans-serif;background:#f4f5f7;color:#1a1d21;min-height:100vh}
.app{display:grid;grid-template-columns:240px 1fr;min-height:100vh}.side{background:#fff;border-right:1px solid #e5e7eb;padding:24px 16px}
.logo{font-weight:700;font-size:15px;letter-spacing:-.02em}.logo span{color:#2E54FE}
.nav{margin-top:32px;display:flex;flex-direction:column;gap:4px}
.nav a{font-size:13px;color:#6b7280;padding:10px 12px;border-radius:8px;text-decoration:none}
.nav a.on{background:#eef2ff;color:#2E54FE;font-weight:500}main{padding:28px 32px}
.top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px}
h1{font-size:22px;font-weight:600}.sub{color:#6b7280;font-size:13px;margin-top:4px}
.pill{font-size:11px;background:#ecfdf5;color:#047857;padding:6px 12px;border-radius:999px;font-weight:500}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px}
.card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px}
.card .n{font-size:28px;font-weight:700;letter-spacing:-.03em}.card .l{font-size:12px;color:#6b7280;margin-top:4px}
.panel{background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}
.panel-h{padding:16px 20px;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:600}
table{width:100%;border-collapse:collapse;font-size:13px}
th,td{text-align:left;padding:12px 20px;border-bottom:1px solid #f3f4f6}
th{color:#6b7280;font-weight:500;font-size:11px;text-transform:uppercase;letter-spacing:.06em}
.status{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px}
.ok{background:#22c55e}.run{background:#f59e0b}.wait{background:#94a3b8}
.tag{font-size:11px;padding:3px 8px;border-radius:6px;background:#f3f4f6;color:#374151}
</style></head><body>
<div class="app"><aside class="side"><div class="logo">Agentic <span>OS</span></div>
<nav class="nav"><a class="on">Workflow</a><a>Agenci</a><a>Audyt</a><a>Narzędzia</a><a>Ustawienia</a></nav></aside>
<main><div class="top"><div><h1>Orkiestracja — Q2 automatyzacje</h1><p class="sub">SMB · faktury, CRM, raporty tygodniowe</p></div>
<span class="pill">3 workflow aktywne</span></div>
<div class="grid">
<div class="card"><div class="n">847</div><div class="l">Zadania w tym miesiącu</div></div>
<div class="card"><div class="n">99.2%</div><div class="l">Kroki z audytem</div></div>
<div class="card"><div class="n">12</div><div class="l">Eskalacje do człowieka</div></div></div>
<div class="panel"><div class="panel-h">Ostatnie uruchomienia</div>
<table><thead><tr><th>Workflow</th><th>Agent</th><th>Status</th><th>Czas</th></tr></thead><tbody>
<tr><td>Eksport JPK → Plumm</td><td><span class="tag">plumm-sync</span></td><td><span class="status ok"></span>Zakończone</td><td>2.4s</td></tr>
<tr><td>Raport occupancy</td><td><span class="tag">mint-ops</span></td><td><span class="status run"></span>W toku</td><td>—</td></tr>
<tr><td>Lead follow-up</td><td><span class="tag">crm-agent</span></td><td><span class="status wait"></span>Kolejka</td><td>—</td></tr>
</tbody></table></div></main></div></body></html>`,

  audit: `<!DOCTYPE html>
<html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box;margin:0}body{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:#0f1117;color:#e5e7eb;min-height:100vh;font-size:13px}
.wrap{max-width:1200px;margin:0 auto;padding:32px 24px}
.hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;border-bottom:1px solid #1f2937;padding-bottom:16px}
.hdr h1{font-family:system-ui,sans-serif;font-size:18px;font-weight:600}
.badge{font-size:10px;background:#1e3a5f;color:#93c5fd;padding:4px 10px;border-radius:6px}
.step{border:1px solid #1f2937;border-radius:10px;margin-bottom:12px;overflow:hidden;background:#151922}
.step-h{display:flex;gap:12px;align-items:center;padding:12px 16px;background:#1a1f2e}
.num{width:28px;height:28px;border-radius:8px;background:#2E54FE;color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700}
.meta{font-family:system-ui,sans-serif;flex:1}.meta strong{display:block;font-size:13px}.meta span{color:#9ca3af;font-size:11px}
.conf{font-size:11px;padding:3px 8px;border-radius:6px}.hi{background:#064e3b;color:#6ee7b7}.lo{background:#78350f;color:#fcd34d}
.step-b{padding:12px 16px;color:#9ca3af;line-height:1.6;border-top:1px solid #1f2937}
.tool{color:#60a5fa}.human{color:#f472b6}
</style></head><body><div class="wrap">
<div class="hdr"><h1>Audyt kroków · workflow plumm-sync</h1><span class="badge">run_id: wf_8f3a2c</span></div>
<div class="step"><div class="step-h"><span class="num">01</span><div class="meta"><strong>Pobierz faktury z KSeF</strong><span>tool: <span class="tool">ksef.fetch_invoices</span> · 1.2s</span></div><span class="conf hi">0.97</span></div>
<div class="step-b">Pobrano 14 faktur za okres 2026-06. Walidacja schematu FA(3) OK.</div></div>
<div class="step"><div class="step-h"><span class="num">02</span><div class="meta"><strong>Mapuj kontrahentów → CRM</strong><span>tool: <span class="tool">crm.match_vendors</span> · 0.8s</span></div><span class="conf hi">0.94</span></div>
<div class="step-b">12 dopasowań automatycznych, 2 nowe rekordy utworzone z NIP.</div></div>
<div class="step"><div class="step-h"><span class="num">03</span><div class="meta"><strong>Eskalacja: kwota &gt; 50 000 PLN</strong><span>human: <span class="human">operator@firma.pl</span> · oczekuje</span></div><span class="conf lo">0.61</span></div>
<div class="step-b">Pewność poniżej progu 0.85 — workflow wstrzymany do akceptacji człowieka.</div></div>
</div></body></html>`,

  agents: `<!DOCTYPE html>
<html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box;margin:0}body{font-family:system-ui,-apple-system,sans-serif;background:#f8fafc;color:#0f172a;min-height:100vh}
.wrap{max-width:1100px;margin:0 auto;padding:36px 28px}
h1{font-size:22px;font-weight:600;margin-bottom:6px}p.sub{color:#64748b;font-size:14px;margin-bottom:28px}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.agent{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:20px}
.agent h2{font-size:15px;margin-bottom:4px}.agent .role{font-size:12px;color:#64748b;margin-bottom:12px}
.tools{display:flex;flex-wrap:wrap;gap:6px}.tool{font-size:10px;background:#eef2ff;color:#3730a3;padding:4px 8px;border-radius:6px;font-family:ui-monospace,monospace}
.stat{display:flex;gap:16px;margin-top:14px;font-size:12px;color:#475569}
.stat strong{color:#0f172a}
</style></head><body><div class="wrap">
<h1>Agenci i narzędzia</h1><p class="sub">Whitelist — każdy agent ma ograniczony zestaw integracji</p>
<div class="grid">
<div class="agent"><h2>plumm-sync</h2><p class="role">Synchronizacja faktur i JPK</p>
<div class="tools"><span class="tool">ksef.*</span><span class="tool">plumm.import</span><span class="tool">crm.read</span></div>
<div class="stat"><span><strong>847</strong> runs</span><span><strong>$12.40</strong> / mies.</span></div></div>
<div class="agent"><h2>mint-ops</h2><p class="role">Raporty occupancy i Previo</p>
<div class="tools"><span class="tool">previo.reports</span><span class="tool">sheets.append</span></div>
<div class="stat"><span><strong>124</strong> runs</span><span><strong>$4.20</strong> / mies.</span></div></div>
<div class="agent"><h2>crm-agent</h2><p class="role">Follow-up leadów B2B</p>
<div class="tools"><span class="tool">crm.read</span><span class="tool">email.draft</span><span class="tool">calendar.freebusy</span></div>
<div class="stat"><span><strong>56</strong> runs</span><span><strong>$8.90</strong> / mies.</span></div></div>
<div class="agent"><h2>content-seo</h2><p class="role">Meta i structured data</p>
<div class="tools"><span class="tool">cms.read</span><span class="tool">lighthouse.audit</span></div>
<div class="stat"><span><strong>31</strong> runs</span><span><strong>$2.10</strong> / mies.</span></div></div>
</div></div></body></html>`,
}

const IDRIVE_PLACEHOLDER_HTML = `<!DOCTYPE html>
<html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box;margin:0}body{font-family:Georgia,'Times New Roman',serif;background:#0c0c0c;color:#f5f5f0;min-height:100vh}
nav{display:flex;justify-content:space-between;align-items:center;padding:20px 48px;border-bottom:1px solid #222;font-family:system-ui,sans-serif}
.logo{font-weight:800;font-size:14px;letter-spacing:.12em;text-transform:uppercase}
.logo span{color:#e63946}main{max-width:1100px;margin:0 auto;padding:48px 48px 80px}
.hero h1{font-size:clamp(2.5rem,5vw,4rem);line-height:1.05;margin-bottom:16px;font-weight:400}
.hero p{font-family:system-ui,sans-serif;color:#a3a3a3;font-size:16px;max-width:520px;line-height:1.6;margin-bottom:40px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.card{background:#161616;border:1px solid #2a2a2a;border-radius:4px;overflow:hidden}
.card-img{height:160px;background:linear-gradient(135deg,#1a1a2e,#16213e)}
.card-body{padding:16px;font-family:system-ui,sans-serif}
.card-body h2{font-size:14px;font-weight:600;margin-bottom:6px}.card-body p{font-size:12px;color:#737373}
.tag{display:inline-block;font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:#e63946;margin-bottom:8px}
</style></head><body>
<nav><div class="logo">i<span>Drive</span> Cars</div><span style="font-size:12px;color:#525252">Testy · Felietony · News</span></nav>
<main><div class="hero"><p class="tag">Blog motoryzacyjny</p><h1>Testy, które<br>warto przeczytać</h1>
<p>Next.js + MDX. Galerie WEBP, sitemap, zero WordPressa — publikacja z repozytorium.</p></div>
<div class="grid">
<div class="card"><div class="card-img"></div><div class="card-body"><h2>Mercedes-AMG GT S</h2><p>Test · 12 min czytania</p></div></div>
<div class="card"><div class="card-img" style="background:linear-gradient(135deg,#1e1e1e,#3d0000)"></div><div class="card-body"><h2>Lexus RC F na torze</h2><p>Test · galeria 24 zdjęć</p></div></div>
<div class="card"><div class="card-img" style="background:linear-gradient(135deg,#0d1b2a,#1b263b)"></div><div class="card-body"><h2>Porsche 911 Targa</h2><p>Felieton · klasyczna forma</p></div></div>
</div></main></body></html>`

/** Crop PNG to 16:9 (top-biased for hero bands). */
async function fitPngTo16x9(pngBuffer, anchor = 'top') {
  const meta = await sharp(pngBuffer).metadata()
  const w = meta.width ?? VIEWPORT_W
  const h = meta.height ?? VIEWPORT_H
  const targetRatio = 16 / 9
  const currentRatio = w / h
  if (Math.abs(currentRatio - targetRatio) < 0.004) return pngBuffer
  let extract
  if (currentRatio > targetRatio) {
    const cropW = Math.round(h * targetRatio)
    extract = { left: Math.round((w - cropW) / 2), top: 0, width: cropW, height: h }
  } else {
    const cropH = Math.round(w / targetRatio)
    const top = anchor === 'top' ? 0 : Math.round((h - cropH) / 2)
    extract = { left: 0, top, width: w, height: cropH }
  }
  console.log(`  ↳ crop 16:9 (${anchor}): ${w}×${h} → ${extract.width}×${extract.height}`)
  return sharp(pngBuffer).extract(extract).png().toBuffer()
}

/** Crop PNG to 16:10 for case-study gallery stack. */
async function fitPngToGallery(pngBuffer) {
  const meta = await sharp(pngBuffer).metadata()
  const w = meta.width ?? VIEWPORT_W
  const h = meta.height ?? VIEWPORT_H
  const targetRatio = GALLERY_W / GALLERY_H
  const currentRatio = w / h
  if (Math.abs(currentRatio - targetRatio) < 0.004) return pngBuffer
  let extract
  if (currentRatio > targetRatio) {
    const cropW = Math.round(h * targetRatio)
    extract = { left: Math.round((w - cropW) / 2), top: 0, width: cropW, height: h }
  } else {
    const cropH = Math.round(w / targetRatio)
    extract = { left: 0, top: Math.round((h - cropH) * 0.28), width: w, height: cropH }
  }
  return sharp(pngBuffer).extract(extract).png().toBuffer()
}

async function optimizePng(pngBuffer, projectId, baseName, options = {}) {
  const dir = join(OUT, projectId)
  await mkdir(dir, { recursive: true })
  let processed = pngBuffer
  if (options.crop16x9) {
    processed = await fitPngTo16x9(pngBuffer, options.crop16x9)
  }
  const meta = await sharp(processed).metadata()
  const srcW = meta.width || VIEWPORT_W
  console.log(`  PNG ${srcW}×${meta.height ?? '?'} → WebP q=${WEBP_QUALITY}`)
  for (const { suffix, width } of WEBP_WIDTHS) {
    const targetW = suffix === 'full' ? Math.min(width, srcW) : width
    const outPath = join(dir, `${baseName}-${suffix}.webp`)
    await sharp(processed)
      .resize(targetW, null, { withoutEnlargement: suffix === 'full' })
      .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
      .toFile(outPath)
    console.log('  ✓', outPath.replace(ROOT, ''))
  }
  return processed
}

async function exportGalleryFromPng(pngBuffer, projectId, galleryFile) {
  const galleryDir = join(OUT, projectId, 'gallery')
  await mkdir(galleryDir, { recursive: true })
  const cropped = await fitPngToGallery(pngBuffer)
  const fullPath = join(galleryDir, `${galleryFile}.webp`)
  const smPath = join(galleryDir, `${galleryFile}-sm.webp`)
  await sharp(cropped)
    .resize(GALLERY_W, GALLERY_H, { fit: 'cover' })
    .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
    .toFile(fullPath)
  await sharp(cropped)
    .resize(GALLERY_SMALL_W, null, { withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
    .toFile(smPath)
  console.log('  ✓ gallery', fullPath.replace(ROOT, ''))
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
  await page.evaluate(() => window.scrollTo(0, Math.floor(document.body.scrollHeight * 0.35)))
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
      const processed = await optimizePng(png, 'plumm', 'dashboard-app')
      const galleryShot = GALLERY_SHOTS.find((s) => s.project === 'plumm' && s.capture === 'dashboard')
      if (galleryShot) {
        await exportGalleryFromPng(processed, 'plumm', galleryShot.file)
      }
      return true
    }
    return false
  } finally {
    await page.close()
  }
}

const captureBuffers = new Map()

function bufferKey(projectId, name) {
  return `${projectId}/${name}`
}

async function capturePage(context, cap) {
  console.log(`\n→ ${cap.id}/${cap.name}: ${cap.url}`)
  const page = await context.newPage()
  try {
    if (cap.viewport) {
      await page.setViewportSize(cap.viewport)
      console.log(`  ↳ viewport ${cap.viewport.width}×${cap.viewport.height}`)
    }
    if (cap.deviceScaleFactor) {
      await page.emulateMedia({ reducedMotion: 'reduce' })
    }
    await page.goto(cap.url, { waitUntil: 'networkidle', timeout: 90000 })
    await page.waitForTimeout(cap.wait ?? 4000)
    await dismissCookies(page)
    if (cap.scrollTo) await scrollToTarget(page, cap.scrollTo)
    const png = await screenshotCapture(page, cap)
    const processed = await optimizePng(png, cap.id, cap.name, { crop16x9: cap.crop16x9 })
    captureBuffers.set(bufferKey(cap.id, cap.name), processed)
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

async function captureIdriveLocal(context) {
  console.log('\n→ idrive: local dev', IDRIVE_ROOT)
  let child = null
  try {
    child = await startIdriveDev()
    await new Promise((r) => setTimeout(r, 4000))
    for (const cap of IDRIVE_LOCAL_CAPTURES) {
      const url = `http://127.0.0.1:${IDRIVE_PORT}${cap.path}`
      await capturePage(context, { ...cap, url })
    }
    if (!captureBuffers.has(bufferKey('idrive', 'hero'))) {
      const homePng = captureBuffers.get(bufferKey('idrive', 'home'))
      if (homePng) {
        await optimizePng(homePng, 'idrive', 'hero')
        captureBuffers.set(bufferKey('idrive', 'hero'), homePng)
      }
    }
    return true
  } catch (err) {
    console.error('  ✗ idrive local failed:', err.message)
    return false
  } finally {
    if (child) child.kill('SIGTERM')
    await killProcessOnPort(IDRIVE_PORT)
  }
}

async function captureIdrivePlaceholder(context) {
  console.log('\n→ idrive: branded placeholder (live parking / local unavailable)')
  const page = await context.newPage()
  try {
    await page.setContent(IDRIVE_PLACEHOLDER_HTML, { waitUntil: 'load' })
    await page.setViewportSize({ width: VIEWPORT_W, height: VIEWPORT_H })
    await page.waitForTimeout(300)
    const png = await page.screenshot({ type: 'png' })
    for (const name of ['hero', 'home', 'testy', 'article']) {
      const processed = await optimizePng(png, 'idrive', name)
      captureBuffers.set(bufferKey('idrive', name), processed)
    }
    return true
  } finally {
    await page.close()
  }
}

async function captureAgenticMocks(context) {
  console.log('\n→ agentic: UI mocks')
  for (const [name, html] of Object.entries(AGENTIC_MOCKS)) {
    const page = await context.newPage()
    try {
      await page.setContent(html, { waitUntil: 'load' })
      await page.setViewportSize({ width: VIEWPORT_W, height: VIEWPORT_H })
      await page.waitForTimeout(300)
      const png = await page.screenshot({ type: 'png' })
      const processed = await optimizePng(png, 'agentic', name)
      captureBuffers.set(bufferKey('agentic', name), processed)
    } finally {
      await page.close()
    }
  }
}

async function syncGalleryExports(onlyIds) {
  console.log('\n→ gallery exports')
  for (const shot of GALLERY_SHOTS) {
    if (onlyIds?.length && !onlyIds.includes(shot.project)) continue
    const buf = captureBuffers.get(bufferKey(shot.project, shot.capture))
    if (!buf) {
      console.warn(`  ⚠ brak bufora ${shot.project}/${shot.capture} — pomijam ${shot.file}`)
      continue
    }
    await exportGalleryFromPng(buf, shot.project, shot.file)
  }
}

async function writeGalleryManifest() {
  const manifest = GALLERY_SHOTS.map((shot) => ({
    project: shot.project,
    src: `/projects/${shot.project}/gallery/${shot.file}.webp`,
    srcSmall: `/projects/${shot.project}/gallery/${shot.file}-sm.webp`,
    width: GALLERY_W,
    height: GALLERY_H,
    page: shot.page,
    caption: shot.caption,
  }))
  const json = `${JSON.stringify(manifest, null, 2)}\n`
  await writeFile(join(OUT, 'gallery-manifest.json'), json, 'utf8')
  await writeFile(join(ROOT, 'src', 'data', 'galleryManifest.json'), json, 'utf8')
  console.log('  ✓ gallery-manifest.json (+ src/data copy)')
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

  const skipLive = process.argv.includes('--skip-live')
  const onlyIds = process.argv
    .find((a) => a.startsWith('--only='))
    ?.slice(7)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  let plummLoggedIn = false
  if (!skipLive) {
    plummLoggedIn = await tryPlummAppLogin(context)
    if (plummLoggedIn) {
      console.log('  (plumm/dashboard-* z rzeczywistego panelu po logowaniu)')
    } else {
      console.log('  Plumm: brak logowania (app.plumm.pl niedostępne lub brak PLUMM_DEMO_* w .env)')
    }

    for (const cap of LIVE_CAPTURES) {
      if (onlyIds?.length && !onlyIds.includes(cap.id)) continue
      if (cap.id === 'plumm' && cap.name === 'dashboard' && plummLoggedIn) continue
      const ok = await capturePage(context, cap)
      if (!ok && cap.fallbackLocal) {
        console.log('  ↻ idrive live failed — trying local dev')
      }
    }
  }

  const wantsIdrive = !onlyIds?.length || onlyIds.includes('idrive')
  if (wantsIdrive && !skipLive) {
    const hasIdrive = ['hero', 'home', 'testy', 'article'].some((n) =>
      captureBuffers.has(bufferKey('idrive', n)),
    )
    if (!hasIdrive || !captureBuffers.has(bufferKey('idrive', 'testy'))) {
      const localOk = await captureIdriveLocal(context)
      if (!localOk) await captureIdrivePlaceholder(context)
    }
  } else if (wantsIdrive && skipLive) {
    const localOk = await captureIdriveLocal(context)
    if (!localOk) await captureIdrivePlaceholder(context)
  }

  const wantsAgentic = !onlyIds?.length || onlyIds.includes('agentic')
  if (wantsAgentic) await captureAgenticMocks(context)

  await syncGalleryExports(onlyIds)
  await writeGalleryManifest()
  await browser.close()
}

await mkdir(OUT, { recursive: true })
await loadPlummDemoEnv()
console.log(
  'Capturing screenshots (%d×%d, WebP full/hero/card @ q=%d, gallery %d×%d)…',
  VIEWPORT_W,
  VIEWPORT_H,
  WEBP_QUALITY,
  GALLERY_W,
  GALLERY_H,
)
await captureLive()
console.log('\nDone. Run: npm run composite:plumm')
