import { chromium } from 'playwright'
const out = '/tmp/claude-0/-home-user-portfolio-mb/e3d83c34-f085-54b4-a023-243f9df0228b/scratchpad'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=swiftshader'] })
for (const theme of ['dark', 'light']) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.addInitScript((t) => localStorage.setItem('mb-theme', t), theme)
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)
  for (let i = 0; i < 4; i++) {
    await page.evaluate((i) => { const c = document.querySelectorAll('[aria-roledescription="3D cube"]')[i]; c?.scrollIntoView({ block: 'center' }) }, i)
    await page.waitForTimeout(1800)
    await page.screenshot({ path: `${out}/work-${theme}-${i}.png` })
  }
  await page.close()
}
await browser.close()
