import type { HeroScene, HeroSceneOptions } from '../webgl/hero/heroSceneTypes'
import { getDpr, HERO_ROTATION_DAMP } from '../webgl/hero/heroSceneTypes'

/**
 * Agentic OS — live particle swarm ("north-studio"-style generative canvas).
 *
 * Reuses the exact look of the offline reference render
 * (scripts/swarm/scene.html): a curl-noise displaced twin-lobe torus-knot
 * spine, amber palette on ink, additive fine points. The static art used
 * curlAmp 0.55 / coreBias 1.9 / tubeR 0.85 / exposure 1.35 / haloFrac 0.10 /
 * phase 0.7 at millions of particles rendered offline — this module keeps
 * those same params but drops the particle count to something a real GPU can
 * push every frame, and moves the curl-noise sampling phase in the vertex
 * shader over time so the internal flow keeps drifting while the particle
 * anchors themselves stay fixed (cheap, GPU-parallel, 60fps-safe).
 */

// ── Seeded RNG (mulberry32) — deterministic particle layout across mounts ──
function mulberry32(seed: number) {
  let a = seed | 0
  return function rand() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ── Palette (matches the static hero render exactly) ────────────────────────
const INK_HEX = 0x080807
const EMBER_HEX = 0xe8761a
const AMBER_HEX = 0xf5a524
const HILITE_HEX = 0xffc861

// ── Twin-lobe torus-knot spine — same constants as the offline reference ───
const KP = 2
const KQ = 3
const KNOT_R = 1.5
const KNOT_r = 0.55

function spine(t: number, out: Float32Array) {
  const x = (KNOT_R + KNOT_r * Math.cos(KQ * t)) * Math.cos(KP * t)
  const y = (KNOT_R + KNOT_r * Math.cos(KQ * t)) * Math.sin(KP * t)
  const z = KNOT_r * Math.sin(KQ * t)
  out[0] = x * 1.55
  out[1] = y * 0.95
  out[2] = z * 1.15
  return out
}

function spineWeight(t: number) {
  return 1 + 0.65 * Math.sin(3 * t + 1.1) + 0.4 * Math.sin(7 * t + 2.3) + 0.25 * Math.sin(11 * t + 0.4)
}

// ── Art params — final values used for the static hero-*.webp render ───────
const SEED = 1337
const TUBE_R = 0.85
const CORE_BIAS = 1.9
const HALO_FRAC = 0.1
const DUSK_FRAC = 0.06
const CURL_FREQ = 0.45
const CURL_AMP = 0.55
const LOOP_R = 0.9
const EXPOSURE = 1.35
const PHASE_START = 0.7
/** Slow internal drift — "life", not a spin. ~52s per full flow cycle. */
const PHASE_SPEED = 0.12

const CAM_FOV = 45
const CAM_Z = 12.0
const CAM_Y = -0.4
const GROUP_OFFSET_X = 1.1
const GROUP_ROT = { x: 0.2, y: 0.35, z: 0.1 }
const FOG_NEAR = CAM_Z - 2.5
const FOG_FAR = CAM_Z + 3.5

/** Pointer parallax — group tilts at most ±3° toward the cursor. */
const MAX_TILT = (3 * Math.PI) / 180

/** Real-time particle counts — far fewer than the offline 4M-point master. */
const DESKTOP_COUNT = 60000
const LOWPOWER_COUNT = 25000
const DESKTOP_BASE_PX = 2.4
const LOWPOWER_BASE_PX = 3.1

type ParticleData = {
  positions: Float32Array
  colors: Float32Array
  sizes: Float32Array
  alphas: Float32Array
}

function buildParticles(THREE: typeof import('three'), count: number): ParticleData {
  const rng = mulberry32(SEED)

  let wMax = 0
  for (let s = 0; s < 512; s++) wMax = Math.max(wMax, spineWeight((s / 512) * Math.PI * 2))
  wMax *= 1.02

  const haloCount = Math.floor(count * HALO_FRAC)
  const duskCount = Math.floor(count * DUSK_FRAC)
  const mainCount = count - haloCount - duskCount

  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const alphas = new Float32Array(count)

  const ember = new THREE.Color(EMBER_HEX)
  const amber = new THREE.Color(AMBER_HEX)
  const hilite = new THREE.Color(HILITE_HEX)
  const ink = new THREE.Color(INK_HEX)
  const tmpColor = new THREE.Color()

  const sp = new Float32Array(3)
  const sp2 = new Float32Array(3)
  let p = 0

  for (let i = 0; i < mainCount; i++, p++) {
    let t: number
    let w: number
    do {
      t = rng() * Math.PI * 2
      w = spineWeight(t)
    } while (rng() * wMax > w)

    spine(t, sp)
    spine(t + 0.002, sp2)
    let tx = sp2[0] - sp[0]
    let ty = sp2[1] - sp[1]
    let tz = sp2[2] - sp[2]
    const tl = Math.hypot(tx, ty, tz) || 1
    tx /= tl
    ty /= tl
    tz /= tl

    let ux = -ty
    let uy = tx
    let uz = 0
    let ul = Math.hypot(ux, uy, uz)
    if (ul < 1e-4) {
      ux = 1
      uy = 0
      uz = 0
      ul = 1
    }
    ux /= ul
    uy /= ul
    uz /= ul
    const vx = ty * uz - tz * uy
    const vy = tz * ux - tx * uz
    const vz = tx * uy - ty * ux

    const isCore = rng() < 0.72
    const radial = isCore ? TUBE_R * Math.pow(rng(), CORE_BIAS) : TUBE_R * (1.2 + rng() * 2.0)
    const theta = rng() * Math.PI * 2
    const ox = ux * Math.cos(theta) + vx * Math.sin(theta)
    const oy = uy * Math.cos(theta) + vy * Math.sin(theta)
    const oz = uz * Math.cos(theta) + vz * Math.sin(theta)

    positions[p * 3] = sp[0] + ox * radial
    positions[p * 3 + 1] = sp[1] + oy * radial
    positions[p * 3 + 2] = sp[2] + oz * radial

    const densityT = isCore ? THREE.MathUtils.clamp(1 - radial / TUBE_R, 0, 1) : 0.12 * rng()
    if (densityT > 0.55) tmpColor.copy(amber).lerp(hilite, (densityT - 0.55) / 0.45)
    else tmpColor.copy(ember).lerp(amber, densityT / 0.55)
    colors[p * 3] = tmpColor.r
    colors[p * 3 + 1] = tmpColor.g
    colors[p * 3 + 2] = tmpColor.b

    sizes[p] = isCore ? 1.0 + rng() * 0.6 : 0.7 + rng() * 0.4
    alphas[p] = isCore ? 0.62 + densityT * 0.5 : 0.16 + rng() * 0.18
  }

  for (let i = 0; i < haloCount; i++, p++) {
    const t = rng() * Math.PI * 2
    spine(t, sp)
    const dirx = rng() * 2 - 1
    const diry = rng() * 2 - 1
    const dirz = rng() * 2 - 1
    const dl = Math.hypot(dirx, diry, dirz) || 1
    const radial = TUBE_R * (2.6 + rng() * 3.2)
    positions[p * 3] = sp[0] + (dirx / dl) * radial
    positions[p * 3 + 1] = sp[1] + (diry / dl) * radial
    positions[p * 3 + 2] = sp[2] + (dirz / dl) * radial

    tmpColor.copy(ember).lerp(ink, 0.15 + rng() * 0.25)
    colors[p * 3] = tmpColor.r
    colors[p * 3 + 1] = tmpColor.g
    colors[p * 3 + 2] = tmpColor.b
    sizes[p] = 0.55 + rng() * 0.35
    alphas[p] = 0.05 + rng() * 0.09
  }

  for (let i = 0; i < duskCount; i++, p++) {
    positions[p * 3] = (rng() * 2 - 1) * 4.2
    positions[p * 3 + 1] = (rng() * 2 - 1) * 3.0
    positions[p * 3 + 2] = (rng() * 2 - 1) * 3.2

    tmpColor.copy(ember).lerp(ink, 0.35 + rng() * 0.35)
    colors[p * 3] = tmpColor.r
    colors[p * 3 + 1] = tmpColor.g
    colors[p * 3 + 2] = tmpColor.b
    sizes[p] = 0.5 + rng() * 0.3
    alphas[p] = 0.03 + rng() * 0.06
  }

  return { positions, colors, sizes, alphas }
}

// ── GLSL: classic Ashima/Gustavson simplex3 noise (public webgl-noise algorithm) ──
const NOISE_GLSL = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  // Three decorrelated noise channels (fixed offsets), curl of which gives a
  // divergence-free flow field — mirrors the offline reference's makeCurl().
  float nX(vec3 p) { return snoise(p); }
  float nY(vec3 p) { return snoise(p + vec3(37.2, 91.1, 13.7)); }
  float nZ(vec3 p) { return snoise(p + vec3(-71.4, 5.3, 47.9)); }

  vec3 curlNoise(vec3 p) {
    float e = 0.06;
    float dFz_dy = (nZ(p + vec3(0.0, e, 0.0)) - nZ(p - vec3(0.0, e, 0.0))) / (2.0 * e);
    float dFy_dz = (nY(p + vec3(0.0, 0.0, e)) - nY(p - vec3(0.0, 0.0, e))) / (2.0 * e);
    float dFx_dz = (nX(p + vec3(0.0, 0.0, e)) - nX(p - vec3(0.0, 0.0, e))) / (2.0 * e);
    float dFz_dx = (nZ(p + vec3(e, 0.0, 0.0)) - nZ(p - vec3(e, 0.0, 0.0))) / (2.0 * e);
    float dFy_dx = (nY(p + vec3(e, 0.0, 0.0)) - nY(p - vec3(e, 0.0, 0.0))) / (2.0 * e);
    float dFx_dy = (nX(p + vec3(0.0, e, 0.0)) - nX(p - vec3(0.0, e, 0.0))) / (2.0 * e);
    return vec3(dFz_dy - dFy_dz, dFx_dz - dFz_dx, dFy_dx - dFx_dy);
  }
`

const VERT = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aAlpha;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vFog;
  uniform float uPixelRatio;
  uniform float uBasePx;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uCurlFreq;
  uniform float uCurlAmp;
  uniform vec3 uCurlOffset;

  ${NOISE_GLSL}

  void main() {
    vColor = aColor;

    // Anchors stay fixed; only the sampled region of the curl-noise field
    // drifts over time (uCurlOffset), so the internal flow keeps moving
    // without the swarm's centroid running away.
    vec3 p = position * uCurlFreq + uCurlOffset;
    vec3 c = curlNoise(p);
    vec3 displaced = position + c * uCurlAmp;

    vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
    float dist = -mv.z;
    vFog = clamp((dist - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);
    vAlpha = aAlpha * (1.0 - 0.65 * vFog);
    gl_Position = projectionMatrix * mv;
    float sizeAtten = mix(1.15, 0.55, vFog);
    gl_PointSize = aSize * uBasePx * uPixelRatio * sizeAtten;
  }
`

const FRAG = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vFog;
  uniform vec3 uInk;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv) * 2.0;
    float alpha = smoothstep(1.0, 0.0, d);
    alpha = pow(alpha, 1.4);
    if (alpha < 0.02) discard;
    vec3 col = mix(vColor, uInk, vFog * 0.9);
    float a = alpha * vAlpha;
    gl_FragColor = vec4(col * a, a);
  }
`

export async function createAgenticSwarmScene(
  canvas: HTMLCanvasElement,
  options: HeroSceneOptions,
): Promise<HeroScene> {
  const THREE = await import('three')
  const low = options.lowPower ?? false
  const count = low ? LOWPOWER_COUNT : DESKTOP_COUNT
  const basePx = low ? LOWPOWER_BASE_PX : DESKTOP_BASE_PX
  const dpr = getDpr(low)

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !low,
    alpha: false,
    powerPreference: low ? 'default' : 'high-performance',
  })
  renderer.setPixelRatio(dpr)
  renderer.setClearColor(INK_HEX, 1)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = EXPOSURE

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(INK_HEX)

  const camera = new THREE.PerspectiveCamera(CAM_FOV, 1, 0.1, 30)
  camera.position.set(0, CAM_Y, CAM_Z)
  camera.lookAt(0, 0, 0)

  const group = new THREE.Group()
  group.position.x = GROUP_OFFSET_X
  group.rotation.set(GROUP_ROT.x, GROUP_ROT.y, GROUP_ROT.z)
  scene.add(group)

  const { positions, colors, sizes, alphas } = buildParticles(THREE, count)

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geo.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1))

  const ink = new THREE.Color(INK_HEX)
  const curlOffset = new THREE.Vector3()

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uPixelRatio: { value: dpr },
      uBasePx: { value: basePx },
      uFogNear: { value: FOG_NEAR },
      uFogFar: { value: FOG_FAR },
      uCurlFreq: { value: CURL_FREQ },
      uCurlAmp: { value: CURL_AMP },
      uCurlOffset: { value: curlOffset },
      uInk: { value: new THREE.Vector3(ink.r, ink.g, ink.b) },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
  })

  const points = new THREE.Points(geo, mat)
  group.add(points)

  const applyPhase = (phase: number) => {
    curlOffset.set(
      LOOP_R * Math.cos(phase),
      LOOP_R * Math.sin(phase),
      LOOP_R * Math.cos(phase + Math.PI / 2) * 0.6,
    )
  }

  let raf = 0
  let running = false
  let time = 0
  let lastFrame = 0
  let targetTiltX = 0
  let targetTiltY = 0
  let smoothTiltX = 0
  let smoothTiltY = 0
  let removePointer: (() => void) | undefined

  const tick = (now: number) => {
    if (!running) return
    const dt = Math.min(0.05, lastFrame ? (now - lastFrame) / 1000 : 0.016)
    lastFrame = now
    time += dt

    applyPhase(PHASE_START + time * PHASE_SPEED)

    smoothTiltX += (targetTiltX - smoothTiltX) * HERO_ROTATION_DAMP
    smoothTiltY += (targetTiltY - smoothTiltY) * HERO_ROTATION_DAMP
    group.rotation.x = GROUP_ROT.x + smoothTiltX
    group.rotation.y = GROUP_ROT.y + smoothTiltY

    renderer.render(scene, camera)
    raf = requestAnimationFrame(tick)
  }

  // Window-level pointer tracking — the swarm reads as ambient/alive even
  // when the cursor isn't directly over its (often small) card.
  const onPointerMove = (e: PointerEvent) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1
    const ny = (e.clientY / window.innerHeight) * 2 - 1
    targetTiltY = nx * MAX_TILT
    targetTiltX = ny * MAX_TILT
  }

  return {
    setSize(w: number, h: number) {
      if (w < 2 || h < 2) return
      renderer.setSize(w, h, false)
      camera.aspect = w / Math.max(h, 1)
      camera.updateProjectionMatrix()
      // Reduced-motion never runs a RAF loop — re-render the single frame so
      // resizes don't leave a stale/stretched framebuffer.
      if (options.reducedMotion && running) {
        renderer.render(scene, camera)
      }
    },

    start() {
      if (running) return
      running = true

      if (options.reducedMotion) {
        applyPhase(PHASE_START)
        renderer.render(scene, camera)
        return
      }

      window.addEventListener('pointermove', onPointerMove, { passive: true })
      removePointer = () => window.removeEventListener('pointermove', onPointerMove)
      raf = requestAnimationFrame(tick)
    },

    stop() {
      running = false
      cancelAnimationFrame(raf)
      removePointer?.()
      removePointer = undefined
    },

    dispose() {
      running = false
      cancelAnimationFrame(raf)
      removePointer?.()
      geo.dispose()
      mat.dispose()
      renderer.dispose()
      renderer.getContext().getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
