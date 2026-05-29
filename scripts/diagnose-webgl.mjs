import { chromium } from 'playwright'

const BASE = process.env.PREVIEW_URL ?? 'http://localhost:5190'

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

  const logs = []
  page.on('console', (msg) => logs.push(`[${msg.type()}] ${msg.text()}`))
  page.on('pageerror', (err) => logs.push(`[pageerror] ${err.message}`))

  await page.goto(`${BASE}/#work`, { waitUntil: 'networkidle', timeout: 60_000 })
  await page.waitForSelector('[data-featured-project]', { timeout: 15_000 })
  await page.waitForTimeout(2500)

  const mq = await page.evaluate(() => ({
    hover: matchMedia('(hover: hover)').matches,
    fine: matchMedia('(pointer: fine)').matches,
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
  }))
  console.log('matchMedia', mq)

  const projects = await page.locator('[data-featured-project]').all()
  console.log(`Featured projects: ${projects.length}`)

  for (let i = 0; i < projects.length; i++) {
    const el = projects[i]
    await el.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)

    const info = await el.evaluate((node) => {
      const visual = node.querySelector('[data-featured-visual]')
      const webgl = node.querySelector('.project-webgl')
      const canvas = node.querySelector('.project-webgl canvas')
      const img = node.querySelector('img')
      return {
        hasWebgl: !!webgl,
        canvasOpacity: canvas ? getComputedStyle(canvas).opacity : null,
        canvasDisplay: canvas ? getComputedStyle(canvas).display : null,
        imgSrc: img?.getAttribute('src') ?? null,
        webglZ: webgl ? getComputedStyle(webgl).zIndex : null,
        pointerEvents: webgl ? getComputedStyle(webgl).pointerEvents : null,
      }
    })

    const box = await el.boundingBox()
    if (box) {
      await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5)
      await page.waitForTimeout(500)
    }

    const afterHover = await el.evaluate((node) => {
      const canvas = node.querySelector('.project-webgl canvas')
      return canvas ? getComputedStyle(canvas).opacity : null
    })

    console.log(`#${i + 1}`, JSON.stringify({ ...info, afterHoverOpacity: afterHover }))
  }

  const failed404 = logs.filter((l) => l.includes('404') || l.includes('WebGL'))
  if (failed404.length) console.log('Relevant logs:', failed404.join('\n'))
  if (logs.length) console.log('All console:', logs.slice(0, 20).join('\n'))

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
