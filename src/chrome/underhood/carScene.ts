/**
 * The chrome Formula 1 car — renderer, camera choreography and picking.
 *
 * Two modes share one scene builder:
 *   `hero`    — assembled, slow auto-yaw, pointer lean. No picking.
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
const HERO_FILL: [number, number] = [0.99, 0.99]
const SECTION_FILL: [number, number] = [0.99, 0.98]
/** ±3° of pointer lean, which the fit has to have already paid for. */
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
 * Amplitude of the hero's pendulum yaw, in radians. The hero used to spin a
 * full revolution, which forced the fixed-distance fit to pay for the
 * broadside view and shrank the three-quarter view by ~13%. A ±22° rock about
 * the three-quarter front keeps the car large at a constant distance (Marcin
 * 2026-09: "rozmiar stały podczas obrotu, więcej miejsca").
 */
const HERO_YAW = 22 * DEG
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
   * The hero turns for ever, so its sweep is the whole circle and the fit is
   * effectively a bounding cylinder. The section only rocks about its three-
   * quarter front, so its sweep is that arc plus the pointer lean, and the fit
   * is correspondingly tighter — a car that never shows its tail never has to
   * pay for the view where it would.
   */
  const AZ_SWEEP: number[] = []
  if (mode === 'hero') {
    const span = HERO_YAW + LEAN
    for (let i = -8; i <= 8; i++) AZ_SWEEP.push(122 * DEG + (i / 8) * span)
  } else {
    // Filled in per progress: the section's arc travels with the reveal, so
    // the fit at p = 0 must not pay for a yaw the camera only reaches later.
    for (let i = -4; i <= 4; i++) AZ_SWEEP.push(i)
  }

  /** Centre of the yaw arc for the current progress. */
  function baseAzimuth() {
    if (mode === 'hero') return 122 * DEG
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
    const leans = pinned ? [0] : [-LEAN, 0, LEAN]
    let worst = 0
    for (const az of sweep) {
      for (const de of leans) {
        const d = fitDistanceAt(az, el + de, fill[0], fill[1])
        if (d > worst) worst = d
      }
    }
    fitDist = worst
  }

  /** The elevation the camera is heading for; the fit is measured at it. */
  function baseElevation() {
    if (overrideEl !== null) return overrideEl
    if (mode === 'hero') return 12 * DEG
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
      az = 122 * DEG + (reduced ? 0 : Math.sin(time * 0.22) * HERO_YAW)
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
  }

  /* ---- Theme ------------------------------------------------------- */
  function applyTheme(theme: 'light' | 'dark') {
    car.setTheme(theme)
    renderer.toneMappingExposure = theme === 'light' ? 0.95 : 1.05
    dirty = true
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

  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches

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

  if (interactive) {
    canvas.addEventListener('pointermove', onPointerMove, { passive: true })
    canvas.addEventListener('pointerleave', onPointerLeave, { passive: true })
    canvas.addEventListener('pointerdown', onPointerDown, { passive: true })
    canvas.addEventListener('pointerup', onPointerUp, { passive: true })
  } else if (fine) {
    canvas.addEventListener('pointermove', onPointerMove, { passive: true })
    canvas.addEventListener('pointerleave', onPointerLeave, { passive: true })
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
    },
    { threshold: 0 },
  )
  io.observe(host)

  const onVisibility = () => {
    dirty = true
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
  raf = requestAnimationFrame(frame)

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
    },
    resize,
    dispose() {
      if (disposed) return
      disposed = true
      cancelAnimationFrame(raf)
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

  return handle
}

export { partAtProgress }
