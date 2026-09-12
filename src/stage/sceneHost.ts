/**
 * The three.js plumbing shared by every scene mounted on `ScrollStage`:
 * renderer setup, the camera's ground-plane framing, the build/destroy cycle
 * (rebuilt only when the screen's shape actually changes, not on every pixel
 * of scroll-bar wobble), the animation loop (eased progress, half-rate idle,
 * pause when hidden), and the `?debug=1` jump/info handle.
 *
 * A landing supplies `build(ctx)` to construct its own world and
 * `update(world, p, ctx)` to animate it each frame; everything else — the
 * render loop, resize handling, visibility, disposal — is handled here once.
 * `three` is loaded here, behind this module's own dynamic import, so
 * nothing in `src/stage/` pulls it into the first bundle.
 */

import type * as THREE_NS from 'three'

const DEG = Math.PI / 180

/** The garden's own evening light — the only landing so far, so also the
 *  default; a different trade overrides these to suit its own palette. */
const DEFAULT_SUN: [number, number, number] = normalize([-0.5, 0.74, -0.45])
const DEFAULT_SUN_COL: [number, number, number] = [1.45, 1.12, 0.78]
const DEFAULT_SKY: [number, number, number] = [0.36, 0.42, 0.55]
const DEFAULT_CLEAR_COLOR = 0x120c08
// Capped: a full-screen stack of shader layers, and past 1.5x the detail is
// already finer than the eye resolves at arm's length.
const DEFAULT_PIXEL_RATIO_CAP = 1.5
const DEFAULT_REBUILD_THRESHOLD = 0.04

/** Where the camera's view meets the ground plane (y = 0), in world units. */
export type Frame = {
  zFar: number
  zNear: number
  halfFar: number
  halfNear: number
  /** Half width of the visible ground at a given z. */
  halfAt(z: number): number
}

export type StageLight = {
  uSun: { value: THREE_NS.Vector3 }
  uSunCol: { value: THREE_NS.Vector3 }
  uSky: { value: THREE_NS.Vector3 }
}

/** Everything a landing's `build`/`update` need besides their own state. */
export type SceneCtx = {
  THREE: typeof import('three')
  scene: THREE_NS.Scene
  camera: THREE_NS.PerspectiveCamera
  frame: Frame
  light: StageLight
  clock: { time: number }
  reduced: boolean
  coarse: boolean
}

/** What a landing's world must offer back: its own group (added to, and
 *  removed from, the scene here) and a teardown for everything it built. */
export type SceneWorld = {
  group: THREE_NS.Group
  dispose(): void
}

export type SceneHostOptions<W extends SceneWorld> = {
  reduced: boolean
  coarse: boolean
  /** Camera vertical FOV, degrees. */
  vfov: number
  /** Camera tilt off vertical, degrees. */
  tilt: number
  /** Ground width visible at the look-at point, for a given aspect ratio. */
  groundWidth(aspect: number): number
  /** Sun direction, sun colour, and sky colour. Default to the garden's own
   *  evening light; a different trade will want its own. */
  sun?: [number, number, number]
  sunColor?: [number, number, number]
  sky?: [number, number, number]
  clearColor?: number
  /** Cap on devicePixelRatio. */
  pixelRatioCap?: number
  /** How far the aspect ratio or width may drift, as a fraction, before the
   *  world is rebuilt rather than just reframed. */
  rebuildThreshold?: number
  build(ctx: SceneCtx): W
  update(world: W, p: number, ctx: SceneCtx): void
  /** Merged into `debug.info()`, alongside the host's own `pixelRatio`/`progress`. */
  debugInfo?(world: W | null): Record<string, unknown>
}

export type SceneHandle = {
  /** Where the visitor is in the pinned section, 0…1. Eased toward, not jumped to. */
  setProgress(p: number): void
  resize(): void
  /** Stop the frame loop while the stage is off screen. */
  setVisible(v: boolean): void
  dispose(): void
  debug: {
    /** Snap to a progress with no easing and draw once. */
    jump(p: number, time?: number): void
    info(): Record<string, unknown>
  }
}

export async function createSceneHost<W extends SceneWorld>(
  canvas: HTMLCanvasElement,
  opts: SceneHostOptions<W>,
): Promise<SceneHandle> {
  const THREE = await import('three')

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.pixelRatioCap ?? DEFAULT_PIXEL_RATIO_CAP))
  renderer.setClearColor(opts.clearColor ?? DEFAULT_CLEAR_COLOR, 1)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(opts.vfov, 1, 0.1, 120)
  const light: StageLight = {
    uSun: { value: new THREE.Vector3(...(opts.sun ?? DEFAULT_SUN)) },
    uSunCol: { value: new THREE.Vector3(...(opts.sunColor ?? DEFAULT_SUN_COL)) },
    uSky: { value: new THREE.Vector3(...(opts.sky ?? DEFAULT_SKY)) },
  }
  const clock = { time: 0 }
  const tilt = opts.tilt * DEG
  const threshold = opts.rebuildThreshold ?? DEFAULT_REBUILD_THRESHOLD

  let currentFrame!: Frame
  const ctx: SceneCtx = {
    THREE,
    scene,
    camera,
    get frame() {
      return currentFrame
    },
    light,
    clock,
    reduced: opts.reduced,
    coarse: opts.coarse,
  }

  /* ---- Framing ------------------------------------------------------- *
   * The camera looks down at the ground plane (y = 0) from `tilt` off
   * vertical; where its four corners land on that plane is everything a
   * landing needs to size and place its own world. */
  function reframe(aspect: number): Frame {
    const targetW = opts.groundWidth(aspect)
    const d = targetW / (2 * Math.tan((opts.vfov * DEG) / 2) * aspect)
    camera.aspect = aspect
    camera.position.set(0, d * Math.cos(tilt), d * Math.sin(tilt))
    camera.up.set(0, 1, 0)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld(true)

    // Where the four corners of the view land on the ground.
    const hit = (nx: number, ny: number) => {
      const v = new THREE.Vector3(nx, ny, 0.5).unproject(camera).sub(camera.position).normalize()
      const t = -camera.position.y / v.y
      return camera.position.clone().addScaledVector(v, t)
    }
    const tl = hit(-1, 1)
    const bl = hit(-1, -1)
    return {
      zFar: tl.z,
      zNear: bl.z,
      halfFar: Math.abs(tl.x),
      halfNear: Math.abs(bl.x),
      halfAt(z: number) {
        const t = (z - tl.z) / (bl.z - tl.z)
        return Math.abs(tl.x) + (Math.abs(bl.x) - Math.abs(tl.x)) * t
      },
    }
  }

  /* ---- World (rebuilt when the shape of the screen changes) -------- */
  let world: W | null = null
  let aspectBuilt = 0
  let widthBuilt = 0

  function destroyWorld(w: W) {
    scene.remove(w.group)
    w.dispose()
  }

  function runUpdate(p: number) {
    if (!world) return
    opts.update(world, p, ctx)
  }

  /* ---- Size ------------------------------------------------------------ */
  function resize() {
    const host = canvas.parentElement ?? canvas
    const width = Math.max(1, host.clientWidth)
    const height = Math.max(1, host.clientHeight)
    renderer.setSize(width, height, false)
    const aspect = width / height
    currentFrame = reframe(aspect)
    // Rebuild only when the shape really changed. A phone's toolbar sliding
    // in and out changes the height by a few percent and must not replant
    // the whole world.
    if (!world || Math.abs(aspect / aspectBuilt - 1) > threshold || Math.abs(width / widthBuilt - 1) > threshold) {
      if (world) destroyWorld(world)
      world = opts.build(ctx)
      scene.add(world.group)
      aspectBuilt = aspect
      widthBuilt = width
    }
    runUpdate(shown)
    dirty = true
  }

  /* ---- Loop ------------------------------------------------------------ */
  let target = opts.reduced ? 1 : 0
  let shown = target
  let visible = true
  let dirty = true
  let raf = 0
  let last = performance.now()
  let idleFor = 0
  let skip = false

  const draw = () => {
    renderer.render(scene, camera)
    dirty = false
  }

  const tick = (now: number) => {
    raf = requestAnimationFrame(tick)
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    const gap = target - shown
    shown = Math.abs(gap) < 1e-4 ? target : shown + gap * (1 - Math.exp(-dt * 7))
    idleFor = Math.abs(gap) < 1e-4 ? idleFor + dt : 0
    // Whatever a landing's own scene keeps alive at rest (wind, say) keeps
    // running while nobody scrolls, at half the rate.
    if (idleFor > 1.5) {
      skip = !skip
      if (skip) return
    }
    clock.time += dt
    runUpdate(shown)
    draw()
  }

  const start = () => {
    if (raf || opts.reduced) return
    last = performance.now()
    raf = requestAnimationFrame(tick)
  }
  const stop = () => {
    cancelAnimationFrame(raf)
    raf = 0
  }

  const onVisibility = () => {
    if (document.hidden) stop()
    else if (visible) start()
  }
  document.addEventListener('visibilitychange', onVisibility)

  resize()
  runUpdate(shown)
  draw()
  start()

  return {
    setProgress(p) {
      target = opts.reduced ? 1 : Math.min(1, Math.max(0, p))
      if (opts.reduced && dirty) draw()
    },
    resize() {
      resize()
      if (!raf) draw()
    },
    setVisible(v) {
      visible = v
      if (v && !document.hidden) start()
      else stop()
    },
    dispose() {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
      if (world) destroyWorld(world)
      world = null
      renderer.dispose()
    },
    debug: {
      jump(p, time) {
        target = shown = p
        if (time !== undefined) clock.time = time
        runUpdate(p)
        draw()
      },
      info() {
        return {
          pixelRatio: renderer.getPixelRatio(),
          progress: shown,
          ...(opts.debugInfo?.(world) ?? {}),
        }
      },
    },
  }
}

/** Small local helper, same as every scene file on this stage keeps for
 *  itself rather than importing — this one only ever normalises a default
 *  sun direction. */
function normalize(v: [number, number, number]): [number, number, number] {
  const l = Math.hypot(v[0], v[1], v[2])
  return [v[0] / l, v[1] / l, v[2] / l]
}
