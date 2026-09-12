/**
 * The paving contractor's landing: a screeded aggregate bed, laid over by
 * courses of concrete block paving in herringbone, with the headline set
 * into the field as basalt accent stones and the joints finished with a
 * sand sweep — the paver-trade twin of `krajobraz/scene/gardenScene.ts` on
 * the same engine, extracted to `src/stage/` the day after that one shipped.
 *
 * Same camera as the garden (24° tilt, 36° vertical FOV, the same
 * `groundWidth`), so the two landings read as one studio's work rather than
 * two different demos. Everything else — the render loop, resize handling,
 * visibility, disposal — lives in `stage/sceneHost.ts`; this file only
 * builds the world that sits inside it and drives it from one `update`.
 *
 * Conventions match the garden's: 1 unit ≈ 0.25 m, +x right, +z toward the
 * camera. `three` is never imported here at module scope — it arrives
 * through `ctx.THREE`, itself behind the dynamic import in `sceneHost.ts`.
 */

import type * as THREE_NS from 'three'
import { GROUND_FRAG, GROUND_VERT, groundUniforms, type GroundPalette, type RakeConfig } from '../../stage/ground'
import { setHeadline } from '../../stage/lettering'
import { createSceneHost, type SceneCtx, type SceneHandle } from '../../stage/sceneHost'
import {
  createPaverField,
  EDGE_SHORT,
  paverMetrics,
  settBodyForCapHeight,
  settMetrics,
  settsPerCapHeight,
  type PaverField,
} from './pavers'
import { T } from './timeline'

export type PaverSceneHandle = SceneHandle

const DEG = Math.PI / 180
const TILT_DEG = 24
/** Only the camera's own framing needs the tilt in degrees (handed to the
 *  host); the headline's z-stretch needs it in radians right here — same
 *  split `gardenScene.ts` makes. */
const TILT = TILT_DEG * DEG
const VFOV = 36
const FONT = `"Hanken Grotesk", system-ui, sans-serif`

/** Candidate line breaks for the full sentence, widest-first — the same
 *  freedom `letters.ts` gives the flower bed's own layout search, restored
 *  here after an earlier round found that letting `setHeadline` choose from
 *  an 18-characters-wide option produced too small an em to read (confirmed
 *  by rendering it). Rather than banning that freedom outright, the fix is
 *  to hand `setHeadline` only breaks whose widest line stays reasonably
 *  short — three lines for a wide field down to five for a narrow, deep
 *  one — and let its own largest-em-wins search (see its header) pick
 *  whichever of THESE actually sets biggest for the field it's given. On
 *  1440×900 that's still the 3-line break, ~7.3-7.5 setts per cap height. */
const LAYOUTS_FULL: string[][] = [
  ['Zbuduję dla', 'Ciebie nową', 'stronę'],
  ['Zbuduję', 'dla Ciebie', 'nową', 'stronę'],
  ['Zbuduję', 'dla', 'Ciebie', 'nową', 'stronę'],
]
/** Last resort when even the narrowest full-sentence break, at the sett's
 *  own floor size, still can't clear `TARGET_SPCH` setts per cap height (a
 *  phone too small for the whole sentence to read at all) — dropping words
 *  for a shorter, much larger em beats shipping an unreadable one. See
 *  `fitHeadline`'s own comment for the order this implements. */
const LAYOUT_SHORT: string[][] = [['nową', 'stronę']]
/** The floor this design won't render lettering below at all — see
 *  `fitHeadline`. */
const TARGET_SPCH = 6

/** Set the headline against a field of the given size, then bring setts per
 *  cap height up to `TARGET_SPCH` if the layout's own em didn't already
 *  clear it — in the order the brief asks for:
 *   1. `setHeadline`'s own search already picked whichever of `layouts`
 *      sets largest for this width/depth (see its header) — that's the
 *      line-break-from-aspect step; nothing further to do for it here.
 *   2. If the resulting em, at the mode's own default sett body, comes in
 *      under `TARGET_SPCH`, shrink the sett — not the field, not the text —
 *      toward `SETT_BODY_FLOOR` until it clears `TARGET_SPCH`, or until the
 *      floor itself is reached, whichever comes first.
 *   3. The caller (`build`) checks the returned `spch`: if shrinking the
 *      sett still wasn't enough, it calls this again with `LAYOUT_SHORT`
 *      instead of `LAYOUTS_FULL` — dropping words rather than shipping an
 *      unreadable sentence. That decision lives in `build`, not here, since
 *      it also has to pick the `headline` outcome to report. */
function fitHeadline(
  layouts: string[][],
  args: { width: number; depth: number; centreZ: number; coarse: boolean; rand: () => number },
) {
  const base = setHeadline({
    layouts,
    width: args.width,
    depth: args.depth,
    centreZ: args.centreZ,
    stretch: 1 / Math.cos(TILT),
    weight: 700,
    // A saw cut can afford tighter spacing than letters assembled from
    // whole stones could: with the fragment shader (not a paver's own body)
    // now deciding the exact edge, adjacent letters no longer need a
    // whole sett of daylight between them to read as separate — confirmed
    // by rendering it against 900/0.02 (the flower bed's own numbers, too
    // cramped once the cut is exact) and 800/0.08 (legible but airier than
    // it needs to be).
    tracking: 0.03,
    fontFamily: FONT,
    returnMask: true,
    // The points this also generates aren't used for anything any more (the
    // cut reads the mask directly) — a modest budget just keeps their build
    // cost small rather than tuning it for a precision nothing consumes.
    maxCount: 2000,
    rand: args.rand,
  })
  const defaultBody = settMetrics(args.coarse).settBody
  let settBody = defaultBody
  let spch = settsPerCapHeight(base.em, settBody)
  if (spch < TARGET_SPCH) {
    settBody = settBodyForCapHeight(base.em, TARGET_SPCH, args.coarse)
    spch = settsPerCapHeight(base.em, settBody)
  }
  return { ...base, settBody, spch, shrunk: settBody < defaultBody }
}

/* Aggregate ground: crushed stone under screeded sand — grey-brown, not the
 * garden's loam. `stage/ground.ts` already takes a palette as a plain
 * argument (`groundUniforms(THREE, palette, rake)`), so a second trade never
 * needs to edit that file to get its own colours: this palette lives here,
 * next to the scene that uses it, rather than beside `GARDEN_PALETTE`. */
const AGGREGATE_PALETTE: GroundPalette = {
  wet: [0.018, 0.017, 0.016],
  loam: [0.05, 0.046, 0.04],
  dry: [0.096, 0.088, 0.077],
  stoneLo: [0.07, 0.068, 0.064],
  stoneHi: [0.2, 0.196, 0.185],
  straw: [0.12, 0.108, 0.086],
}

/* A screed board, unlike a rake, runs along a straight guide rail — no drift
 * in the direction the garden's `GARDEN_RAKE` deliberately has ([0.96, 0.28]
 * — dragged almost along x, but not quite). The one thing `ground.ts`'s
 * shared shader does NOT expose as a uniform is the furrow's own meander
 * (`wobble`, baked into `GROUND_FRAG` as an absolute world-space offset,
 * independent of `uRakeFreq`) — tried first at a much higher frequency than
 * the garden's 21, on the theory that tighter lines would read as finer,
 * straighter scoring. Wrong on both counts: the wobble's own amplitude
 * doesn't shrink with frequency, so tighter spacing only made the *relative*
 * wander worse, and at that frequency the furrow's `sin(phase)` aliases
 * against the screen with no distance fade of its own (unlike the fine
 * crumb/grit terms) — the render came out as a moiré wash, confirmed by eye
 * against the harness screenshots, not just guessed at. A LOWER frequency
 * than the garden's own is what actually reads as calm and flat: few, wide,
 * barely-there bands rather than a rake's obvious wandering furrows, on an
 * exactly axis-aligned direction (no drift added on top). */
const SCREED: RakeConfig = { dir: [1, 0], freq: 9 }

const SUN: [number, number, number] = normalize([-0.5, 0.74, -0.45])
const SUN_COL: [number, number, number] = [1.45, 1.12, 0.78]
const SKY: [number, number, number] = [0.36, 0.42, 0.55]
const CLEAR_COLOR = 0x18140f

type World = {
  group: THREE_NS.Group
  groundGeo: THREE_NS.PlaneGeometry
  groundMat: THREE_NS.ShaderMaterial
  pavers: PaverField
  /** Debug-only, so the acceptance check has real numbers to read rather
   *  than a screenshot alone: setts per cap height, the em they came from,
   *  and which line break `setHeadline` actually chose from `LAYOUTS_FULL`
   *  (or `LAYOUT_SHORT`, once `headline` says 'short'). */
  settsPerCapHeight: number
  em: number
  lines: string[]
  /** Which rung of `fitHeadline`'s fallback ladder this build landed on —
   *  'full' (mode's default sett, whole sentence), 'shrunk' (sett shrunk
   *  toward the floor, whole sentence still fits), or 'short' (words
   *  dropped because even the floor sett couldn't clear six setts per cap
   *  height for the whole sentence). See `fitHeadline`'s own comment. */
  headline: 'full' | 'shrunk' | 'short'
  dispose(): void
}

export async function createPaverScene(
  canvas: HTMLCanvasElement,
  opts: { reduced: boolean; coarse: boolean },
): Promise<PaverSceneHandle> {
  // The headline is set in the page's own face, same wait-but-not-forever
  // the garden uses: a font that never arrives must not leave the stage
  // empty.
  await Promise.race([
    document.fonts?.load(`900 64px "Hanken Grotesk"`, 'Zbudujęąó').catch(() => undefined),
    new Promise((r) => setTimeout(r, 2500)),
  ])

  return createSceneHost<World>(canvas, {
    reduced: opts.reduced,
    coarse: opts.coarse,
    tilt: TILT_DEG,
    vfov: VFOV,
    // Same formula as the garden, so a resize picks the same ground width at
    // the same aspect ratio and the two landings feel like one camera rig.
    groundWidth: (aspect) => Math.max(5.6, Math.min(14.5, 7.8 * aspect)),
    sun: SUN,
    sunColor: SUN_COL,
    sky: SKY,
    clearColor: CLEAR_COLOR,
    pixelRatioCap: 1.5,
    build: (ctx) => build(ctx, opts),
    update: (world, p, ctx) => update(world, p, ctx),
    debugInfo: (world) => {
      const info = world?.pavers.info()
      return {
        pavers: info?.stones,
        courses: info?.courses,
        edging: info?.edging,
        lettering: info?.lettering,
        settsPerCapHeight: world?.settsPerCapHeight,
        em: world?.em,
        lines: world?.lines,
        headline: world?.headline,
      }
    },
  })
}

/* ---- World (rebuilt when the shape of the screen changes) -------- */
function build(ctx: SceneCtx, opts: { reduced: boolean; coarse: boolean }): World {
  const { THREE, light } = ctx
  const fp = ctx.frame
  const group = new THREE.Group()

  const depth = fp.zNear - fp.zFar
  // Two different "widths" on purpose. The GROUND plane is a background: it
  // must never show a gap, so it's sized to the WIDER of the near/far
  // half-widths (same as the garden's soil plane) and allowed to run off
  // the edge of the frustum wherever the trapezoid is actually narrower.
  // The FIELD's own rectangle is the opposite case — it has to be something
  // the visitor can actually see the edge of, so it's sized to the
  // NARROWER half-width instead. Using the wider one here first (a
  // copy-paste from the ground sizing) put the edging kerb outside the
  // visible frustum for all but the top few rows of the screen — confirmed
  // by a harness render that showed no kerb anywhere in frame — because a
  // fixed world-x boundary that's correct at the wide (far) end of the
  // trapezoid sits beyond the narrow (near) end's actual edge.
  const groundHalfW = Math.max(fp.halfFar, fp.halfNear)
  const fieldHalfW = Math.min(fp.halfFar, fp.halfNear)
  const x0 = -(fieldHalfW - EDGE_SHORT)
  const x1 = fieldHalfW - EDGE_SHORT

  /* Ground: the same screeded-aggregate bed under the whole visible plane,
   * oversized the same way the garden's soil plane is (`+6`/`+8`) so a
   * resize's rebuild threshold never exposes a bare edge mid-scroll. */
  const groundGeo = new THREE.PlaneGeometry(2 * groundHalfW + 6, depth + 8).rotateX(-Math.PI / 2)
  groundGeo.translate(0, 0, (fp.zFar + fp.zNear) / 2)
  const groundMat = new THREE.ShaderMaterial({
    vertexShader: GROUND_VERT,
    fragmentShader: (opts.coarse ? '#define COARSE 1\n' : '') + GROUND_FRAG,
    uniforms: { ...light, ...groundUniforms(THREE, AGGREGATE_PALETTE, SCREED) },
  })
  const groundMesh = new THREE.Mesh(groundGeo, groundMat)
  // Drawn first: the field and edging cover most of it, but the corners
  // where the visible trapezoid is wider than the field rectangle — and
  // whatever is behind the far horizon — are bed.
  groundMesh.renderOrder = 0
  group.add(groundMesh)

  /* Headline: the same sentence the garden plants, cut whole out of the
   * field as basalt lettering rather than swapped-in field pavers or a
   * rectangular inlay panel — see `pavers.ts`'s own header for why both of
   * those were tried and rejected, and for why the cut is now decided from
   * `stage/lettering.ts`'s own rasterised mask (`returnMask: true` below)
   * rather than a second, coarser grid built from its planting points — a
   * field paver's body is bigger than that grid's own cell, so a paver could
   * survive the old cut with its centre clear of the ink and still lie
   * across part of a stroke. `stage/lettering.ts` is read directly here (not
   * through the garden's own `letters.ts`, whose carpet-bedding logic —
   * species, colour, stems — has nothing to do with a saw cut).
   *
   * The text box is the field's OWN rectangle (`x0`..`x1`, `zFar`..`zNear`),
   * inset by one field paver's long body on every side — a hard margin, not
   * a fraction-of-the-driveway guess: a phone build of this once sized the
   * box from the camera frustum's half-width at a sample z instead of the
   * field's own (fixed, non-trapezoidal) rectangle, and at a narrow enough
   * aspect that frustum sample ran wider than the actual paved area, so the
   * words set past the kerb onto the sub-base — confirmed by rendering it.
   * A word crossing the kerb is not something a paver crew would ever lay,
   * so the margin here is a hard constraint on the box `setHeadline` is
   * handed, not something checked after the fact. */
  const margin = paverMetrics(opts.coarse).longBody
  const textWidth = Math.max(0.5, x1 - x0 - 2 * margin)
  const textDepthBudget = Math.max(0.5, depth - 2 * margin)
  const desiredCentreZ = fp.zFar + depth / 2
  const rand = mulberry32(20260912)

  let fit = fitHeadline(LAYOUTS_FULL, { width: textWidth, depth: textDepthBudget, centreZ: desiredCentreZ, coarse: opts.coarse, rand })
  let headline: World['headline']
  if (fit.spch >= TARGET_SPCH) {
    headline = fit.shrunk ? 'shrunk' : 'full'
  } else {
    // Even the narrowest full-sentence break, sett shrunk to its floor,
    // can't clear TARGET_SPCH on this field — drop words rather than ship
    // an unreadable sentence. LAYOUT_SHORT's own em is set independently
    // (a shorter widest line buys a much larger one), so this re-checks the
    // shrink step for it too rather than assuming the default sett is
    // enough.
    fit = fitHeadline(LAYOUT_SHORT, { width: textWidth, depth: textDepthBudget, centreZ: desiredCentreZ, coarse: opts.coarse, rand })
    headline = 'short'
  }

  // `setHeadline` guarantees the ink fits width × depth (see its own
  // comment), but ONLY as measured by its own `lineHeight`-only approximate
  // block height — the real rasterised box (each line's own 0.78em-above /
  // 0.22em-below baseline padding, at `lineHeight` spacing) runs a per cent
  // or two taller than that approximation, and isn't quite centred on the
  // `centreZ` handed in either. Both are invisible to a caller with slack
  // to spare (the flower bed), and both matter to a hard-margin caller: the
  // 4-line break at 1440×900 put "stronę" close enough to zNear to read as
  // running off-frame — confirmed by rendering it and reading `inkRect`
  // against `zNear`. Rather than leaning on lettering.ts's own baseline
  // constants (fragile: this file would silently go stale if those ever
  // changed), a second pass uses ONLY the public `inkRect` it already
  // returns: `toWorldX`/`toWorldZ` are affine in `width`/`centreZ` alone, so
  // scaling both budgets by how far the first pass's ink overran them, and
  // shifting `centreZ` by how far its mid-point missed `desiredCentreZ`,
  // reproduces the exact same layout and em — just re-centred, and (only
  // when the first pass overran) smaller by that same per cent or two,
  // which is under 2% for every layout this file uses and too small to
  // change `settsPerCapHeight`'s own full/shrunk/short call above.
  if (fit.inkRect) {
    const overW = fit.inkRect.x1 - fit.inkRect.x0
    const overH = fit.inkRect.z1 - fit.inkRect.z0
    const shrink = Math.min(1, textWidth / overW, textDepthBudget / overH)
    const midZ = (fit.inkRect.z0 + fit.inkRect.z1) / 2
    const centreZ = desiredCentreZ - (midZ - desiredCentreZ)
    const refit = setHeadline({
      layouts: [fit.lines],
      width: textWidth * shrink,
      depth: textDepthBudget * shrink,
      centreZ,
      stretch: 1 / Math.cos(TILT),
      weight: 700,
      tracking: 0.03,
      fontFamily: FONT,
      returnMask: true,
      maxCount: 2000,
      rand,
    })
    fit = { ...fit, lines: refit.lines, em: refit.em, mask: refit.mask, maskRect: refit.maskRect, inkRect: refit.inkRect }
  }
  const { lines, em, mask, maskRect, settBody, spch: finalSpch } = fit

  const pavers = createPaverField(THREE, {
    x0,
    x1,
    zFar: fp.zFar,
    zNear: fp.zNear,
    letterMask: mask && maskRect ? { canvas: mask, rect: maskRect } : undefined,
    light,
    coarse: opts.coarse,
    layWindow: [T.layStart, T.layEnd],
    letterWindow: [T.letterStart, T.letterEnd],
    sandWindow: [T.sandStart, T.sandEnd],
    settBody,
  })
  group.add(pavers.group)

  return {
    settsPerCapHeight: finalSpch,
    em,
    lines,
    headline,
    group,
    groundGeo,
    groundMat,
    pavers,
    dispose() {
      groundGeo.dispose()
      groundMat.dispose()
      pavers.dispose()
    },
  }
}

/* ---- Per frame ----------------------------------------------------- */
function update(w: World, p: number, ctx: SceneCtx) {
  w.pavers.setProgress(p, ctx.clock.time)
}

function normalize(v: [number, number, number]): [number, number, number] {
  const l = Math.hypot(v[0], v[1], v[2])
  return [v[0] / l, v[1] / l, v[2] / l]
}

/** Small, fast, seeded — same generator every scene file here uses. */
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

