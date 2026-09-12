/**
 * Plant the headline: turn "Zbuduję dla Ciebie nową stronę" into a bed of
 * flowers lying on the lawn.
 *
 * The words are set in the page's display face on an offscreen canvas, and
 * flowers go wherever that canvas has ink — on a jittered hex grid, so the
 * bed reads as planted rather than printed. It is carpet bedding, the way a
 * park writes a town's name into a slope: the outline of every letter is red
 * begonias and the fill is every light warm thing — daisies, pompoms, cups —
 * so the words stay legible even where a bloom is only a few pixels across.
 *
 * Everything returned is in world units on the ground plane (x across, z
 * toward the camera), centred on the point the camera looks at.
 */

export type FlowerField = {
  count: number
  /** x, z, stem height — per flower. */
  pos: Float32Array
  size: Float32Array
  /** Linear RGB. */
  petal: Float32Array
  centre: Float32Array
  /** Petal count, how round each petal is, and which bloom form it takes. */
  shape: Float32Array
  /** Progress at which the flower breaks the lawn. */
  birth: Float32Array
  seed: Float32Array
  /** The line breaks that won, for the accessible copy and for debugging. */
  lines: string[]
  /** Font size the words were set at, world units. */
  em: number
  /** Grid pitch between flowers, world units. */
  pitch: number
}

/**
 * Bloom forms. The shape of a flower is carried into the shader as a number
 * because all of them are drawn by one instanced quad: `BLOOM_FRAG` switches
 * on it to decide where the petal edge is and how the face is shaded.
 */
export const FORM = {
  /** Ray florets with deep notches between them — daisy, marguerite. */
  DAISY: 0,
  /** A dense head of tiny florets, no gaps — pompom aster, santolina. */
  POMPOM: 1,
  /** Few broad petals closing into a cup, dark inside — tulip, ranunculus. */
  CUP: 2,
  /** Four wide petals round a big dark eye — poppy, anemone. */
  POPPY: 3,
} as const

type Species = {
  petal: string
  centre: string
  petals: number
  round: number
  form: number
  /** Bloom size and stem height, relative to the bed's own scale. */
  size: number
  height: number
}

/* Carpet-bedding palette. Fill: light and warm so it separates from the lawn
   at any size; outline: saturated red, the one strong colour on the page,
   which is also the colour of the call to action under the bed.

   The colours do the reading and the forms do the looking: five kinds of
   bloom in two colour families, so the bed has the variety of real planting
   without ever putting a mid-tone next to the lawn, where the words would
   start to dissolve. Heights differ too — a bed of one height is a printed
   halftone, not a planting. */
const WHITE: Species = {
  petal: '#fbf6ea', centre: '#f0b429', petals: 13, round: 0.35,
  form: FORM.DAISY, size: 1, height: 1,
}
const BUTTER: Species = {
  petal: '#ffe27e', centre: '#d9822b', petals: 9, round: 0.6,
  form: FORM.DAISY, size: 0.94, height: 0.92,
}
const BLUSH: Species = {
  petal: '#ffc4d2', centre: '#f5c93b', petals: 6, round: 1.4,
  form: FORM.CUP, size: 1.02, height: 1.1,
}
const CREAM: Species = {
  petal: '#fdeccd', centre: '#e8c15a', petals: 20, round: 0.2,
  form: FORM.POMPOM, size: 0.82, height: 0.84,
}
const PEACH: Species = {
  petal: '#ffcf9b', centre: '#e0913a', petals: 6, round: 1.1,
  form: FORM.CUP, size: 1.06, height: 1.28,
}
const BEGONIA: Species = {
  petal: '#ee2e1c', centre: '#ffd23f', petals: 5, round: 1.6,
  form: FORM.POMPOM, size: 1, height: 0.95,
}
const CORAL: Species = {
  petal: '#ff5b3d', centre: '#ffd65a', petals: 5, round: 1.3,
  form: FORM.DAISY, size: 1, height: 1,
}
const POPPY: Species = {
  petal: '#e01f12', centre: '#2a0d06', petals: 4, round: 0.85,
  form: FORM.POPPY, size: 1.22, height: 1.2,
}

/** Candidate line breaks, widest first. The one that sets the biggest wins. */
const LAYOUTS: string[][] = [
  ['Zbuduję dla Ciebie', 'nową stronę'],
  ['Zbuduję dla', 'Ciebie nową', 'stronę'],
  ['Zbuduję', 'dla Ciebie', 'nową', 'stronę'],
  ['Zbuduję', 'dla', 'Ciebie', 'nową', 'stronę'],
]

const WEIGHT = 900
const LINE_HEIGHT = 0.96
const TRACKING = 0.02
/** Flowers across a stem of the heavy face, roughly. */
const PITCH_PER_EM = 0.05
/** Canvas pixels per flower pitch: enough to find the letter edges. */
const MASK_PX_PER_PITCH = 7

export function plantHeadline(opts: {
  /** The ground rectangle the words may use, world units. */
  width: number
  depth: number
  /** z of the text block's centre. */
  centreZ: number
  /** z stretch that undoes the camera's foreshortening of the ground. */
  stretch: number
  /** Upper bound on the flower count; the pitch opens up to respect it. */
  maxCount: number
  fontFamily: string
  timeline: { start: number; sweep: number; edgeLead: number }
  seed?: number
}): FlowerField {
  const rand = mulberry32(opts.seed ?? 20260911)
  const font = (px: number) => `${WEIGHT} ${px}px ${opts.fontFamily}`

  // Measure every layout at 100 px and keep the one that sets largest.
  const probe = document.createElement('canvas').getContext('2d')!
  probe.font = font(100)
  const tracking = (s: string) => Math.max(0, s.length - 1) * TRACKING * 100
  let best = { lines: LAYOUTS[0], em: 0 }
  for (const lines of LAYOUTS) {
    const widest = Math.max(...lines.map((l) => probe.measureText(l).width + tracking(l))) / 100
    const tall = lines.length * LINE_HEIGHT * opts.stretch
    const em = Math.min(opts.width / widest, opts.depth / tall)
    if (em > best.em) best = { lines, em }
  }
  const { lines, em } = best

  // Grid pitch, opened up until the count fits the budget.
  let pitch = em * PITCH_PER_EM
  const inkEstimate = (p: number) => (opts.width * opts.depth * 0.34) / (p * p * 0.866)
  while (inkEstimate(pitch) > opts.maxCount * 1.15) pitch *= 1.06

  // Set the words on a mask canvas, in world units × pxPerUnit.
  const pxPerUnit = MASK_PX_PER_PITCH / pitch
  const emPx = em * pxPerUnit
  const blockW = opts.width * pxPerUnit
  const lineStep = emPx * LINE_HEIGHT
  const blockH = lines.length * lineStep
  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(blockW + emPx)
  canvas.height = Math.ceil(blockH + emPx)
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#fff'
  ctx.font = font(emPx)
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'
  // Canvas letterSpacing is not everywhere yet; set the tracking by hand.
  const lineBoxes: { left: number; right: number; top: number; bottom: number }[] = []
  lines.forEach((line, i) => {
    const glyphs = [...line]
    const widths = glyphs.map((g) => ctx.measureText(g).width)
    const total = widths.reduce((a, b) => a + b, 0) + (glyphs.length - 1) * TRACKING * emPx
    let x = (canvas.width - total) / 2
    // Optical centring: cap height sits ~0.72 em above the baseline.
    const baseline = (canvas.height - blockH) / 2 + i * lineStep + emPx * 0.8
    lineBoxes.push({ left: x, right: x + total, top: baseline - emPx * 0.78, bottom: baseline + emPx * 0.22 })
    glyphs.forEach((g, gi) => {
      ctx.fillText(g, x, baseline)
      x += widths[gi] + TRACKING * emPx
    })
  })
  const mask = ctx.getImageData(0, 0, canvas.width, canvas.height).data
  const inkAt = (cx: number, cy: number) => {
    const ix = Math.round(cx)
    const iy = Math.round(cy)
    if (ix < 0 || iy < 0 || ix >= canvas.width || iy >= canvas.height) return 0
    return mask[(iy * canvas.width + ix) * 4] / 255
  }

  // Canvas px → world. z grows toward the camera, like canvas y.
  const toWorldX = (cx: number) => (cx - canvas.width / 2) / pxPerUnit
  const toWorldZ = (cy: number) => ((cy - canvas.height / 2) / pxPerUnit) * opts.stretch + opts.centreZ

  const out: {
    x: number
    z: number
    edge: boolean
    line: number
    nx: number
  }[] = []
  const stepPx = pitch * pxPerUnit
  const rowPx = stepPx * 0.866
  const ring = Array.from({ length: 8 }, (_, k) => {
    const a = (k / 8) * Math.PI * 2
    return [Math.cos(a) * stepPx * 1.02, Math.sin(a) * stepPx * 1.02] as const
  })
  const textLeft = Math.min(...lineBoxes.map((b) => b.left))
  const textRight = Math.max(...lineBoxes.map((b) => b.right))
  for (let row = 0, cy = rowPx / 2; cy < canvas.height; row++, cy += rowPx) {
    const offset = row % 2 ? stepPx / 2 : 0
    for (let cx = offset; cx < canvas.width; cx += stepPx) {
      const jx = cx + (rand() - 0.5) * stepPx * 0.36
      const jy = cy + (rand() - 0.5) * stepPx * 0.36
      if (inkAt(jx, jy) < 0.5) continue
      let edge = false
      for (const [dx, dy] of ring) {
        if (inkAt(jx + dx, jy + dy) < 0.5) {
          edge = true
          break
        }
      }
      let line = 0
      for (let i = 0; i < lineBoxes.length; i++) {
        if (jy >= lineBoxes[i].top - rowPx && jy <= lineBoxes[i].bottom + rowPx) line = i
      }
      out.push({
        x: toWorldX(jx),
        z: toWorldZ(jy),
        edge,
        line,
        nx: (jx - textLeft) / Math.max(1, textRight - textLeft),
      })
    }
  }

  // The pitch estimate is only an estimate. If the words still came out over
  // budget, thin the bed evenly rather than dropping whatever was planted
  // last — which would be the whole bottom line.
  const cap = Math.round(opts.maxCount * 1.2)
  let planted = out
  if (out.length > cap) {
    // Exactly `cap` of them, picked at random and put back in scan order —
    // a per-flower coin toss can land a few over, and trimming those would
    // take them off the end of the last line again.
    const idx = out.map((_, i) => i)
    for (let i = 0; i < cap; i++) {
      const j = i + Math.floor(rand() * (idx.length - i))
      ;[idx[i], idx[j]] = [idx[j], idx[i]]
    }
    planted = idx
      .slice(0, cap)
      .sort((a, b) => a - b)
      .map((i) => out[i])
  }
  const n = planted.length
  const field: FlowerField = {
    count: n,
    pos: new Float32Array(n * 3),
    size: new Float32Array(n),
    petal: new Float32Array(n * 3),
    centre: new Float32Array(n * 3),
    shape: new Float32Array(n * 3),
    birth: new Float32Array(n),
    seed: new Float32Array(n),
    lines,
    em,
    pitch,
  }
  const lineCount = Math.max(1, lines.length - 1)
  for (let i = 0; i < n; i++) {
    const f = planted[i]
    const r = rand()
    // The outline is mostly begonia, with coral and the odd poppy standing
    // up out of it; the fill is mostly daisies with pompoms and cups mixed
    // through. Both lists are weighted, not uniform — an even split of five
    // species reads as a test card.
    const species = f.edge
      ? r < 0.6
        ? BEGONIA
        : r < 0.88
          ? CORAL
          : POPPY
      : r < 0.42
        ? WHITE
        : r < 0.66
          ? BUTTER
          : r < 0.83
            ? CREAM
            : r < 0.94
              ? BLUSH
              : PEACH
    const tint = 0.94 + rand() * 0.1
    const petal = hexToLinear(species.petal)
    const centre = hexToLinear(species.centre)
    field.pos[i * 3] = f.x
    field.pos[i * 3 + 1] = f.z
    field.pos[i * 3 + 2] = pitch * (0.9 + rand() * 0.7) * species.height
    field.size[i] = pitch * (f.edge ? 1.6 : 1.85) * species.size * (0.9 + rand() * 0.22)
    field.petal.set([petal[0] * tint, petal[1] * tint, petal[2] * tint], i * 3)
    field.centre.set(centre, i * 3)
    field.shape[i * 3] = species.petals
    field.shape[i * 3 + 1] = species.round
    field.shape[i * 3 + 2] = species.form
    // Planting runs across the words from left to right, every line at once
    // with a small lag per line; the outline of a letter goes in first and
    // the fill follows it.
    const order = f.nx * 0.82 + (f.line / lineCount) * 0.12 + rand() * 0.06
    field.birth[i] =
      opts.timeline.start + opts.timeline.sweep * order + (f.edge ? 0 : opts.timeline.edgeLead)
    field.seed[i] = rand()
  }
  return field
}

function hexToLinear(hex: string): [number, number, number] {
  const v = parseInt(hex.slice(1), 16)
  const c = (s: number) => Math.pow(s / 255, 2.2)
  return [c((v >> 16) & 255), c((v >> 8) & 255), c(v & 255)]
}

/** Small, fast, seeded — the bed must come out the same on every visit. */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
