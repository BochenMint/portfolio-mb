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
import { createSceneHost, type SceneCtx, type SceneHandle } from '../../stage/sceneHost'
import { createPaverField, EDGE_SHORT, type PaverField } from './pavers'
import { T } from './timeline'

export type PaverSceneHandle = SceneHandle

const TILT_DEG = 24
/** Only the camera's own framing needs the tilt in degrees (handed to the
 *  host); the headline's z-stretch needs it in radians right here — same
 *  split `gardenScene.ts` makes. */
const VFOV = 36

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

  /* No headline in the paving.
   *
   * The garden plants its sentence in flowers and it reads, because a bloom
   * is a few centimetres across and there are two thousand of them. A paver
   * is 20 × 10 cm. Letters built from whole pavers fused into bars; an inlay
   * of 4 cm cut setts — which is what a real brukarz would lay, and was
   * built and rendered — came out as a dot-matrix nobody could read, and the
   * panel it needed swallowed the herringbone that says "paving" in the
   * first place. So this trade says the sentence in type over the finished
   * job (`outro.title` on the stage), and the scene does what it is actually
   * good at: laying the field.
   */
  const pavers = createPaverField(THREE, {
    x0,
    x1,
    zFar: fp.zFar,
    zNear: fp.zNear,
    accents: [],
    light,
    coarse: opts.coarse,
    layWindow: [T.layStart, T.layEnd],
    accentWindow: [T.sandStart, T.sandStart],
    sandWindow: [T.sandStart, T.sandEnd],
  })
  group.add(pavers.group)

  return {
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

