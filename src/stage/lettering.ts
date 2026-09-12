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
  /** Only present when `returnMask` was passed: the offscreen canvas this
   *  function already rasterises the words onto (white ink on black), and
   *  the world-space rectangle it covers. A caller that needs to cut
   *  something against the words' TRUE outline — not just a grid of planting
   *  points — can upload this directly as a texture and sample it per
   *  fragment; the points above are a coarser derived product of the same
   *  canvas, for callers (the flower bed) that only need planting spots.
   *
   *  `maskRect` is the CANVAS's true world extent, not the `width`/`depth`
   *  box the caller asked for — the canvas is deliberately a bit bigger
   *  than the tight text (see `blockW`/`blockH` below, a bleed margin for
   *  ascenders/descenders and anti-aliasing at the glyph edges), and a
   *  mask-sampling caller needs the rect that actually matches the pixels
   *  it's about to sample, not a tighter one. A caller that instead needs
   *  to know where the INK itself sits (a hard-margin cut that must not
   *  cross a kerb, say) wants `inkRect` below, not this. */
  mask?: HTMLCanvasElement
  maskRect?: { x0: number; z0: number; x1: number; z1: number }
  /** Only present when `returnMask` was passed: the tight world-space
   *  bounding box of the actual rasterised ink (the same `lineBoxes` this
   *  function already builds to bucket points by line and normalise `nx`),
   *  as opposed to `maskRect`'s canvas-plus-bleed extent. This is what a
   *  hard-margin caller should size its clearance against — the em this
   *  function picks already guarantees the ink itself fits the `width` ×
   *  `depth` box handed in, so a caller that gave a margin-inset box gets a
   *  margin-respecting `inkRect` for free; it should never need to touch
   *  `maskRect` for that. */
  inkRect?: { x0: number; z0: number; x1: number; z1: number }
}

const WEIGHT = 900
const LINE_HEIGHT = 0.96
const TRACKING = 0.02
/** Points across a stem of the heavy face, roughly. */
const PITCH_PER_EM = 0.05
/** Canvas pixels per point pitch: enough to find the letter edges. */
const MASK_PX_PER_PITCH = 7

export function setHeadline(opts: {
  /** Candidate line breaks, fewest lines (widest) first; the one that sets
   *  largest wins — unless an option with MORE lines only wins marginally,
   *  in which case the earlier, simpler break is kept (see the loop below
   *  for why). */
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
  /** Hand back the rasterised mask itself (canvas + the world rect it
   *  covers) alongside the usual planting points. Opt-in and additive only
   *  — nothing about how the points are generated changes, so an existing
   *  caller (the flower bed) that doesn't pass this sees no difference. */
  returnMask?: boolean
}): LetterField {
  const weight = opts.weight ?? WEIGHT
  const lineHeight = opts.lineHeight ?? LINE_HEIGHT
  const tracking = opts.tracking ?? TRACKING
  const pitchPerEm = opts.pitchPerEm ?? PITCH_PER_EM
  const maskPxPerPitch = opts.maskPxPerPitch ?? MASK_PX_PER_PITCH
  const { rand } = opts
  const font = (px: number) => `${weight} ${px}px ${opts.fontFamily}`

  // Measure every layout at 100 px and keep the one that sets largest. This
  // picks em so the TIGHT TEXT fits width × depth — not the mask canvas
  // built further down, which is deliberately a bit bigger than the tight
  // text (see `blockW`/`blockH`, a bleed margin for ascenders/descenders and
  // anti-aliasing at the glyph edges) and is allowed to run past this box as
  // a result. An earlier version of this function subtracted that bleed
  // from the box here instead, on the theory that a hard-margin caller (a
  // paving cut that must not cross a kerb) needed the CANVAS to respect its
  // box — that shrank the type for every caller, including the flower bed,
  // which only ever consumes ink (via `points`), never the bleed pixels
  // around it. The actual fix for a hard-margin caller is `inkRect` below,
  // not a smaller em for everyone.
  const probe = document.createElement('canvas').getContext('2d')!
  probe.font = font(100)
  const trackingWidth = (s: string) => Math.max(0, s.length - 1) * tracking * 100
  // A candidate only unseats the current best if it sets MEANINGFULLY
  // larger (18%+), not just marginally — `opts.layouts` is listed fewest-
  // lines-first, so on any field whose proportions leave two adjacent
  // candidates within a modest distance of each other, this keeps the
  // simpler (fewer-line) break. Two things confirmed this needs to be a
  // real margin, not a hair's-breadth tie-break: (1) a plain largest-em-wins
  // search, rendered against a field whose depth (a driveway's world-space
  // z-extent under this camera's tilt, NOT the viewport's own width:height
  // ratio) came out only slightly boxier than a 3-line break's own ideal
  // shape, picked a 4-line break over the 3-line one by a full ~12% larger
  // em, on a screen a person would call unambiguously "wide" — closest-
  // aspect-match scoring (tried as an alternative to a flat threshold)
  // agreed with the 4-line pick too, so this isn't a rounding-error case
  // either candidate could reasonably win. (2) A depth-bound break like
  // that 4-line one spends its ENTIRE depth budget on the ink, leaving zero
  // slack below it before the field's own edge — where a width-bound break
  // (like the 3-line one) naturally leaves slack, because width, not
  // depth, was what capped its em. That headroom is what kept the 3-line
  // break clear of the page's own CTA copy under the pinned scene; the
  // 4-line one, confirmed by rendering it, ran close enough to read as
  // overlapping that copy. Fewer lines is the safer default for both
  // reasons, so the bar for switching away from it is set well above the
  // ~12% this specific case measured, not just above it.
  const MEANINGFULLY_BIGGER = 1.18
  let best = { lines: opts.layouts[0], em: 0 }
  for (const lines of opts.layouts) {
    const widest = Math.max(...lines.map((l) => probe.measureText(l).width + trackingWidth(l))) / 100
    const tall = lines.length * lineHeight * opts.stretch
    const em = Math.min(opts.width / widest, opts.depth / tall)
    if (em > best.em * MEANINGFULLY_BIGGER) best = { lines, em }
  }
  const { lines, em } = best

  // Grid pitch, opened up until the count fits the budget.
  let pitch = em * pitchPerEm
  const inkEstimate = (p: number) => (opts.width * opts.depth * 0.34) / (p * p * 0.866)
  while (inkEstimate(pitch) > opts.maxCount * 1.15) pitch *= 1.06

  // Set the words on a mask canvas, in world units × pxPerUnit. `blockW` is
  // the full `width` budget, not just the tight text — same bleed-canvas
  // reasoning as the em pick above, and why `maskRect` (built from this)
  // can run past the box while `inkRect` (built from `lineBoxes` below)
  // never does.
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

  const field: LetterField = { points: planted, lines, em, pitch }
  if (opts.returnMask) {
    field.mask = canvas
    // Same corner-to-world mapping toWorldX/toWorldZ already uses for every
    // planting point, just applied to the canvas's own four corners instead
    // of a jittered grid — so this rectangle and the mask's own pixels agree
    // with the points above by construction, not by a second calculation
    // that could drift out of sync with them.
    field.maskRect = {
      x0: toWorldX(0),
      z0: toWorldZ(0),
      x1: toWorldX(canvas.width),
      z1: toWorldZ(canvas.height),
    }
    // The tight ink box, not the padded canvas: `textLeft`/`textRight` are
    // the same numbers `nx` above is already normalised against, and
    // `lineBoxes[0]`/`lineBoxes[last]` are the topmost/bottommost line's own
    // box (lines are laid out top-to-bottom in array order, so first/last
    // is min/max by construction) — no second measurement pass, just the
    // corners of what's already computed. Guaranteed (by the em pick above)
    // to sit within the `width` × `depth` box the caller handed in.
    field.inkRect = {
      x0: toWorldX(textLeft),
      z0: toWorldZ(lineBoxes[0].top),
      x1: toWorldX(textRight),
      z1: toWorldZ(lineBoxes[lineBoxes.length - 1].bottom),
    }
  }
  return field
}
