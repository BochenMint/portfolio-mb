// Download Higgsfield results and emit web tiers into public/v3/.
// Usage: node scripts/hf-fetch-4k.mjs art-arch=<url> art-blocks=<url> art-knot=<url> art-wide=<url> video=<url>
import { writeFileSync, mkdirSync, statSync } from 'node:fs'
import sharp from 'sharp'

mkdirSync('public/v3', { recursive: true })

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const i = a.indexOf('=')
    return [a.slice(0, i), a.slice(i + 1)]
  }),
)

async function fetchBuf(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch ${res.status} ${url.slice(0, 80)}`)
  return Buffer.from(await res.arrayBuffer())
}

// key → [{ suffix, width, height? }]
const IMAGE_TIERS = {
  'art-arch': [
    { suffix: '', w: 1200, h: 1200 },
    { suffix: '@2x', w: 2400, h: 2400 },
  ],
  'art-blocks': [
    { suffix: '', w: 1200, h: 1200 },
    { suffix: '@2x', w: 2400, h: 2400 },
  ],
  'art-knot': [
    { suffix: '', w: 1200, h: 1200 },
    { suffix: '@2x', w: 2400, h: 2400 },
  ],
  'art-wide': [
    { suffix: '', w: 2520, h: 1080 },
    { suffix: '@2x', w: 3840, h: 1646 },
  ],
}

for (const [key, tiers] of Object.entries(IMAGE_TIERS)) {
  const url = args[key]
  if (!url) continue
  const buf = await fetchBuf(url)
  const meta = await sharp(buf).metadata()
  for (const t of tiers) {
    const out = `public/v3/${key}${t.suffix}.webp`
    await sharp(buf)
      .resize(t.w, t.h, { fit: 'cover', withoutEnlargement: false })
      .webp({ quality: t.suffix ? 80 : 84, effort: 5 })
      .toFile(out)
    console.log(out, statSync(out).size, 'B  (src', meta.width + 'x' + meta.height + ')')
  }
}

if (args.video) {
  const buf = await fetchBuf(args.video)
  const out = 'public/v3/ambient-wide.mp4'
  writeFileSync(out, buf)
  console.log(out, (buf.length / 1024 / 1024).toFixed(1), 'MB')
}
console.log('OK')
