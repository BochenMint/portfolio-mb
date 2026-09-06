import { chromium } from 'playwright'
const out = process.argv[2] || '/tmp/claude-0/-home-user-portfolio-mb/e3d83c34-f085-54b4-a023-243f9df0228b/scratchpad'
const url = process.argv[3] || 'http://localhost:4173/'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(() => chromium.launch())
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
page.on('pageerror', (e) => console.log('PAGEERROR', e.message))
page.on('console', (m) => m.type() === 'error' && console.log('CONSOLE', m.text()))
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)
await page.mouse.move(700, 450)
await page.waitForTimeout(400)
await page.screenshot({ path: `${out}/hero.png` })
const h = await page.evaluate(() => document.body.scrollHeight)
console.log('height', h)
// scroll through to trigger reveals
for (let y = 0; y < h; y += 600) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(120) }
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(800)
await page.screenshot({ path: `${out}/full.png`, fullPage: true })
const mob = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
await mob.goto(url, { waitUntil: 'networkidle' })
await mob.waitForTimeout(2500)
const mh = await mob.evaluate(() => document.body.scrollHeight)
for (let y = 0; y < mh; y += 500) { await mob.evaluate((y) => window.scrollTo(0, y), y); await mob.waitForTimeout(100) }
await mob.evaluate(() => window.scrollTo(0, 0))
await mob.waitForTimeout(600)
await mob.screenshot({ path: `${out}/mobile.png`, fullPage: true })
await browser.close()
