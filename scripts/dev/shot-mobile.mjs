import { chromium } from 'playwright'
const out = '/tmp/claude-0/-home-user-portfolio-mb/e3d83c34-f085-54b4-a023-243f9df0228b/scratchpad'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(() => chromium.launch())
const mob = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
await mob.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
await mob.waitForTimeout(2500)
await mob.screenshot({ path: `${out}/mob-top.png` })
await mob.evaluate(() => window.scrollTo(0, 1400)); await mob.waitForTimeout(800)
await mob.screenshot({ path: `${out}/mob-mid.png` })
await browser.close()
