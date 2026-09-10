/**
 * The chrome Formula 1 car — renderer, camera choreography and picking.
 *
 * Two modes share one scene builder:
 *   `hero`    — assembled and perfectly still at a front three-quarter view;
 *               it only moves when the visitor grabs it, exactly like the
 *               project cubes. No auto-yaw, no pointer lean, no picking, and
 *               no animation frame at all unless a drag or its inertia is
 *               running (Marcin 2026-09: "niech bolid sam z siebie się nie
 *               rusza — ruch po chwyceniu kursorem, jak kubiki").
 *   `explode` — driven by scroll progress; parts separate along the axes they
 *               really come off on, and the visitor can hover or tap them.
 *
 * Everything three.js-shaped is behind a dynamic import, so the initial bundle
 * carries none of it; both scenes share the decoded geometries through the
 * module-level cache in `carAssets.ts`.
 */

import type * as THREE_NS from 'three'
import { partAtProgress, PIECES, loadPartGeometries, type PartId } from './carAssets'
import { buildCar, type Car } from './carParts'

export type { PartId }
export type CarSceneMode = 'hero' | 'explode'

export type CarSceneHandle = {
  /** 0 assembled … 1 fully exploded (explode mode only). */
  setProgress(p: number): void
  /** Programmatic hover, e.g. from the layer list. */
  setHover(id: PartId | null): void
  /** Pinned selection. */
  setActive(id: PartId | null): void
  onHover(cb: (id: PartId | null) => void): void
  onSelect(cb: (id: PartId) => void): void
  setTheme(t: 'light' | 'dark'): void
  /** Pause the RAF when the canvas is offscreen. */
  setVisible(v: boolean): void
  /**
   * Hero only: turn the car by a delta, in degrees. Arrow keys use this; the
   * pointer drag runs inside the scene because it also needs inertia.
   */
  rotateBy(azDeg: number, elDeg: number): void
  resize(): void
  dispose(): void
  /** Only wired up behind `?debug=1`; used by the screenshot harness. */
  debug: {
    setCamera(
      azDeg: number | null,
      elDeg: number | null,
      /** Close-up override: aim somewhere else, from a given distance. */
      opts?: { dist?: number; target?: [number, number, number] },
    ): void
    render(): void
    /**
     * Hero only: a PNG data URL of the default front view on a transparent
     * background, used to bake `public/chrome/f1-hero.webp` from the scene
     * itself so the poster and the first live frame are the same picture.
     */
    snapshot(w?: number, h?: number): string
    /** Derived inboard suspension pickups, for the screenshot harness. */
    anchors(): { corner: number; link: number; x: number; y: number; z: number }[]
    metrics(): {
      az: number
      el: number
      dist: number
      fitDist: number
      soloDist: number
      aspect: number
      pxPerMetre: number
    }
  }
}

const DEG = Math.PI / 180
/**
 * Share of the frame the fit may spend, width then height.
 *
 * The fit works from each piece's box corners, and the worst of those is a
 * little outside the car's real silhouette, so the car itself measures a few
 * points under these numbers. They are also spent on the *worst* yaw the
 * camera will reach rather than on the one on screen — see `refit` — so a
 * three-quarter view, where the car is foreshortened, sits inside them by
 * however much that view is narrower than broadside. That is the whole point:
 * the distance is what stays put, so the car stops breathing as it turns.
 */
const HERO_FILL: [number, number] = [1.0, 0.98]
const SECTION_FILL: [number, number] = [0.99, 0.98]
/** ±3° of pointer lean in the section, which the fit has to have already paid for. */
const LEAN = 3 * DEG
/**
 * Amplitude of the section's parallax rock, in radians.
 *
 * It used to be ±10°, back when the camera re-fitted itself every frame and a
 * wider swing cost nothing. It costs something now: the distance is fitted to
 * the widest yaw the swing can reach, so every degree of swing is a few pixels
 * off the car at every *other* yaw. ±6° still reads as parallax and buys back
 * about 6% of the car's width.
 */
const SECTION_YAW = 6 * DEG
/**
 * The hero's resting view.
 *
 * Azimuth is measured off the car's right-hand side (+Z) and 90° is dead
 * head-on, so 108° is 18° round toward the driver's left: the nose points at
 * the visitor and drifts a little to the left of frame, which is what stops a
 * true head-on shot from reading as a flat badge. Both front wing endplates,
 * the halo and all four wheels stay in view; 9° of elevation is enough to see
 * over the nose into the cockpit without turning it into a plan view.
 */
const HERO_AZ = 108 * DEG
const HERO_EL = 9 * DEG
/**
 * How far the drag may tilt. Below −4° the camera starts looking up at the
 * floor pan, above 28° the car flattens into a top-down and the rear wing
 * eats the cockpit.
 */
const HERO_EL_MIN = -4 * DEG
const HERO_EL_MAX = 28 * DEG
/**
 * Width of the resistance band at each end of the tilt range, in radians.
 *
 * Inside `softClamp` this is an asymptote, not an overshoot: the last 5° take
 * exponentially more travel to cross and the value never actually leaves
 * [min, max]. That matters here in a way it would not in a cube — the camera
 * distance is fitted once over the whole reachable range, so an elevation
 * that escaped the range would also escape the frame it was fitted for.
 */
const HERO_EL_SOFT = 5 * DEG
/**
 * Yaw per pixel of horizontal drag, in degrees, at `DRAG_REF_WIDTH` of host.
 *
 * The reference is the hero host's own width at a 1440-wide viewport — 754 px,
 * measured — not the viewport itself, because what has to stay constant is the
 * rotation a drag across *the object* produces. Scaling by the host's real
 * width gives that: the cube's `DRAG_SENSITIVITY` can be a bare constant
 * because its stage is square and sized in ems, but this host runs from ~340 px
 * on a phone to ~754 px at 1440.
 */
const DRAG_DEG_PER_PX = 0.6
const DRAG_REF_WIDTH = 754
/** Tilt is deliberately lazier than yaw: the useful range is only 32° wide. */
const DRAG_EL_DEG_PER_PX = 0.3
/**
 * Time constant of the release decay, in milliseconds. The cube uses a
 * per-frame friction factor (0.94), which ties its feel to the refresh rate;
 * a time constant gives a 120 Hz screen the same 0.35 s glide as a 60 Hz one.
 */
const INERTIA_TAU_MS = 350
/** Below this the glide is over, in degrees per second. */
const INERTIA_FLOOR = 2
/**
 * Ceiling on the release velocity, in degrees per second.
 *
 * At τ = 0.35 s a fling coasts v × τ degrees, so an unbounded flick — and a
 * trackpad can report a very fast one — would spin the car several times over
 * and land it facing away. 720°/s buys at most about two thirds of a turn.
 */
const MAX_FLING_DEG_PER_S = 720
/** Ignore a fling built from a sample older than this, in milliseconds. */
const FLING_STALE_MS = 90
/**
 * Pixels of travel before a touch gesture commits to rotating.
 *
 * `touch-action: pan-y` on the host already hands vertical pans to the page,
 * but it only decides once the browser sees a direction; until then both are
 * live. Same threshold the cube's overlay leans on, made explicit here
 * because this host also has to answer for a mostly-vertical swipe.
 */
const TOUCH_SLOP = 8
/**
 * How long the ray may miss before the hover is given up, in milliseconds.
 *
 * A cursor crossing a 20 mm wing or the gap between two suspension arms drops
 * off the part and back onto it several times in a few frames, and every one
 * of those round trips used to reach React and repaint the copy. Holding the
 * last hit through a short miss turns that strobe into one steady answer;
 * a real move off the part outlasts it easily.
 */
const HOVER_GRACE_MS = 160
/**
 * Time constant of the dim/brighten lerp, in milliseconds.
 *
 * The emphasis is exponentially smoothed, so a change is ~95% done after three
 * of these — 270 ms, comfortably over the 180 ms floor below which a flick of
 * the cursor reads as a flash rather than a transition. Being a time constant
 * rather than a per-frame fraction also means a 30 fps machine gets the same
 * 270 ms as a 120 fps one.
 */
const EMPHASIS_TAU_MS = 90
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
/** power2.inOut, matching the per-part easing. */
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
/**
 * Clamp that resists rather than stops.
 *
 * The last `soft` radians before each limit are compressed exponentially, so
 * the drag goes stiff instead of hitting a wall and the value approaches the
 * limit without ever crossing it. Slope is 1 where the band starts, so there
 * is no crease at the hand-off.
 */
function softClamp(v: number, min: number, max: number, soft: number) {
  if (v > max - soft) return max - soft * Math.exp(-(v - (max - soft)) / soft)
  if (v < min + soft) return min + soft * Math.exp(-(min + soft - v) / soft)
  return v
}

export async function createCarScene(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  opts: { mode: CarSceneMode; reduced?: boolean },
): Promise<CarSceneHandle> {
  const { mode } = opts
  const reduced = opts.reduced ?? false
  const interactive = mode === 'explode'

  const [THREE, { GLTFLoader }, { DRACOLoader }, { RoomEnvironment }, { mergeVertices }] =
    await Promise.all([
      import('three'),
      import('three/examples/jsm/loaders/GLTFLoader.js'),
      import('three/examples/jsm/loaders/DRACOLoader.js'),
      import('three/examples/jsm/environments/RoomEnvironment.js'),
      import('three/examples/jsm/utils/BufferGeometryUtils.js'),
    ])

  /* ---- Geometry ---------------------------------------------------- */
  const draco = new DRACOLoader().setDecoderPath('/draco/')
  const gltf = new GLTFLoader().setDRACOLoader(draco)

  /**
   * The AI meshes arrive with split vertices and per-face normals, which reads
   * as a faceted lump under a mirror material. Dropping the normals lets
   * `mergeVertices` weld by position alone, and the recomputed normals then
   * run smoothly across each panel — which is the whole point of chrome.
   */
  const loadOne = (url: string) =>
    new Promise<THREE_NS.BufferGeometry[]>((resolve, reject) => {
      gltf.load(
        url,
        (g) => {
          const out: THREE_NS.BufferGeometry[] = []
          g.scene.updateMatrixWorld(true)
          g.scene.traverse((o) => {
            const mesh = o as THREE_NS.Mesh
            if (!mesh.isMesh) return
            const baked = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld)
            baked.deleteAttribute('normal')
            baked.deleteAttribute('uv')
            baked.deleteAttribute('uv1')
            baked.deleteAttribute('tangent')
            const welded = mergeVertices(baked, 1e-4)
            if (welded !== baked) baked.dispose()
            welded.computeVertexNormals()
            welded.computeBoundingBox()
            welded.computeBoundingSphere()
            out.push(welded)
            mesh.geometry.dispose()
          })
          resolve(out)
        },
        undefined,
        reject,
      )
    })

  const files = Array.from(new Set(PIECES.map((p) => p.file)))
  const loaded = await Promise.all(files.map((f) => loadPartGeometries(f, loadOne)))
  draco.dispose()

  const geometries = new Map<string, THREE_NS.BufferGeometry[]>()
  files.forEach((f, i) => geometries.set(f, loaded[i]))

  /* ---- Renderer / scene -------------------------------------------- */
  // Declared up front because the theme and size setup below both flag it.
  let dirty = true

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    premultipliedAlpha: true,
    // Same preference as every other context on the page: mixed preferences
    // make the browser move the page between GPUs and lose every context
    // created before the switch.
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200)

  const pmrem = new THREE.PMREMGenerator(renderer)
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04)
  scene.environment = envRT.texture
  pmrem.dispose()

  const key = new THREE.DirectionalLight(0xffffff, 2.6)
  key.position.set(4, 6, 5)
  const rim = new THREE.DirectionalLight(0xffffff, 1.8)
  rim.position.set(-5, 2.5, -4)
  const ambient = new THREE.AmbientLight(0xffffff, 0.2)
  scene.add(key, rim, ambient)

  // No ground in the hero: that canvas is small enough that the floor's
  // horizon and the canvas edges read as a box drawn around the car. The hero
  // object has always floated on this page; the section is where the car needs
  // to stand on something.
  const car: Car = buildCar(THREE, geometries, { withGround: mode === 'explode' })
  scene.add(car.root)

  /* ---- Camera choreography ----------------------------------------- */
  // Spherical around the car's own bounding box centre. Azimuth is measured
  // off the car's right-hand side (+Z), so 90° is dead ahead of the nose and
  // ~50° is the three-quarter front the reference render uses.
  const cam = { az: 122 * DEG, el: 10 * DEG, dist: 14, tx: 0, ty: 0.5, tz: 0 }
  const want = { ...cam }
  /**
   * Where the hero's drag has put the car. `heroElRaw` is what the pointer has
   * accumulated and `heroEl` is that run through `softClamp` — keeping the raw
   * value means pushing past a limit and coming back retraces the same curve
   * instead of jumping the moment the direction reverses.
   */
  let heroAz = HERO_AZ
  let heroElRaw = HERO_EL
  let heroEl = HERO_EL
  let leanAz = 0
  let leanEl = 0
  let leanAzTarget = 0
  let leanElTarget = 0
  let progress = 0
  let overrideAz: number | null = null
  let overrideEl: number | null = null
  let overrideDist: number | null = null
  let overrideTarget: THREE_NS.Vector3 | null = null
  let groundRadius = 3.4

  const corner = new THREE.Vector3()
  const eye = new THREE.Vector3()
  const right = new THREE.Vector3()
  const camUp = new THREE.Vector3()
  const fwd = new THREE.Vector3()
  const worldUp = new THREE.Vector3(0, 1, 0)

  /**
   * Exact fit rather than a bounding sphere. The car is 5.6 m long, 2 m wide
   * and 1 m tall, so a sphere around its box is ~40% too generous and would
   * push the camera far enough back that the car reads as a toy. Project every
   * piece's own box corners into the camera basis and take the distance that
   * puts the worst one just inside the frustum.
   */
  const fit = { dist: 14, right: 0, up: 0 }
  /** Camera distance for the current state. Set by `refit`, never by yaw. */
  let fitDist = 14

  function setBasis(azimuth: number, elevation: number) {
    fwd
      .set(
        Math.cos(elevation) * Math.sin(azimuth),
        Math.sin(elevation),
        Math.cos(elevation) * Math.cos(azimuth),
      )
      .normalize()
    right.crossVectors(worldUp, fwd).normalize()
    camUp.crossVectors(fwd, right).normalize()
  }

  /**
   * Distance that just contains the car from one particular angle.
   *
   * Distance and aim point have to be solved together, not one after the
   * other: at a three-quarter view the nose is much nearer the camera than the
   * rear wing, so the silhouette sits off to one side of the box centre, and a
   * fit that insisted on aiming at the centre would back the camera off by the
   * whole of that offset — about 20% of the car, measured. Fit, measure where
   * the silhouette landed, slide the aim by half of it, repeat. Three passes
   * is well past convergence. Only the distance is kept; the frame's own aim
   * point comes from `recentre`, at whatever angle is actually on screen.
   */
  function fitDistanceAt(azimuth: number, elevation: number, fillW: number, fillH: number) {
    setBasis(azimuth, elevation)
    const vHalf = Math.tan((camera.fov * DEG) / 2)
    const hHalf = vHalf * camera.aspect
    const pts = car.fitPoints
    let ox = 0
    let oy = 0
    let dist = 14
    for (let pass = 0; pass < 3; pass++) {
      let needed = 0
      for (let i = 0; i < pts.length; i += 3) {
        corner.set(pts[i], pts[i + 1], pts[i + 2]).sub(car.boundsCenter)
        const z = corner.dot(fwd)
        const x = Math.abs(corner.dot(right) - ox)
        const y = Math.abs(corner.dot(camUp) - oy)
        needed = Math.max(needed, z + x / (hHalf * fillW), z + y / (vHalf * fillH))
      }
      dist = Math.max(3, needed)

      let x0 = Infinity
      let x1 = -Infinity
      let y0 = Infinity
      let y1 = -Infinity
      for (let i = 0; i < pts.length; i += 3) {
        corner.set(pts[i], pts[i + 1], pts[i + 2]).sub(car.boundsCenter)
        const d = Math.max(0.1, dist - corner.dot(fwd))
        const nx = (corner.dot(right) - ox) / d
        const ny = (corner.dot(camUp) - oy) / d
        if (nx < x0) x0 = nx
        if (nx > x1) x1 = nx
        if (ny < y0) y0 = ny
        if (ny > y1) y1 = ny
      }
      ox += ((x0 + x1) / 2) * dist
      oy += ((y0 + y1) / 2) * dist
    }
    return dist
  }

  /**
   * Aiming at the box centre is not the same as centring what you see: at a
   * three-quarter view the nose is much closer to the camera than the rear
   * wing, so perspective pushes the silhouette off to one side and the car
   * ends up crowding one edge. Measure where the silhouette actually landed at
   * the *fixed* distance and slide the aim point by half of that.
   *
   * Only the aim point moves, never the distance — a translation cannot change
   * how big the car is, which is the whole contract of this file.
   */
  function recentre(azimuth: number, elevation: number) {
    setBasis(azimuth, elevation)
    const pts = car.fitPoints
    let ox = 0
    let oy = 0
    for (let pass = 0; pass < 2; pass++) {
      let x0 = Infinity
      let x1 = -Infinity
      let y0 = Infinity
      let y1 = -Infinity
      for (let i = 0; i < pts.length; i += 3) {
        corner.set(pts[i], pts[i + 1], pts[i + 2]).sub(car.boundsCenter)
        const d = Math.max(0.1, fitDist - corner.dot(fwd))
        const nx = (corner.dot(right) - ox) / d
        const ny = (corner.dot(camUp) - oy) / d
        if (nx < x0) x0 = nx
        if (nx > x1) x1 = nx
        if (ny < y0) y0 = ny
        if (ny > y1) y1 = ny
      }
      ox += ((x0 + x1) / 2) * fitDist
      oy += ((y0 + y1) / 2) * fitDist
    }
    fit.dist = fitDist
    fit.right = ox
    fit.up = oy
    return fit
  }

  /**
   * Every yaw the camera can reach in this mode, in radians.
   *
   * The hero can be dragged anywhere, so its sweep is the whole circle and the
   * fit is effectively a bounding cylinder — that is the price of the promise
   * that turning the car never changes its size. The section only rocks about
   * its three-quarter front, so its sweep is that arc plus the pointer lean,
   * and the fit is correspondingly tighter — a car that never shows its tail
   * never has to pay for the view where it would.
   */
  const AZ_SWEEP: number[] = []
  if (mode === 'hero') {
    const steps = 36
    for (let i = 0; i < steps; i++) AZ_SWEEP.push((i / steps) * Math.PI * 2)
  } else {
    // Filled in per progress: the section's arc travels with the reveal, so
    // the fit at p = 0 must not pay for a yaw the camera only reaches later.
    for (let i = -4; i <= 4; i++) AZ_SWEEP.push(i)
  }

  /** Centre of the yaw arc for the current progress. */
  function baseAzimuth() {
    if (mode === 'hero') return heroAz
    return lerp(122 * DEG, 133 * DEG, easeInOut(clamp01(progress / 0.12)))
  }

  function sweepFor(): number[] {
    if (mode === 'hero') return AZ_SWEEP
    const centre = baseAzimuth()
    const span = SECTION_YAW + LEAN
    for (let i = 0; i < AZ_SWEEP.length; i++) {
      AZ_SWEEP[i] = centre + ((i - 4) / 4) * span
    }
    return AZ_SWEEP
  }

  /**
   * Recompute the camera distance for the current state.
   *
   * Called when the *state* changes — progress, host size, theme — and never
   * from the frame loop, so yaw and pointer lean cannot move the camera in or
   * out. The distance still eases toward the new value, so an explode opens
   * the frame smoothly instead of snapping it.
   */
  function refit() {
    const fill = mode === 'hero' ? HERO_FILL : SECTION_FILL
    const el = baseElevation()
    // A debug close-up aims somewhere else entirely, so it only has to pay for
    // the one angle it is pinned to; a plain angle override still gets the
    // sweep, or the screenshot harness could not measure what the page does.
    const pinned = overrideTarget !== null && overrideAz !== null
    const sweep = pinned ? [overrideAz as number] : sweepFor()
    // The hero has no pointer lean; what it has instead is a whole tilt range
    // the drag can reach, and the fit has to pay for the extremes of it or the
    // car would grow past the frame on the way up.
    const elevations = pinned
      ? [el]
      : mode === 'hero'
        ? [HERO_EL_MIN, HERO_EL, HERO_EL_MAX]
        : [el - LEAN, el, el + LEAN]
    let worst = 0
    for (const az of sweep) {
      for (const e of elevations) {
        const d = fitDistanceAt(az, e, fill[0], fill[1])
        if (d > worst) worst = d
      }
    }
    fitDist = worst
  }

  /** The elevation the camera is heading for; the fit is measured at it. */
  function baseElevation() {
    if (overrideEl !== null) return overrideEl
    if (mode === 'hero') return heroEl
    return lerp(6 * DEG, 20 * DEG, easeInOut(clamp01(progress / 0.12)))
  }

  /**
   * Size the floor from what the camera can see rather than from the car.
   *
   * The disc's alpha reaches zero exactly at its rim, so the only way the
   * floor can show an edge is if that rim falls outside the canvas and the
   * canvas does the cutting — which is precisely what used to happen at the
   * left and right sides. Push the rim in until every one of its sample
   * points lands inside `GROUND_NDC`, and the fade always finishes on screen,
   * at any aspect and any progress. (Same lesson as `fitShadow()` in
   * `ProjectCube.tsx`: a soft edge is only soft if you can see all of it.)
   */
  const GROUND_NDC = 0.85
  const GROUND_SAMPLES = 24
  const rimPoint = new THREE.Vector3()

  function fitGround() {
    if (mode !== 'explode') return
    const c = car.groundCenter
    let r = groundRadius
    for (let pass = 0; pass < 4; pass++) {
      let worst = 0
      for (let i = 0; i < GROUND_SAMPLES; i++) {
        const a = (i / GROUND_SAMPLES) * Math.PI * 2
        rimPoint.set(c.x + Math.cos(a) * r, 0, c.z + Math.sin(a) * r).project(camera)
        // Behind the camera the projection folds back on itself and reads as
        // "inside"; treat it as far outside so the disc keeps shrinking.
        const out = rimPoint.z > 1 ? 4 : Math.max(Math.abs(rimPoint.x), Math.abs(rimPoint.y))
        worst = Math.max(worst, out)
      }
      if (worst < 1e-3) break
      const next = r * (GROUND_NDC / worst)
      if (Math.abs(next - r) < 1e-3) {
        r = next
        break
      }
      r = next
    }
    groundRadius = Math.min(7, Math.max(1.8, r))
    car.setGroundRadius(groundRadius)
  }

  function updateCameraTargets(time: number) {
    let az: number
    if (mode === 'hero') {
      // Wherever the drag left it, and nowhere else. No pendulum, no lean:
      // the hero is a still object until someone picks it up.
      az = heroAz
    } else {
      // Hold the car assembled for the first 12% while the camera lifts from a
      // low three-quarter front to a slightly higher one — the move that makes
      // the section read as a reveal rather than a jump cut.
      az = baseAzimuth()
      if (!reduced) az += Math.sin(time * 0.16) * SECTION_YAW
    }
    if (overrideAz !== null) az = overrideAz
    const el = baseElevation()

    want.az = az
    want.el = el

    if (overrideTarget) {
      want.dist = overrideDist ?? fitDist
      want.tx = overrideTarget.x
      want.ty = overrideTarget.y
      want.tz = overrideTarget.z
      return
    }

    const f = recentre(az + leanAz, el + leanEl)
    want.dist = f.dist
    // `right` / `camUp` are the basis `recentre` just built for this angle.
    want.tx = car.boundsCenter.x + right.x * f.right + camUp.x * f.up
    want.ty = car.boundsCenter.y + right.y * f.right + camUp.y * f.up
    want.tz = car.boundsCenter.z + right.z * f.right + camUp.z * f.up
  }

  function placeCamera() {
    const az = cam.az + leanAz
    const el = cam.el + leanEl
    eye.set(
      Math.cos(el) * Math.sin(az),
      Math.sin(el),
      Math.cos(el) * Math.cos(az),
    ).multiplyScalar(cam.dist)
    camera.position.set(cam.tx + eye.x, cam.ty + eye.y, cam.tz + eye.z)
    camera.lookAt(cam.tx, cam.ty, cam.tz)
    // `project()` in the ground fit reads `matrixWorldInverse`, which is
    // otherwise only refreshed inside `render`.
    camera.updateMatrixWorld()
    fitGround()
  }

  /* ---- Sizing ------------------------------------------------------ */
  /**
   * False until the first frame has been drawn.
   *
   * The hero renders on demand, and both `resize` and `applyTheme` are among
   * the things that demand one — but both also run during construction, before
   * there is anything worth drawing. This keeps those first calls from
   * rendering a half-built scene.
   */
  let booted = false

  function resize() {
    const r = host.getBoundingClientRect()
    const w = Math.max(1, Math.round(r.width))
    const h = Math.max(1, Math.round(r.height))
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    // The fit is per state, not per frame, and the frame just changed shape.
    refit()
    dirty = true
    if (mode === 'hero' && booted) drawHero()
  }

  /* ---- Theme ------------------------------------------------------- */
  function applyTheme(theme: 'light' | 'dark') {
    car.setTheme(theme)
    // The hero used to be lit by a car that was always turning, so a highlight
    // that blew out at one yaw was gone a second later. A still car keeps
    // whatever it is given, and on the light page's near-white ground the
    // top surfaces at 1.05 clipped into the background. 0.88 holds the
    // silhouette; the dark page still wants the extra stop.
    renderer.toneMappingExposure =
      theme === 'light' ? (mode === 'hero' ? 0.88 : 0.95) : 1.05
    dirty = true
    if (mode === 'hero' && booted) drawHero()
  }
  const readTheme = (): 'light' | 'dark' =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
  applyTheme(readTheme())
  const themeMo = new MutationObserver(() => applyTheme(readTheme()))
  themeMo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  /* ---- Picking ----------------------------------------------------- */
  const raycaster = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  let pointerInside = false
  let pointerNdcX = 0
  let pointerNdcY = 0
  let pickDirty = false
  /** Raw result of the last raycast, before the grace period is applied. */
  let rawPick: PartId | null = null
  /** When the ray first started missing, or 0 while it is hitting. */
  let missSince = 0
  let raycastHover: PartId | null = null
  let externalHover: PartId | null = null
  let activeId: PartId | null = null
  let hoverCb: ((id: PartId | null) => void) | null = null
  let selectCb: ((id: PartId) => void) | null = null

  function pick(): PartId | null {
    ndc.set(pointerNdcX, pointerNdcY)
    raycaster.setFromCamera(ndc, camera)
    const hits = raycaster.intersectObjects(car.raycastTargets, false)
    for (const hit of hits) {
      const id = hit.object.userData.partId as PartId | undefined
      if (id) return id
    }
    return null
  }

  function toNdc(e: PointerEvent) {
    const r = canvas.getBoundingClientRect()
    pointerNdcX = ((e.clientX - r.left) / r.width) * 2 - 1
    pointerNdcY = -((e.clientY - r.top) / r.height) * 2 + 1
  }

  const onPointerMove = (e: PointerEvent) => {
    toNdc(e)
    pointerInside = true
    pickDirty = true
    // ±3° of lean in both axes, in both modes: enough to move a highlight
    // across a panel, not enough to read as the car following the cursor.
    leanAzTarget = -pointerNdcX * 3 * DEG
    leanElTarget = pointerNdcY * 3 * DEG
    dirty = true
  }
  const onPointerLeave = () => {
    pointerInside = false
    pickDirty = true
    leanAzTarget = 0
    leanElTarget = 0
    dirty = true
  }

  let downX = 0
  let downY = 0
  const onPointerDown = (e: PointerEvent) => {
    downX = e.clientX
    downY = e.clientY
  }
  const onPointerUp = (e: PointerEvent) => {
    if (Math.abs(e.clientX - downX) > 8 || Math.abs(e.clientY - downY) > 8) return
    toNdc(e)
    const id = pick()
    if (id && selectCb) selectCb(id)
  }

  // The hero deliberately gets none of this: no picking, and no pointer lean
  // either — a car that leans toward the cursor is a car that moves on its
  // own, which is exactly what the hero is not allowed to do any more.
  if (interactive) {
    canvas.addEventListener('pointermove', onPointerMove, { passive: true })
    canvas.addEventListener('pointerleave', onPointerLeave, { passive: true })
    canvas.addEventListener('pointerdown', onPointerDown, { passive: true })
    canvas.addEventListener('pointerup', onPointerUp, { passive: true })
  }

  /* ---- Loop -------------------------------------------------------- */
  let inView = true
  let visible = true
  let raf = 0
  let disposed = false
  const start = performance.now()
  let prevTs = start

  const io = new IntersectionObserver(
    ([entry]) => {
      inView = entry?.isIntersecting ?? true
      dirty = true
      // The hero has no loop to pick this up on the next frame, and a drawing
      // buffer that has been off screen for a while is not guaranteed to still
      // hold the last picture. One frame on the way back in is cheap.
      if (mode === 'hero' && booted && inView) drawHero()
    },
    { threshold: 0 },
  )
  io.observe(host)

  const onVisibility = () => {
    dirty = true
    if (mode === 'hero' && booted && !document.hidden && inView) drawHero()
  }
  document.addEventListener('visibilitychange', onVisibility)

  function frame(ts: number) {
    raf = requestAnimationFrame(frame)
    const idle = document.hidden || !inView || !visible
    // Still honour a one-off render when something changed while paused —
    // otherwise the canvas would be blank the first time it scrolls in, and
    // headless screenshots (where `document.hidden` is always true) would
    // never show anything.
    if (idle && !dirty) return

    const dt = Math.max(1, ts - prevTs)
    prevTs = ts
    const time = (ts - start) / 1000
    const k = reduced || idle ? 1 : 0.12

    leanAz += (leanAzTarget - leanAz) * (reduced ? 1 : 0.08)
    leanEl += (leanElTarget - leanEl) * (reduced ? 1 : 0.08)

    updateCameraTargets(idle ? 0 : time)
    cam.az += (want.az - cam.az) * k
    cam.el += (want.el - cam.el) * k
    cam.dist += (want.dist - cam.dist) * k
    cam.tx += (want.tx - cam.tx) * k
    cam.ty += (want.ty - cam.ty) * k
    cam.tz += (want.tz - cam.tz) * k
    placeCamera()

    // Re-run whenever the pointer moved, and keep running while a miss is
    // still inside its grace period so the timer has frames to expire in.
    if (interactive && (pickDirty || missSince !== 0)) {
      if (pickDirty) {
        pickDirty = false
        rawPick = pointerInside ? pick() : null
      }
      let next = rawPick
      if (next === null && raycastHover !== null) {
        if (missSince === 0) missSince = ts
        if (ts - missSince < HOVER_GRACE_MS) next = raycastHover
        else missSince = 0
      } else if (next !== null) {
        missSince = 0
      }
      if (next !== raycastHover) {
        raycastHover = next
        canvas.style.cursor = next ? 'pointer' : ''
        // Only on a real change: a listener that repaints copy must not be
        // told the same id twice a frame.
        hoverCb?.(next)
      }
    }

    const highlight = externalHover ?? raycastHover ?? activeId
    car.applyEmphasis(
      highlight,
      reduced || idle ? 1 : 1 - Math.exp(-Math.min(50, dt) / EMPHASIS_TAU_MS),
    )

    renderer.render(scene, camera)
    // Keep animating while anything is still easing; settle otherwise.
    dirty = !idle
  }
  // The section scrubs with the scroll and needs a frame every frame. The hero
  // is a still picture: it renders when the camera, the theme or the host size
  // says it must, and only spins up a loop for the length of a drag.
  if (mode === 'explode') raf = requestAnimationFrame(frame)

  /* ---- Hero: still until grabbed ----------------------------------- */
  /**
   * Snap the camera onto the angles the drag has set and draw one frame.
   *
   * No easing anywhere: an eased hero would keep moving after the pointer
   * stopped, and the inertia below is the only afterglow this object is
   * allowed. `refit` is not called — the distance was fitted once, over every
   * yaw and both tilt limits, so it is already right for wherever this lands.
   */
  function drawHero() {
    if (disposed) return
    updateCameraTargets(0)
    cam.az = want.az
    cam.el = want.el
    cam.dist = want.dist
    cam.tx = want.tx
    cam.ty = want.ty
    cam.tz = want.tz
    placeCamera()
    renderer.render(scene, camera)
    dirty = false
  }

  /** Apply a yaw/tilt delta in radians and redraw. */
  function heroTurn(dAz: number, dEl: number) {
    heroAz += dAz
    heroElRaw += dEl
    // Cap the raw value a band beyond the limit: without this a long upward
    // flick could bank 90° of slack that has to be dragged back down before
    // anything moves again.
    heroElRaw = Math.min(
      HERO_EL_MAX + 2 * HERO_EL_SOFT,
      Math.max(HERO_EL_MIN - 2 * HERO_EL_SOFT, heroElRaw),
    )
    heroEl = softClamp(heroElRaw, HERO_EL_MIN, HERO_EL_MAX, HERO_EL_SOFT)
    drawHero()
  }

  let dragging = false
  let dragCommitted = false
  let dragPointer = -1
  let dragStartX = 0
  let dragStartY = 0
  let lastX = 0
  let lastY = 0
  let lastMoveTs = 0
  /** Release velocity, in radians per second. */
  let velAz = 0
  let velEl = 0
  let inertiaRaf = 0
  let inertiaTs = 0

  /** Degrees of yaw per pixel for this host's real width. */
  const degPerPx = () => {
    const w = host.getBoundingClientRect().width || DRAG_REF_WIDTH
    return (DRAG_REF_WIDTH / w) * DRAG_DEG_PER_PX
  }

  function stopInertia() {
    if (inertiaRaf) cancelAnimationFrame(inertiaRaf)
    inertiaRaf = 0
    velAz = 0
    velEl = 0
  }

  function inertiaFrame(ts: number) {
    const dt = Math.min(64, Math.max(1, ts - inertiaTs))
    inertiaTs = ts
    const decay = Math.exp(-dt / INERTIA_TAU_MS)
    heroTurn(velAz * (dt / 1000), velEl * (dt / 1000))
    velAz *= decay
    velEl *= decay
    if (Math.abs(velAz) < INERTIA_FLOOR * DEG && Math.abs(velEl) < INERTIA_FLOOR * DEG) {
      inertiaRaf = 0
      velAz = 0
      velEl = 0
      return
    }
    inertiaRaf = requestAnimationFrame(inertiaFrame)
  }

  /**
   * Capture is best-effort: a synthetic pointer (the screenshot harness, or a
   * page script) has no id the browser knows about and throws here, which
   * must not cost the drag.
   */
  function capture(id: number) {
    try {
      host.setPointerCapture(id)
    } catch {
      // Not a real pointer; the plain move/up listeners still see it.
    }
  }

  function beginDrag() {
    dragCommitted = true
    host.style.cursor = 'grabbing'
  }

  const onHeroDown = (e: PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    stopInertia()
    dragging = true
    dragPointer = e.pointerId
    dragStartX = lastX = e.clientX
    dragStartY = lastY = e.clientY
    lastMoveTs = e.timeStamp
    // A mouse or pen has nothing to negotiate with the page; a finger does,
    // so it stays uncommitted until it has shown which way it is going.
    dragCommitted = e.pointerType !== 'touch'
    if (dragCommitted) {
      capture(e.pointerId)
      host.style.cursor = 'grabbing'
    }
  }

  const onHeroMove = (e: PointerEvent) => {
    if (!dragging || e.pointerId !== dragPointer) return
    if (!dragCommitted) {
      const dx = e.clientX - dragStartX
      const dy = e.clientY - dragStartY
      if (Math.abs(dx) < TOUCH_SLOP && Math.abs(dy) < TOUCH_SLOP) return
      if (Math.abs(dy) > Math.abs(dx)) {
        // Mostly vertical: this is the page's gesture, not ours. `touch-action:
        // pan-y` lets the browser take it from here.
        dragging = false
        return
      }
      capture(e.pointerId)
      beginDrag()
      lastX = e.clientX
      lastY = e.clientY
      lastMoveTs = e.timeStamp
      return
    }
    const dx = e.clientX - lastX
    const dy = e.clientY - lastY
    const dt = Math.max(1, e.timeStamp - lastMoveTs)
    const k = degPerPx()
    // Screen-right drags the near side of the car to the right, which reads as
    // turning the car the way the hand went; the camera therefore goes the
    // other way, hence the sign.
    const dAz = -dx * k * DEG
    // Dragging up brings the top of the car toward the viewer, which is the
    // camera climbing — hence the sign here too.
    const dEl = -dy * (k / DRAG_DEG_PER_PX) * DRAG_EL_DEG_PER_PX * DEG
    lastX = e.clientX
    lastY = e.clientY
    lastMoveTs = e.timeStamp
    velAz = (dAz / dt) * 1000
    velEl = (dEl / dt) * 1000
    heroTurn(dAz, dEl)
  }

  const onHeroUp = (e: PointerEvent) => {
    if (!dragging || e.pointerId !== dragPointer) return
    const wasCommitted = dragCommitted
    dragging = false
    dragCommitted = false
    dragPointer = -1
    host.style.cursor = ''
    try {
      host.releasePointerCapture(e.pointerId)
    } catch {
      // Already released, e.g. after a pointercancel.
    }
    // A fling only counts if the hand was still moving when it let go; a drag
    // that paused before release should stop dead.
    const stale = e.timeStamp - lastMoveTs > FLING_STALE_MS
    if (!wasCommitted || reduced || stale || e.type === 'pointercancel') {
      velAz = 0
      velEl = 0
      return
    }
    if (Math.abs(velAz) < INERTIA_FLOOR * DEG && Math.abs(velEl) < INERTIA_FLOOR * DEG) return
    const cap = MAX_FLING_DEG_PER_S * DEG
    velAz = Math.max(-cap, Math.min(cap, velAz))
    velEl = Math.max(-cap, Math.min(cap, velEl))
    inertiaTs = performance.now()
    inertiaRaf = requestAnimationFrame(inertiaFrame)
  }

  if (mode === 'hero') {
    host.style.touchAction = 'pan-y'
    host.style.cursor = 'grab'
    host.addEventListener('pointerdown', onHeroDown)
    host.addEventListener('pointermove', onHeroMove)
    host.addEventListener('pointerup', onHeroUp)
    host.addEventListener('pointercancel', onHeroUp)
  }

  /* ---- Context loss ------------------------------------------------ */
  let onContextLost: ((e: Event) => void) | null = null

  /* ---- Handle ------------------------------------------------------ */
  const handle: CarSceneHandle = {
    setProgress(p: number) {
      const next = clamp01(p)
      if (next === progress) return
      progress = next
      car.setProgress(progress)
      refit()
      dirty = true
      pickDirty = true
    },
    setHover(id) {
      if (externalHover === id) return
      externalHover = id
      dirty = true
    },
    setActive(id) {
      if (activeId === id) return
      activeId = id
      dirty = true
    },
    onHover(cb) {
      hoverCb = cb
    },
    onSelect(cb) {
      selectCb = cb
    },
    setTheme(t) {
      applyTheme(t)
    },
    setVisible(v) {
      visible = v
      dirty = true
      if (mode === 'hero' && booted && v) drawHero()
    },
    rotateBy(azDeg, elDeg) {
      if (mode !== 'hero') return
      stopInertia()
      heroTurn(azDeg * DEG, elDeg * DEG)
    },
    resize,
    dispose() {
      if (disposed) return
      disposed = true
      cancelAnimationFrame(raf)
      if (inertiaRaf) cancelAnimationFrame(inertiaRaf)
      host.removeEventListener('pointerdown', onHeroDown)
      host.removeEventListener('pointermove', onHeroMove)
      host.removeEventListener('pointerup', onHeroUp)
      host.removeEventListener('pointercancel', onHeroUp)
      io.disconnect()
      themeMo.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointerup', onPointerUp)
      if (onContextLost) canvas.removeEventListener('webglcontextlost', onContextLost)
      car.dispose()
      envRT.dispose()
      renderer.dispose()
      // The geometries stay in the module cache on purpose: the hero and the
      // exploded section share them, and re-decoding Draco is the expensive
      // half of the load.
    },
    debug: {
      setCamera(azDeg, elDeg, opts) {
        overrideAz = azDeg === null ? null : azDeg * DEG
        overrideEl = elDeg === null ? null : elDeg * DEG
        overrideDist = opts?.dist ?? null
        overrideTarget = opts?.target
          ? new THREE.Vector3(opts.target[0], opts.target[1], opts.target[2])
          : null
        refit()
        // Debug views should snap, not ease.
        updateCameraTargets(0)
        cam.az = want.az
        cam.el = want.el
        cam.dist = want.dist
        cam.tx = want.tx
        cam.ty = want.ty
        cam.tz = want.tz
        leanAz = leanEl = leanAzTarget = leanElTarget = 0
        placeCamera()
        dirty = true
      },
      render() {
        placeCamera()
        renderer.render(scene, camera)
      },
      /**
       * The renderer has no `preserveDrawingBuffer`, so the read has to happen
       * in the same task as the draw, before the compositor gets a look in —
       * which is why this renders and reads back inline instead of scheduling
       * anything. Alpha is already premultiplied and the clear colour is
       * transparent, so the PNG comes out cut out.
       */
      snapshot(w = 1920, h = 1200) {
        const prevRatio = renderer.getPixelRatio()
        const prevAz = heroAz
        const prevElRaw = heroElRaw
        const prevEl = heroEl
        heroAz = HERO_AZ
        heroElRaw = HERO_EL
        heroEl = HERO_EL
        renderer.setPixelRatio(1)
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        refit()
        drawHero()
        const url = renderer.domElement.toDataURL('image/png')
        heroAz = prevAz
        heroElRaw = prevElRaw
        heroEl = prevEl
        renderer.setPixelRatio(prevRatio)
        // Puts the renderer, the aspect and the fit back on the host's own
        // size, and draws the frame the visitor is actually looking at.
        resize()
        return url
      },
      anchors() {
        return car.anchors.flatMap((links, corner) =>
          links.map((v, link) => ({
            corner,
            link,
            x: +v.x.toFixed(4),
            y: +v.y.toFixed(4),
            z: +v.z.toFixed(4),
          })),
        )
      },
      metrics() {
        const h = renderer.domElement.clientHeight || 1
        const fill = mode === 'hero' ? HERO_FILL : SECTION_FILL
        return {
          // What this one angle would have cost on its own — the price of
          // holding the distance still across the whole sweep.
          soloDist: fitDistanceAt(cam.az, cam.el, fill[0], fill[1]),
          az: cam.az / DEG,
          el: cam.el / DEG,
          dist: cam.dist,
          fitDist,
          aspect: camera.aspect,
          // Pixels per metre on the plane the camera is aimed at — the number
          // that has to stay put while the car turns.
          pxPerMetre: h / 2 / (Math.tan((camera.fov * DEG) / 2) * cam.dist),
        }
      },
    },
  }

  onContextLost = (e: Event) => {
    e.preventDefault()
    cancelAnimationFrame(raf)
    canvas.dispatchEvent(new CustomEvent('carscene:lost', { bubbles: true }))
  }
  canvas.addEventListener('webglcontextlost', onContextLost)

  // First frame synchronously, so the caller can hide its poster the moment
  // this promise resolves rather than one animation frame later.
  resize()
  car.setProgress(0)
  refit()
  updateCameraTargets(0)
  cam.az = want.az
  cam.el = want.el
  cam.dist = want.dist
  cam.tx = want.tx
  cam.ty = want.ty
  cam.tz = want.tz
  placeCamera()
  renderer.render(scene, camera)
  booted = true

  return handle
}

export { partAtProgress }
