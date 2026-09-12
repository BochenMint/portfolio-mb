import { useCallback, useEffect, useRef, useState } from 'react'
import { pick } from '../i18n/pick'
import type { Face } from '../data/faces'
import type { Locale } from '../i18n/types'
import { supportsWebGL } from '../webgl'
import { BrandMark } from './BrandMark'
import './cube.css'

type Props = {
  projectId: string
  title: string
  faces: Face[]
  locale: Locale
  /** Load the front face eagerly (flagship, above-the-fold). */
  eagerFront?: boolean
}

type ThemeName = 'light' | 'dark'

const AUTO_ROTATE_MS = 4500
const DRAG_SENSITIVITY = 0.32
const PITCH_SENSITIVITY = 0.3
const FRICTION = 0.94
const MIN_VELOCITY = 0.02
const TWEEN_MS = 600
const TILT_MS = 320
const BASE_TILT_DEG = 0
const HOVER_TILT_RANGE = 6
// The canvas is rendered larger than the (square) stage box — see
// cube.css — so a rotated cube's wider silhouette (up to ~1.4x the
// front-on face width at 45deg) never clips against the render target.
// The camera distance below is tuned against this exact ratio so the
// front-on cube still reads at the same on-screen size the old 1:1
// canvas gave.
const CANVAS_W_RATIO = 1.5
const CANVAS_H_RATIO = 1.25

// ---------------------------------------------------------------------
// Orientation model
//
// All six faces are reachable. The cube's orientation is two angles held
// on the spin group: yaw about its own Y (picks one of the four lateral
// faces) and pitch about *world* X (±90° brings the top / bottom face to
// the camera). three.js's default Euler order 'XYZ' composes as
// Rx * Ry * v — yaw first in local space, pitch second in world space —
// which is exactly the trackball feel we want, so the group's rotation
// can be set directly with no quaternion bookkeeping.
// ---------------------------------------------------------------------

const FACE_COUNT = 6
/** Index → the face's outward normal in the cube's own space. */
const FACE_NORMALS: ReadonlyArray<readonly [number, number, number]> = [
  [0, 0, 1], // 0 front  (+Z)
  [1, 0, 0], // 1 right  (+X)
  [0, 0, -1], // 2 back   (-Z)
  [-1, 0, 0], // 3 left   (-X)
  [0, 1, 0], // 4 top    (+Y)
  [0, -1, 0], // 5 bottom (-Y)
]
const PITCH_LIMIT = 90
/** Rubber-band budget past ±90° while dragging; the clamp is asymptotic. */
const PITCH_OVERSHOOT = 14
/** Past this much pitch, releasing a drag settles on the top/bottom face. */
const PITCH_SNAP_THRESHOLD = 45

const DEG = Math.PI / 180

/**
 * How strongly a face points at the camera after the orientation is applied:
 * the world-space Z of its normal. The camera sits on +Z (12° above), so the
 * largest value wins. Kept as plain trigonometry rather than three.js maths so
 * the static fallback — which never builds a scene — derives the same active
 * index from the same numbers.
 */
function facingZ(normal: readonly [number, number, number], yawDeg: number, pitchDeg: number) {
  const yaw = yawDeg * DEG
  const pitch = pitchDeg * DEG
  const [nx, ny, nz] = normal
  // Ry(yaw) then Rx(pitch); only the resulting Z is needed.
  const z1 = -nx * Math.sin(yaw) + nz * Math.cos(yaw)
  return ny * Math.sin(pitch) + z1 * Math.cos(pitch)
}

function indexFromOrientation(yawDeg: number, pitchDeg: number) {
  let best = 0
  let bestZ = -Infinity
  for (let i = 0; i < FACE_COUNT; i += 1) {
    const z = facingZ(FACE_NORMALS[i], yawDeg, pitchDeg)
    if (z > bestZ) {
      bestZ = z
      best = i
    }
  }
  return best
}

/** The yaw/pitch pair that squares face `index` up to the camera, reached from
 *  the current orientation by the shortest route. */
function orientationForIndex(index: number, yawDeg: number) {
  if (index >= 4) {
    return { yaw: nearestSnap(yawDeg), pitch: index === 4 ? PITCH_LIMIT : -PITCH_LIMIT }
  }
  return { yaw: nearestRotForIndex(yawDeg, ((index % 4) + 4) % 4), pitch: 0 }
}

/** Asymptotic rubber band: pitch can be dragged past ±90° but never reaches
 *  ±(90 + PITCH_OVERSHOOT), so the cube can't be tumbled onto its back. */
function softClampPitch(pitch: number) {
  const over = Math.abs(pitch) - PITCH_LIMIT
  if (over <= 0) return pitch
  return Math.sign(pitch) * (PITCH_LIMIT + (PITCH_OVERSHOOT * over) / (over + PITCH_OVERSHOOT))
}

function nearestRotForIndex(currentRot: number, index: number) {
  const target = -index * 90
  const currentMod = ((currentRot % 360) + 360) % 360
  const targetMod = ((target % 360) + 360) % 360
  let delta = targetMod - currentMod
  if (delta > 180) delta -= 360
  if (delta < -180) delta += 360
  return currentRot + delta
}

function nearestSnap(rot: number) {
  return Math.round(rot / 90) * 90
}

/** The six faces a cube shows, padded by repetition if a project ships fewer. */
function takeCubeFaces(faces: Face[]): Face[] {
  if (faces.length === 0) return []
  if (faces.length >= FACE_COUNT) return faces.slice(0, FACE_COUNT)
  const out = faces.slice()
  while (out.length < FACE_COUNT) out.push(faces[out.length % faces.length])
  return out
}

function readTheme(): ThemeName {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}


// ---------------------------------------------------------------------
// Three.js scene: built lazily, entirely isolated from React state. The
// component only ever calls the handle's imperative methods.
// ---------------------------------------------------------------------

type FaceSlot = {
  material: import('three').MeshPhysicalMaterial
  texture: import('three').Texture | null
  face: Face
}

type SceneHandle = {
  setSize: (w: number, h: number) => void
  setOrientationDeg: (yaw: number, pitch: number) => void
  setTiltDeg: (tilt: number) => void
  setTheme: (theme: ThemeName) => void
  render: () => void
  dispose: () => void
}

// The screen is baked directly into each side face's texture set (rather
// than a separate plane) so it sits flush with — and bends along — the
// RoundedBoxGeometry's own curved edge band instead of floating in front
// of it. All six faces share the same UV layout, so the screen rect
// geometry below is computed once in normalized (canvas-pixel) texture
// space and reused for every face; only the emissive screenshot layer
// differs per face/theme.
const FACE_TEX_SIZE = 2048
const SCREEN_MARGIN_FRAC = 0.04 // -> 92% of the face width/height (was 0.1 -> 80%)
const SCREEN_CORNER_FRAC = 0.069 // keeps the same corner-radius:screen-size ratio as the old 0.06/80%
const SCREEN_RECT = {
  x: FACE_TEX_SIZE * SCREEN_MARGIN_FRAC,
  y: FACE_TEX_SIZE * SCREEN_MARGIN_FRAC,
  size: FACE_TEX_SIZE * (1 - 2 * SCREEN_MARGIN_FRAC),
  r: FACE_TEX_SIZE * SCREEN_CORNER_FRAC,
}
const SEAM_WIDTH = FACE_TEX_SIZE * 0.003

// --- Brand plate (the engraved sixth face) ---------------------------
/** Mark width as a fraction of the face. */
const BRAND_MARK_FRAC = 0.46
/** Bevel offset in texture pixels — roughly a 1 px lip at display size. */
const BRAND_BEVEL = FACE_TEX_SIZE * 0.002
/** Slightly off-white so the recess's lit lower lip has somewhere to go. */
const BRAND_PLATE = '#eef0f3'
const BRAND_LIP = '#ffffff'
const BRAND_WALL = '#7c808a'
const BRAND_FLOOR = '#a8acb5'

function traceRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

/**
 * The helmet mark as a Path2D, taken from the same SVG the DOM `<BrandMark>`
 * renders (a single even-odd path on a 64×64 viewBox) so the plate can never
 * drift from the logo. Fetched once per document and shared by every cube.
 */
let markPathPromise: Promise<Path2D | null> | null = null
function getMarkPath(): Promise<Path2D | null> {
  markPathPromise ??= fetch('/brand/logo-mb-white.svg')
    .then((res) => (res.ok ? res.text() : Promise.reject(new Error('mark svg'))))
    .then((svg) => {
      const d = svg.match(/\sd="([^"]+)"/)?.[1]
      return d ? new Path2D(d) : null
    })
    .catch(() => null)
  return markPathPromise
}

function fillMark(ctx: CanvasRenderingContext2D, path: Path2D, dx: number, dy: number, color: string) {
  const size = FACE_TEX_SIZE * BRAND_MARK_FRAC
  const offset = (FACE_TEX_SIZE - size) / 2
  ctx.save()
  ctx.translate(offset + dx, offset + dy)
  ctx.scale(size / 64, size / 64)
  ctx.fillStyle = color
  ctx.fill(path, 'evenodd')
  ctx.restore()
}

/** object-fit: cover, top-aligned, clipped to the screen rect. */
/** The page's own background, read from the capture's top-left corner, so
 *  the letterbox around a non-square screenshot reads as part of the page
 *  rather than as black bars. */
function samplePageBackground(img: HTMLImageElement): string {
  const probe = document.createElement('canvas')
  probe.width = probe.height = 1
  const pctx = probe.getContext('2d', { willReadFrequently: true })
  if (!pctx) return '#ffffff'
  try {
    pctx.drawImage(img, 2, 2, 8, 8, 0, 0, 1, 1)
    const [r, g, b] = pctx.getImageData(0, 0, 1, 1).data
    return `rgb(${r}, ${g}, ${b})`
  } catch {
    return '#ffffff'
  }
}

/** Fits the whole capture inside the square screen. Cover used to be the
 *  fit here, which sliced ~9% off each side of any screenshot that was not
 *  exactly square — the page's own navigation was the first thing to go. */
function drawContainImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
  const iw = img.naturalWidth || img.width
  const ih = img.naturalHeight || img.height
  if (!iw || !ih) return
  const { x, y, size } = SCREEN_RECT
  ctx.fillStyle = samplePageBackground(img)
  ctx.fillRect(x, y, size, size)
  const scale = Math.min(size / iw, size / ih)
  const dw = iw * scale
  const dh = ih * scale
  ctx.drawImage(img, x + (size - dw) / 2, y + (size - dh) / 2, dw, dh)
}

/** Base-color map: white outside the screen (tinted by material.color to
 * the theme's chrome hue), black inside, with a thin dark seam ring
 * right at the screen's edge so it reads as an inset bezel. */
function buildFaceColorMap(THREE: typeof import('three')) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = FACE_TEX_SIZE
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, FACE_TEX_SIZE, FACE_TEX_SIZE)
    const { x, y, size, r } = SCREEN_RECT
    traceRoundedRect(ctx, x, y, size, size, r)
    ctx.lineWidth = SEAM_WIDTH
    ctx.strokeStyle = '#15161a'
    ctx.stroke()
    ctx.fillStyle = '#000000'
    ctx.fill()
  }
  return new THREE.CanvasTexture(canvas)
}

/** Packs metalnessMap (blue) + roughnessMap (green): fully metallic,
 * tight chrome roughness outside the screen; non-metal, softer glass
 * roughness inside it. Three.js reads metalness from B and roughness
 * from G, so material.metalness/roughness stay at 1 as pure multipliers. */
function buildFaceMaskMap(THREE: typeof import('three')) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = FACE_TEX_SIZE
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = `rgb(0, ${Math.round(0.12 * 255)}, 255)`
    ctx.fillRect(0, 0, FACE_TEX_SIZE, FACE_TEX_SIZE)
    const { x, y, size, r } = SCREEN_RECT
    traceRoundedRect(ctx, x, y, size, size, r)
    ctx.fillStyle = `rgb(0, ${Math.round(0.22 * 255)}, 0)`
    ctx.fill()
  }
  const tex = new THREE.CanvasTexture(canvas)
  return tex
}

/**
 * Brand plate base color: unbroken chrome with the mark engraved into it.
 * The recess is faked with three stacked copies of the same path — a lit lip
 * offset down-right, a shaded wall offset up-left (the key light sits above
 * and to the left), and a slightly darker floor in the middle.
 */
function buildBrandColorMap(THREE: typeof import('three'), path: Path2D | null) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = FACE_TEX_SIZE
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = BRAND_PLATE
    ctx.fillRect(0, 0, FACE_TEX_SIZE, FACE_TEX_SIZE)
    if (path) {
      fillMark(ctx, path, BRAND_BEVEL, BRAND_BEVEL, BRAND_LIP)
      fillMark(ctx, path, -BRAND_BEVEL, -BRAND_BEVEL, BRAND_WALL)
      fillMark(ctx, path, 0, 0, BRAND_FLOOR)
    }
  }
  return new THREE.CanvasTexture(canvas)
}

/** Same packing as buildFaceMaskMap: metal everywhere, with the engraved
 *  floor left a touch rougher so it reads satin against the polished plate. */
function buildBrandMaskMap(THREE: typeof import('three'), path: Path2D | null) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = FACE_TEX_SIZE
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = `rgb(0, ${Math.round(0.12 * 255)}, 255)`
    ctx.fillRect(0, 0, FACE_TEX_SIZE, FACE_TEX_SIZE)
    if (path) fillMark(ctx, path, 0, 0, `rgb(0, ${Math.round(0.26 * 255)}, 255)`)
  }
  return new THREE.CanvasTexture(canvas)
}

function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`image load failed: ${url}`))
    img.src = url
  })
}

function makeContactShadowTexture(THREE: typeof import('three')) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, 'rgba(0,0,0,0.9)')
    gradient.addColorStop(0.55, 'rgba(0,0,0,0.45)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  }
  const tex = new THREE.CanvasTexture(canvas)
  return tex
}

async function buildScene(
  canvas: HTMLCanvasElement,
  opts: {
    faces: Face[]
    projectId: string
    theme: ThemeName
    width: number
    height: number
  },
): Promise<SceneHandle> {
  const THREE = await import('three')
  const [{ RoundedBoxGeometry }, { RoomEnvironment }, { RectAreaLightUniformsLib }] = await Promise.all([
    import('three/examples/jsm/geometries/RoundedBoxGeometry.js'),
    import('three/examples/jsm/environments/RoomEnvironment.js'),
    import('three/examples/jsm/lights/RectAreaLightUniformsLib.js'),
  ])
  RectAreaLightUniformsLib.init()

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    premultipliedAlpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NoToneMapping
  renderer.setSize(Math.max(1, opts.width), Math.max(1, opts.height), false)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(28, Math.max(opts.width, 1) / Math.max(opts.height, 1), 0.1, 20)
  const camTiltRad = THREE.MathUtils.degToRad(12)
  // The canvas is CANVAS_W_RATIO x CANVAS_H_RATIO larger than the square
  // stage box (see cube.css), so the front-on cube must fill a smaller
  // *fraction* of the canvas than before to keep its on-screen size (as
  // a fraction of the stage, ~92%) unchanged while leaving room for the
  // rotated silhouette to not clip. Distance solved from the pinhole
  // relation `fillFraction = cubeSize / (2*d*aspect*tan(vFov/2))` for
  // fillFraction = 0.92 / CANVAS_W_RATIO at the canvas's fixed aspect.
  const camDist = 2.72
  camera.position.set(0, Math.sin(camTiltRad) * camDist, Math.cos(camTiltRad) * camDist)
  camera.lookAt(0, 0.02, 0)

  const pmrem = new THREE.PMREMGenerator(renderer)
  pmrem.compileEquirectangularShader()
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.035)
  scene.environment = envRT.texture
  pmrem.dispose()

  const tiltGroup = new THREE.Group()
  scene.add(tiltGroup)
  const spinGroup = new THREE.Group()
  tiltGroup.add(spinGroup)

  const bodyGeo = new RoundedBoxGeometry(1, 1, 1, 7, 0.17)
  const body = new THREE.Mesh(bodyGeo)
  spinGroup.add(body)

  // Studio lighting: two crisp key/fill bands plus a soft rim, fixed in
  // world space so highlights sweep across the chrome as the cube turns.
  // Deliberately left world-fixed now that the cube also pitches: the top
  // and bottom plates swing into the same key/fill/rim rig the lateral
  // faces meet, so the engraved mark is raked by the key light exactly the
  // way a screen face is.
  const keyLight = new THREE.RectAreaLight(0xffffff, 9, 2.4, 0.3)
  keyLight.position.set(-1.6, 1.9, 2.1)
  keyLight.lookAt(0, 0, 0)
  const fillLight = new THREE.RectAreaLight(0xdfe6ef, 4, 1.8, 2.6)
  fillLight.position.set(2.1, 0.1, -1.1)
  fillLight.lookAt(0, 0, 0)
  const rimLight = new THREE.RectAreaLight(0xc8d0dc, 3, 1.6, 1.6)
  rimLight.position.set(0.2, -1.9, -1.7)
  rimLight.lookAt(0, 0, 0)
  const ambient = new THREE.AmbientLight(0xffffff, 0.16)
  scene.add(keyLight, fillLight, rimLight, ambient)

  // Contact shadow beneath the cube.
  const shadowTex = makeContactShadowTexture(THREE)
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    depthWrite: false,
    opacity: 0.55,
  })
  const SHADOW_GEO_SIZE = 1.7
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(SHADOW_GEO_SIZE, SHADOW_GEO_SIZE), shadowMat)
  shadowPlane.rotation.x = -Math.PI / 2
  shadowPlane.position.y = -0.56
  tiltGroup.add(shadowPlane)
  // Theme-driven scale multiplier (see applyTheme), clamped against the
  // frustum below so it can never exceed shadowMaxScale.
  let shadowThemeScale = 1

  // Backdrop halo: a soft dark radial fade behind the cube. On a light
  // page a uniformly bright environment leaves the chrome silhouette
  // blending into the background — this darkens the horizon right behind
  // the object so its edges read clearly. Invisible in dark theme.
  const haloTex = makeContactShadowTexture(THREE)
  const haloMat = new THREE.MeshBasicMaterial({
    map: haloTex,
    transparent: true,
    depthWrite: false,
    opacity: 0,
  })
  const HALO_GEO_SIZE = 2.6
  const haloPlane = new THREE.Mesh(new THREE.PlaneGeometry(HALO_GEO_SIZE, HALO_GEO_SIZE), haloMat)
  haloPlane.position.z = -0.85
  tiltGroup.add(haloPlane)

  /**
   * A fixed 2.6-unit halo was wider than the camera frustum at its depth, so
   * only the dense middle of the radial gradient was ever on screen and it
   * read as a hard-edged grey rectangle the size of the canvas instead of a
   * soft glow. Size it against the actual frustum so the fade always
   * finishes inside the frame.
   */
  function fitHalo() {
    const dist = camDist + Math.abs(haloPlane.position.z)
    const visibleH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * dist
    const visibleW = visibleH * camera.aspect
    const target = Math.min(visibleW, visibleH) * 0.9
    haloPlane.scale.setScalar(target / HALO_GEO_SIZE)
  }

  /**
   * Root cause of the "light rectangle behind the cube" bug: the ground
   * contact-shadow plane (1.7 units, 2.04 in light theme's 1.2x scale) is
   * wider than the camera frustum at its depth (~1.63 units at the tuned
   * camDist/fov) — the exact same failure mode fitHalo() above exists to
   * fix, just never applied to this plane. Its radial gradient only reaches
   * zero alpha at the plane's own edge, so once that edge sits outside the
   * frustum the visible portion never fades out — it gets hard-clipped by
   * the canvas bounds instead, reading as a flat grey rectangle the size of
   * the canvas (worst in light theme, where the page is light enough for
   * the leftover grey to read clearly, and where the 1.2x scale pushes the
   * plane furthest past the frustum edge).
   *
   * Fix: cap the shadow's world-space size to a safe fraction of the
   * visible frustum at its depth, same as the halo, so the gradient always
   * finishes fading before it reaches the canvas edge.
   */
  let shadowMaxScale = 1
  function fitShadow() {
    const dist = camDist + Math.abs(shadowPlane.position.y)
    const visibleH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * dist
    const visibleW = visibleH * camera.aspect
    shadowMaxScale = (Math.min(visibleW, visibleH) * 0.9) / SHADOW_GEO_SIZE
    shadowPlane.scale.setScalar(Math.min(shadowThemeScale, shadowMaxScale))
  }

  // Screens are baked into the RoundedBoxGeometry's own per-face material
  // slots (BoxGeometry — which this extends — always keeps 6 groups, in
  // [+X right, -X left, +Y top, -Y bottom, +Z front, -Z back] order, each
  // spanning the *entire* rounded face, curved edge bands included, in
  // [0,1] UV) rather than a separate plane sitting in front of the face.
  // That's what makes the screen bend into the curved edge band exactly
  // like the chrome around it, with no floating edges or corner gaps.
  //
  // BoxGeometry's UV winding puts image-up along -Z on the +Y face and
  // along +Z on the -Y face, which is precisely the direction that ends up
  // pointing at the top of the screen once the cube is pitched ±90° — so
  // the top and bottom faces read upright with no per-face texture
  // rotation.
  const maxAniso = renderer.capabilities.getMaxAnisotropy()
  const sharedColorMap = buildFaceColorMap(THREE)
  sharedColorMap.colorSpace = THREE.SRGBColorSpace
  sharedColorMap.anisotropy = maxAniso
  const sharedMaskMap = buildFaceMaskMap(THREE)
  sharedMaskMap.anisotropy = maxAniso

  function makeScreenMaterial() {
    return new THREE.MeshPhysicalMaterial({
      map: sharedColorMap,
      metalnessMap: sharedMaskMap,
      roughnessMap: sharedMaskMap,
      metalness: 1,
      roughness: 1,
      emissive: 0xffffff,
      emissiveIntensity: 1,
      // Kept modest (rather than the 1.0 a pure chrome face would want)
      // so the clearcoat/env reflection stays a subtle glass sheen and
      // never washes out the emissive screenshot underneath it.
      clearcoat: 0.5,
      clearcoatRoughness: 0.06,
      envMapIntensity: 0.9,
    })
  }

  // No emissive at all: the brand plate is lit chrome, not a screen. Its
  // maps arrive asynchronously (the mark path is fetched once per page), so
  // until then it is simply a blank polished face — never a white glow.
  function makeBrandMaterial() {
    return new THREE.MeshPhysicalMaterial({
      metalness: 1,
      roughness: 1,
      clearcoat: 0.6,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1,
    })
  }

  const cubeFaces = takeCubeFaces(opts.faces)
  const faceSlots: FaceSlot[] = cubeFaces.map((face) => ({
    material: face.kind === 'brand' ? makeBrandMaterial() : makeScreenMaterial(),
    texture: null,
    face,
  }))

  // BoxGeometry group order: 0 +X(right), 1 -X(left), 2 +Y(top),
  // 3 -Y(bottom), 4 +Z(front), 5 -Z(back) — mapped onto the component's
  // face indices 0 front, 1 right, 2 back, 3 left, 4 top, 5 bottom.
  body.material = [
    faceSlots[1].material,
    faceSlots[3].material,
    faceSlots[4].material,
    faceSlots[5].material,
    faceSlots[0].material,
    faceSlots[2].material,
  ]

  let disposed = false
  const brandMaps: import('three').Texture[] = []

  const brandSlots = faceSlots.filter((slot) => slot.face.kind === 'brand')
  if (brandSlots.length > 0) {
    void getMarkPath().then((path) => {
      if (disposed) return
      const colorMap = buildBrandColorMap(THREE, path)
      colorMap.colorSpace = THREE.SRGBColorSpace
      colorMap.anisotropy = maxAniso
      const maskMap = buildBrandMaskMap(THREE, path)
      maskMap.anisotropy = maxAniso
      brandMaps.push(colorMap, maskMap)
      brandSlots.forEach((slot) => {
        slot.material.map = colorMap
        slot.material.metalnessMap = maskMap
        slot.material.roughnessMap = maskMap
        slot.material.needsUpdate = true
      })
      renderer.render(scene, camera)
    })
  }

  async function applyFaceTextures(theme: ThemeName) {
    await Promise.all(
      faceSlots.map(async (slot) => {
        if (!slot.face || slot.face.kind === 'brand') return
        const src = theme === 'light' && slot.face.light ? slot.face.light : slot.face.file
        if (!src) return
        const url = `/projects/${opts.projectId}/${src}`
        try {
          const img = await loadImageElement(url)
          const canvas = document.createElement('canvas')
          canvas.width = FACE_TEX_SIZE
          canvas.height = FACE_TEX_SIZE
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.fillStyle = '#000000'
            ctx.fillRect(0, 0, FACE_TEX_SIZE, FACE_TEX_SIZE)
            ctx.save()
            traceRoundedRect(ctx, SCREEN_RECT.x, SCREEN_RECT.y, SCREEN_RECT.size, SCREEN_RECT.size, SCREEN_RECT.r)
            ctx.clip()
            drawContainImage(ctx, img)
            ctx.restore()
          }
          const tex = new THREE.CanvasTexture(canvas)
          tex.colorSpace = THREE.SRGBColorSpace
          tex.anisotropy = maxAniso
          tex.minFilter = THREE.LinearMipmapLinearFilter
          tex.magFilter = THREE.LinearFilter
          tex.generateMipmaps = true
          tex.wrapS = THREE.ClampToEdgeWrapping
          tex.wrapT = THREE.ClampToEdgeWrapping
          tex.needsUpdate = true
          if (slot.texture) slot.texture.dispose()
          slot.texture = tex
          slot.material.emissiveMap = tex
          slot.material.needsUpdate = true
          renderer.render(scene, camera)
        } catch {
          // Keep the black placeholder emissive (no screen content yet)
          // if a texture fails to load.
        }
      }),
    )
  }

  function applyTheme(theme: ThemeName) {
    const isLight = theme === 'light'
    // Slightly darker reflections in light theme (rather than brighter)
    // keep the chrome from washing into a pale page background.
    const chromeColor = isLight ? 0xe6e8ec : 0xe3e5ea
    faceSlots.forEach((slot) => {
      slot.material.color.set(chromeColor)
    })
    keyLight.intensity = isLight ? 11 : 9
    fillLight.intensity = isLight ? 5 : 4
    rimLight.intensity = isLight ? 3.4 : 3
    ambient.intensity = isLight ? 0.22 : 0.16
    shadowMat.opacity = isLight ? 0.7 : 0.55
    shadowThemeScale = isLight ? 1.2 : 1
    fitShadow()
    // Halo disabled (Marcin 2026-09): on the light theme it rendered as a
    // hard-edged grey square behind the cube. The contact shadow is enough.
    haloMat.opacity = 0
    void applyFaceTextures(theme)
  }

  applyTheme(opts.theme)
  fitHalo()
  fitShadow()

  function setSize(w: number, h: number) {
    if (w <= 0 || h <= 0) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    fitHalo()
    fitShadow()
  }

  /** Yaw about the cube's own Y, then pitch about world X — see the
   *  "Orientation model" note at the top of the file. */
  function setOrientationDeg(yaw: number, pitch: number) {
    spinGroup.rotation.set(THREE.MathUtils.degToRad(pitch), THREE.MathUtils.degToRad(yaw), 0)
  }

  function setTiltDeg(tilt: number) {
    tiltGroup.rotation.x = THREE.MathUtils.degToRad(tilt)
  }

  function render() {
    renderer.render(scene, camera)
  }

  function dispose() {
    disposed = true
    bodyGeo.dispose()
    sharedColorMap.dispose()
    sharedMaskMap.dispose()
    brandMaps.forEach((map) => map.dispose())
    faceSlots.forEach((slot) => {
      slot.material.dispose()
      slot.texture?.dispose()
    })
    shadowMat.dispose()
    shadowTex.dispose()
    haloMat.dispose()
    haloTex.dispose()
    envRT.texture.dispose()
    renderer.dispose()
  }

  return { setSize, setOrientationDeg, setTiltDeg, setTheme: applyTheme, render, dispose }
}

export function ProjectCube({ projectId, title, faces, locale, eagerFront }: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const rotRef = useRef(0)
  const pitchRef = useRef(0)
  const tiltRef = useRef(BASE_TILT_DEG)
  const velocityRef = useRef(0)
  const draggingRef = useRef(false)
  const pointerLastXRef = useRef(0)
  const pointerLastYRef = useRef(0)
  const pointerLastTRef = useRef(0)
  const momentumRafRef = useRef<number | null>(null)
  const tweenRafRef = useRef<number | null>(null)
  const tiltRafRef = useRef<number | null>(null)
  const hoveredRef = useRef(false)
  const focusedRef = useRef(false)
  const inViewRef = useRef(false)
  const reducedMotionRef = useRef(false)
  const autoTimerRef = useRef<number | null>(null)
  const activeIndexRef = useRef(0)

  const sceneRef = useRef<SceneHandle | null>(null)
  const buildingRef = useRef(false)
  const themeRef = useRef<ThemeName>(readTheme())

  const [activeIndex, setActiveIndex] = useState(0)
  const [theme, setThemeState] = useState<ThemeName>(() => readTheme())
  const [threeReady, setThreeReady] = useState(false)
  const [fallbackOnly, setFallbackOnly] = useState(false)

  const cubeFaces = takeCubeFaces(faces)

  const requestRender = useCallback(() => {
    sceneRef.current?.render()
  }, [])

  const setOrientation = useCallback(
    (yaw: number, pitch: number) => {
      rotRef.current = yaw
      pitchRef.current = pitch
      sceneRef.current?.setOrientationDeg(yaw, pitch)
      requestRender()
      const idx = indexFromOrientation(yaw, pitch)
      activeIndexRef.current = idx
      setActiveIndex((prev) => (prev === idx ? prev : idx))
    },
    [requestRender],
  )

  const stopMomentum = useCallback(() => {
    if (momentumRafRef.current !== null) {
      cancelAnimationFrame(momentumRafRef.current)
      momentumRafRef.current = null
    }
  }, [])

  const stopTween = useCallback(() => {
    if (tweenRafRef.current !== null) {
      cancelAnimationFrame(tweenRafRef.current)
      tweenRafRef.current = null
    }
  }, [])

  /** Eases yaw and pitch together, so a move that changes both (say, the top
   *  face from a lateral one) arrives as a single gesture. */
  const tweenTo = useCallback(
    (targetYaw: number, targetPitch: number, animate: boolean) => {
      stopTween()
      if (!animate || reducedMotionRef.current || !sceneRef.current) {
        setOrientation(targetYaw, targetPitch)
        return
      }
      const fromYaw = rotRef.current
      const fromPitch = pitchRef.current
      const dYaw = targetYaw - fromYaw
      const dPitch = targetPitch - fromPitch
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / TWEEN_MS)
        const e = easeOutCubic(t)
        setOrientation(fromYaw + dYaw * e, fromPitch + dPitch * e)
        if (t < 1) {
          tweenRafRef.current = requestAnimationFrame(tick)
        } else {
          tweenRafRef.current = null
        }
      }
      tweenRafRef.current = requestAnimationFrame(tick)
    },
    [setOrientation, stopTween],
  )

  const goToIndex = useCallback(
    (index: number) => {
      stopMomentum()
      const i = ((index % FACE_COUNT) + FACE_COUNT) % FACE_COUNT
      const target = orientationForIndex(i, rotRef.current)
      tweenTo(target.yaw, target.pitch, true)
    },
    [stopMomentum, tweenTo],
  )

  /** ←/→: a quarter turn of yaw. From the top or bottom plate it first drops
   *  back to the lateral ring rather than skipping a face. */
  const stepYaw = useCallback(
    (dir: 1 | -1) => {
      stopMomentum()
      if (Math.abs(pitchRef.current) > 1) {
        tweenTo(nearestSnap(rotRef.current), 0, true)
        return
      }
      tweenTo(rotRef.current - dir * 90, 0, true)
    },
    [stopMomentum, tweenTo],
  )

  /** ↑/↓: one step along bottom → lateral → top. */
  const stepPitch = useCallback(
    (dir: 1 | -1) => {
      stopMomentum()
      const current = Math.round(pitchRef.current / 90) * 90
      const next = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, current + dir * 90))
      tweenTo(nearestSnap(rotRef.current), next, true)
    },
    [stopMomentum, tweenTo],
  )

  /** Spins down the flick's yaw momentum while easing pitch onto its target,
   *  then snaps to the nearest face. One driver for both axes so they can
   *  never fight over the orientation. */
  const runSettle = useCallback(
    (targetPitch: number) => {
      const tick = () => {
        velocityRef.current *= FRICTION
        const pitch = pitchRef.current + (targetPitch - pitchRef.current) * 0.18
        if (Math.abs(velocityRef.current) < MIN_VELOCITY) {
          momentumRafRef.current = null
          tweenTo(nearestSnap(rotRef.current), targetPitch, true)
          return
        }
        setOrientation(rotRef.current + velocityRef.current, pitch)
        momentumRafRef.current = requestAnimationFrame(tick)
      }
      momentumRafRef.current = requestAnimationFrame(tick)
    },
    [setOrientation, tweenTo],
  )

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!sceneRef.current) return
      const overlay = overlayRef.current
      if (!overlay) return
      stopMomentum()
      stopTween()
      draggingRef.current = true
      pointerLastXRef.current = e.clientX
      pointerLastYRef.current = e.clientY
      pointerLastTRef.current = performance.now()
      velocityRef.current = 0
      overlay.setPointerCapture(e.pointerId)
    },
    [stopMomentum, stopTween],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return
      const now = performance.now()
      const dx = e.clientX - pointerLastXRef.current
      const dy = e.clientY - pointerLastYRef.current
      const dt = Math.max(1, now - pointerLastTRef.current)
      // Dragging left brings the right face forward (as if turning the cube
      // by its near-right edge); dragging up brings the bottom face forward.
      const yawDelta = dx * DRAG_SENSITIVITY
      const pitchDelta = dy * PITCH_SENSITIVITY
      velocityRef.current = (yawDelta / dt) * 16
      pointerLastXRef.current = e.clientX
      pointerLastYRef.current = e.clientY
      pointerLastTRef.current = now
      setOrientation(rotRef.current + yawDelta, softClampPitch(pitchRef.current + pitchDelta))
    },
    [setOrientation],
  )

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return
      draggingRef.current = false
      const overlay = overlayRef.current
      if (overlay) {
        try {
          overlay.releasePointerCapture(e.pointerId)
        } catch {
          // capture may already be released
        }
      }
      const pitch = pitchRef.current
      const targetPitch =
        Math.abs(pitch) > PITCH_SNAP_THRESHOLD ? Math.sign(pitch) * PITCH_LIMIT : 0
      // A flick that ends on the top/bottom plate settles straight onto it —
      // carrying yaw momentum there would spin a face the drag never chose.
      if (targetPitch !== 0 || reducedMotionRef.current || Math.abs(velocityRef.current) < MIN_VELOCITY) {
        tweenTo(nearestSnap(rotRef.current), targetPitch, true)
      } else {
        runSettle(0)
      }
    },
    [runSettle, tweenTo],
  )

  // --- Hover tilt (fine pointer only) ------------------------------
  const setTilt = useCallback(
    (target: number, animate: boolean) => {
      if (tiltRafRef.current !== null) {
        cancelAnimationFrame(tiltRafRef.current)
        tiltRafRef.current = null
      }
      if (!animate || reducedMotionRef.current) {
        tiltRef.current = target
        sceneRef.current?.setTiltDeg(target)
        requestRender()
        return
      }
      const from = tiltRef.current
      const distance = target - from
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / TILT_MS)
        const value = from + distance * easeOutCubic(t)
        tiltRef.current = value
        sceneRef.current?.setTiltDeg(value)
        requestRender()
        if (t < 1) {
          tiltRafRef.current = requestAnimationFrame(tick)
        } else {
          tiltRafRef.current = null
        }
      }
      tiltRafRef.current = requestAnimationFrame(tick)
    },
    [requestRender],
  )

  const onStagePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (draggingRef.current) return
      const stage = stageRef.current
      if (!stage || !sceneRef.current) return
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
      const r = stage.getBoundingClientRect()
      const py = (e.clientY - r.top) / r.height
      const tilt = BASE_TILT_DEG + (0.5 - py) * HOVER_TILT_RANGE * 2
      setTilt(tilt, false)
    },
    [setTilt],
  )

  const resetTilt = useCallback(() => {
    setTilt(BASE_TILT_DEG, true)
  }, [setTilt])

  // --- Keyboard ------------------------------------------------------
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        stepYaw(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        stepYaw(-1)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        stepPitch(1)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        stepPitch(-1)
      }
    },
    [stepPitch, stepYaw],
  )

  // --- Init: reduced motion + theme observer --------------------------
  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mo = new MutationObserver(() => {
      const next = readTheme()
      themeRef.current = next
      setThemeState(next)
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [])

  // --- Determine once whether WebGL / motion allow the 3D scene at all -
  useEffect(() => {
    if (reducedMotionRef.current || !supportsWebGL()) {
      setFallbackOnly(true)
    }
  }, [])

  // --- Track in-view state for autorotate + dispose the scene when the
  //     cube has scrolled more than one screen away, rebuilding on return.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const activeObserver = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting
      },
      { threshold: 0.35 },
    )
    activeObserver.observe(stage)

    let farObserver: IntersectionObserver | null = null
    const setupFarObserver = () => {
      farObserver?.disconnect()
      const margin = Math.round(window.innerHeight || 800)
      farObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) return
          // Fully out of the expanded bounds: more than one screen away.
          if (sceneRef.current) {
            sceneRef.current.dispose()
            sceneRef.current = null
            setThreeReady(false)
          }
        },
        { rootMargin: `${margin}px 0px ${margin}px 0px` },
      )
      farObserver.observe(stage)
    }
    setupFarObserver()
    const onResize = () => setupFarObserver()
    window.addEventListener('resize', onResize)

    return () => {
      activeObserver.disconnect()
      farObserver?.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // --- Lazy-build the three.js scene once the cube nears the viewport,
  //     and rebuild it if it was disposed while still on/near screen.
  useEffect(() => {
    if (threeReady || fallbackOnly) return
    const stage = stageRef.current
    if (!stage) return
    if (reducedMotionRef.current || !supportsWebGL()) return
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting || buildingRef.current || sceneRef.current) return
        buildingRef.current = true
        const canvas = canvasRef.current
        if (!canvas) {
          buildingRef.current = false
          return
        }
        const rect = stage.getBoundingClientRect()
        buildScene(canvas, {
          faces,
          projectId,
          theme: themeRef.current,
          width: rect.width * CANVAS_W_RATIO,
          height: rect.height * CANVAS_H_RATIO,
        })
          .then((handle) => {
            sceneRef.current = handle
            handle.setTiltDeg(tiltRef.current)
            handle.setOrientationDeg(rotRef.current, pitchRef.current)
            handle.render()
            setThreeReady(true)
          })
          .catch(() => setFallbackOnly(true))
          .finally(() => {
            buildingRef.current = false
          })
      },
      { rootMargin: '200px' },
    )
    io.observe(stage)
    return () => io.disconnect()
  }, [threeReady, fallbackOnly, faces, projectId])

  // --- Resize the renderer/camera when the stage box changes ----------
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      sceneRef.current?.setSize(width * CANVAS_W_RATIO, height * CANVAS_H_RATIO)
      requestRender()
    })
    ro.observe(stage)
    return () => ro.disconnect()
  }, [requestRender])

  // --- Push theme changes into the live scene --------------------------
  useEffect(() => {
    themeRef.current = theme
    sceneRef.current?.setTheme(theme)
    requestRender()
  }, [theme, requestRender])

  // --- Dispose on unmount ----------------------------------------------
  useEffect(() => {
    return () => {
      stopMomentum()
      stopTween()
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
  }, [stopMomentum, stopTween])

  // --- Auto-rotate -------------------------------------------------------
  // Walks the full six-face cycle (lateral ring, then the brand plate on top,
  // then the bottom face) rather than only the yaw ring, so every face gets
  // shown to a visitor who never touches the cube.
  useEffect(() => {
    const tick = () => {
      autoTimerRef.current = window.setTimeout(() => {
        if (
          inViewRef.current &&
          !hoveredRef.current &&
          !focusedRef.current &&
          !draggingRef.current &&
          !reducedMotionRef.current &&
          momentumRafRef.current === null &&
          sceneRef.current
        ) {
          goToIndex(activeIndexRef.current + 1)
        }
        tick()
      }, AUTO_ROTATE_MS)
    }
    tick()
    return () => {
      if (autoTimerRef.current !== null) window.clearTimeout(autoTimerRef.current)
    }
  }, [goToIndex])

  const onMouseEnter = () => {
    hoveredRef.current = true
  }
  const onMouseLeave = () => {
    hoveredRef.current = false
    resetTilt()
  }
  const onFocus = () => {
    focusedRef.current = true
  }
  const onBlur = () => {
    focusedRef.current = false
  }

  if (cubeFaces.length === 0) return null

  const activeFace = cubeFaces[activeIndex]
  const showFallback = fallbackOnly || !threeReady
  const fallbackFace = activeFace
  const fallbackSrc = theme === 'light' && fallbackFace.light ? fallbackFace.light : fallbackFace.file
  const fallbackBase = `/projects/${projectId}/${fallbackSrc}`

  const onFallbackKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      goToIndex(activeIndexRef.current + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goToIndex(activeIndexRef.current - 1)
    }
  }

  return (
    <div className="flex flex-col items-center cube-wrapper">
      <div
        ref={stageRef}
        className="cube-stage"
        role="group"
        aria-roledescription="3D cube"
        aria-label={title}
        onPointerMove={onStagePointerMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <canvas ref={canvasRef} className="cube-canvas" hidden={showFallback} aria-hidden="true" />
        {!showFallback && (
          <div
            ref={overlayRef}
            className="cube-overlay"
            role="img"
            aria-label={`${title} — ${pick(activeFace.label, locale)}`}
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        )}
        {showFallback && (
          <div
            className="cube-fallback"
            role="img"
            aria-label={`${title} — ${pick(fallbackFace.label, locale)}`}
            tabIndex={0}
            onKeyDown={onFallbackKeyDown}
          >
            {fallbackFace.kind === 'brand' ? (
              // No screenshot behind this face — the same mark the plate is
              // engraved with, sitting on the fallback's chrome gradient.
              <div className="cube-fallback__brand">
                <BrandMark size={64} />
              </div>
            ) : (
              <img
                key={fallbackFace.id}
                src={fallbackBase}
                sizes="(min-width: 1024px) 520px, 80vw"
                alt={pick(fallbackFace.label, locale)}
                loading={eagerFront ? 'eager' : 'lazy'}
                decoding="async"
              />
            )}
          </div>
        )}
      </div>

      {/* A group, not a tablist: these turn the cube to a face, and there are
          no tab panels behind them — a `tablist` whose children are not `tab`s
          is a broken widget to a screen reader, which is what it was. */}
      <div className="cube-dots" role="group" aria-label={title}>
        {cubeFaces.map((face, i) => (
          <button
            // Index-suffixed: a project shipping fewer than six faces has the
            // set padded by repetition, so ids alone are not unique here.
            key={`${face.id}-${i}`}
            type="button"
            className="cube-dot"
            aria-label={pick(face.label, locale)}
            aria-current={activeIndex === i}
            onClick={() => goToIndex(i)}
          />
        ))}
      </div>

      <div className="cube-caption" key={activeIndex}>
        <p className="cube-caption__label">{pick(activeFace.label, locale)}</p>
        <p className="cube-caption__text">{pick(activeFace.caption, locale)}</p>
      </div>
    </div>
  )
}
