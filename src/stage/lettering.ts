/**
 * Set a headline on the ground: choose the line break that sets largest for
 * the space available, lay the words out on an offscreen canvas in the
 * page's own face, and walk a jittered hex grid over the ink to get a set of
 * planting points — carpet bedding's basic move, generalised out of the
 * garden's own flower field so a second trade can read the same points as
 * accent stones instead of blooms.
 *
 * Everything returned is in world units on the ground plane (x across, z
 * toward the camera), centred on the point the camera looks at. What a point
 * BECOMES — a flower, a stone — is entirely up to the caller; this file only
 * ever produces the grid.
 */

export type LetterPoint = {
  x: number
  z: number
  /** Whether this point sits next to unlit ground — a letter's own edge. */
  edge: boolean
  /** Which line of the headline this point belongs to. */
  line: number
  /** Normalised position left→right across the whole block, 0…1. */
  nx: number
}

export type LetterField = {
  points: LetterPoint[]
  /** The line break that won, for accessible copy and for debugging. */
  lines: string[]
  /** Font size the words were set at, world units. */
  em: number
  /** Grid pitch between points, world units. */
  pitch: number
}

const WEIGHT = 900
const LINE_HEIGHT = 0.96
const TRACKING = 0.02
/** Points across a stem of the heavy face, roughly. */
const PITCH_PER_EM = 0.05
/** Canvas pixels per point pitch: enough to find the letter edges. */
const MASK_PX_PER_PITCH = 7

export function setHeadline(opts: {
  /** Candidate line breaks, widest first; the one that sets largest wins. */
  layouts: string[][]
  /** The ground rectangle the words may use, world units. */
  width: number
  depth: number
  /** z of the text block's centre. */
  centreZ: number
  /** z stretch that undoes the camera's foreshortening of the ground. */
  stretch: number
  /** Upper bound on the point count; the pitch opens up to respect it. */
  maxCount: number
  fontFamily: string
  /** Shared with the caller so a headline's own RNG sequence — grid jitter,
   *  then whatever the caller draws from it next — stays deterministic
   *  across the boundary. */
  rand: () => number
  weight?: number
  lineHeight?: number
  tracking?: number
  pitchPerEm?: number
  maskPxPerPitch?: number
}): LetterField {
  const weight = opts.weight ?? WEIGHT
  const lineHeight = opts.lineHeight ?? LINE_HEIGHT
  const tracking = opts.tracking ?? TRACKING
  const pitchPerEm = opts.pitchPerEm ?? PITCH_PER_EM
  const maskPxPerPitch = opts.maskPxPerPitch ?? MASK_PX_PER_PITCH
  const { rand } = opts
  const font = (px: number) => `${weight} ${px}px ${opts.fontFamily}`

  // Measure every layout at 100 px and keep the one that sets largest.
  const probe = document.createElement('canvas').getContext('2d')!
  probe.font = font(100)
  const trackingWidth = (s: string) => Math.max(0, s.length - 1) * tracking * 100
  let best = { lines: opts.layouts[0], em: 0 }
  for (const lines of opts.layouts) {
    const widest = Math.max(...lines.map((l) => probe.measureText(l).width + trackingWidth(l))) / 100
    const tall = lines.length * lineHeight * opts.stretch
    const em = Math.min(opts.width / widest, opts.depth / tall)
    if (em > best.em) best = { lines, em }
  }
  const { lines, em } = best

  // Grid pitch, opened up until the count fits the budget.
  let pitch = em * pitchPerEm
  const inkEstimate = (p: number) => (opts.width * opts.depth * 0.34) / (p * p * 0.866)
  while (inkEstimate(pitch) > opts.maxCount * 1.15) pitch *= 1.06

  // Set the words on a mask canvas, in world units × pxPerUnit.
  const pxPerUnit = maskPxPerPitch / pitch
  const emPx = em * pxPerUnit
  const blockW = opts.width * pxPerUnit
  const lineStep = emPx * lineHeight
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
    const total = widths.reduce((a, b) => a + b, 0) + (glyphs.length - 1) * tracking * emPx
    let x = (canvas.width - total) / 2
    // Optical centring: cap height sits ~0.72 em above the baseline.
    const baseline = (canvas.height - blockH) / 2 + i * lineStep + emPx * 0.8
    lineBoxes.push({ left: x, right: x + total, top: baseline - emPx * 0.78, bottom: baseline + emPx * 0.22 })
    glyphs.forEach((g, gi) => {
      ctx.fillText(g, x, baseline)
      x += widths[gi] + tracking * emPx
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

  const out: LetterPoint[] = []
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
    // a per-point coin toss can land a few over, and trimming those would
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

  return { points: planted, lines, em, pitch }
}
