import * as THREE from 'three'
import {
  BloomEffect,
  BrightnessContrastEffect,
  ChromaticAberrationEffect,
  type Effect,
  EffectComposer,
  EffectPass,
  HueSaturationEffect,
  RenderPass,
  VignetteEffect,
} from 'postprocessing'
import { getDpr } from '../../webgl/hero/heroSceneTypes'
import { createDustField, type DustField } from './dust'
import { createStarfield, type Starfield } from './starfield'
import { SKY_ROT_SPEED } from '../world/shaderChunks'

export type EngineOptions = {
  lowPower: boolean
  reducedMotion: boolean
  manager: THREE.LoadingManager
}

export type Engine = {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  composer: EffectComposer
  dust: DustField
  /** PMREM-filtered env map — feed into ship materials for realistic reflections. */
  envMap: THREE.Texture | null
  /** Raw equirect skybox texture (same one behind scene.background) — the
   * black hole shader samples this directly for lensed background rays. */
  skyTex: THREE.Texture
  setSize(w: number, h: number): void
  /** Register a per-frame callback. Returns an unsubscribe function. */
  onTick(fn: (dt: number, elapsed: number) => void): () => void
  start(): void
  stop(): void
  dispose(): void
}

const SKYBOX_8K = '/v4/assets/skybox-8k.jpg'
const SKYBOX_4K = '/v4/assets/skybox-4k.jpg'
const SKYBOX_2K = '/v4/assets/skybox-2k.jpg'

type NavigatorConnection = { saveData?: boolean }
type NavigatorWithOptionalNetwork = Navigator & {
  connection?: NavigatorConnection
  userAgentData?: { mobile?: boolean }
}

function connectionSaveData(): boolean {
  if (typeof navigator === 'undefined') return false
  return Boolean((navigator as NavigatorWithOptionalNetwork).connection?.saveData)
}

/** Phones must not pay 8K GPU memory. Do not key this off `effectiveType`. */
function isMobileClient(): boolean {
  if (typeof navigator === 'undefined') return false
  const nav = navigator as NavigatorWithOptionalNetwork
  if (nav.userAgentData?.mobile === true) return true
  // Chrome device-mode often leaves userAgentData.mobile=false while rewriting UA.
  return /iPhone|iPod|Android.+Mobile/i.test(navigator.userAgent)
}

function skyUrlCandidates(maxTextureSize: number, constrainBytes: boolean): string[] {
  if (constrainBytes) return [SKYBOX_2K]
  if (maxTextureSize >= 8192) return [SKYBOX_8K, SKYBOX_4K, SKYBOX_2K]
  if (maxTextureSize >= 4096) {
    console.warn(`[v4] GPU maxTextureSize=${maxTextureSize} < 8192; sky fallback ${SKYBOX_4K}`)
    return [SKYBOX_4K, SKYBOX_2K]
  }
  console.warn(`[v4] GPU maxTextureSize=${maxTextureSize} < 4096; sky fallback ${SKYBOX_2K}`)
  return [SKYBOX_2K]
}

async function loadSkyTexture(
  loader: THREE.TextureLoader,
  urls: string[],
): Promise<{ texture: THREE.Texture; url: string }> {
  let lastError: unknown
  for (const url of urls) {
    try {
      const texture = await loader.loadAsync(url)
      return { texture, url }
    } catch (err) {
      lastError = err
      console.error(`[v4] sky texture failed to load: ${url}`, err)
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error(`[v4] sky texture failed to load: ${urls.join(' → ')}`)
}

function configureEquirectSky(tex: THREE.Texture): void {
  tex.mapping = THREE.EquirectangularReflectionMapping
  tex.colorSpace = THREE.SRGBColorSpace
  // Distant equirect dome is sampled near 1:1. Mipmaps average neighbouring
  // longitudes into haze and, at the atan2 wrap, a vertical seam.
  tex.generateMipmaps = false
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  // Anisotropy only filters minified mip chains — a no-op without mips.
  tex.anisotropy = 1
  tex.needsUpdate = true
}

/** Camera never leaves ±~1000u of the origin (planets sit at 400–900u), so a
 * fixed dome this large always encloses the viewpoint. Must stay inside the
 * camera far plane (6000). */
const SKY_DOME_RADIUS = 4500

const SKY_VERT = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    // View direction from the CAMERA, not from the dome center — the dome is
    // pinned at the origin while the camera roams up to ~1000u away, and the
    // black hole impostor samples true camera rays; sampling by dome-center
    // direction would shift the sky a couple of degrees and reopen the seam.
    vDir = wp.xyz - cameraPosition;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

// Sampling convention (equirectUv + Ry(uSkyRot) yaw) must stay EXACTLY in
// sync with sampleSky() in world/blackHole.ts — that equivalence is what
// keeps the lensing impostor edge invisible.
const SKY_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uSky;
  uniform float uSkyRot;
  varying vec3 vDir;
  #define PI 3.14159265359

  vec2 equirectUv(vec3 dir) {
    float u = atan(dir.z, dir.x) / (2.0 * PI) + 0.5;
    float v = asin(clamp(dir.y, -1.0, 1.0)) / PI + 0.5;
    return vec2(u, v);
  }

  void main() {
    vec3 dir = normalize(vDir);
    float c = cos(uSkyRot);
    float s = sin(uSkyRot);
    vec3 rd = vec3(c * dir.x + s * dir.z, dir.y, -s * dir.x + c * dir.z);
    // Seam-free equirect: przy nieciągłości atan2 (u: 1→0) pochodna UV
    // eksploduje i mipmapping rysuje pionowy szew. Druga próbka z u
    // przesuniętym o 0.5 ma nieciągłość po przeciwnej stronie nieba —
    // wybieramy tę o mniejszej pochodnej (wrapS=Repeat zawija ujemne u).
    vec2 uvA = equirectUv(rd);
    vec2 uvB = vec2(fract(uvA.x + 0.5) - 0.5, uvA.y);
    vec3 col = fwidth(uvA.x) <= fwidth(uvB.x)
      ? texture2D(uSky, uvA).rgb
      : texture2D(uSky, uvB).rgb;
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

function createSkyDome(skyTex: THREE.Texture) {
  const geo = new THREE.SphereGeometry(SKY_DOME_RADIUS, 64, 40)
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uSky: { value: skyTex },
      uSkyRot: { value: 0 },
    },
    vertexShader: SKY_VERT,
    fragmentShader: SKY_FRAG,
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.frustumCulled = false
  mesh.renderOrder = -2 // behind everything, incl. the twinkle starfield (0)
  mesh.name = 'sky-dome'
  return {
    mesh,
    setYaw(yaw: number) {
      mat.uniforms.uSkyRot.value = yaw
    },
    dispose() {
      geo.dispose()
      mat.dispose()
    },
  }
}

export async function createEngine(canvas: HTMLCanvasElement, opts: EngineOptions): Promise<Engine> {
  const { lowPower, manager, reducedMotion } = opts
  const verificationMode =
    typeof location !== 'undefined' && new URLSearchParams(location.search).has('debug')

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !lowPower,
    alpha: false,
    powerPreference: lowPower ? 'default' : 'high-performance',
    // `?debug=1` verification only — preserveDrawingBuffer costs a full extra
    // GPU copy every frame in production and is unused by real visitors.
    preserveDrawingBuffer: verificationMode,
  })
  renderer.setPixelRatio(getDpr(lowPower))
  renderer.setClearColor(0x000000, 1)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.18
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, 1, 0.8, 6000)
  camera.position.set(0, 4, 16)

  // Chase fill — readable charcoal hull without bleaching to clay (640).
  const cameraFill = new THREE.PointLight(0xd0dcea, 250, 120, 2)
  camera.add(cameraFill)
  scene.add(camera)

  // ─── Skybox: equirect background + PMREM env for PBR reflections ───────────
  // Desktop/high-power loads the 8K equirect BEFORE the loading overlay hides,
  // so the first revealed frame is the real sky — not a 4K stand-in that later
  // swaps on idle. Mobile / lowPower / saveData stay on 2K. GPU maxTextureSize
  // < 8192 never even attempts 8K (explicit console fallback, then 4K → 2K).
  // PMREM is prefiltered to low-frequency mips; 2K source is enough on every tier.
  const texLoader = new THREE.TextureLoader(manager)
  const constrainSkyBytes = lowPower || connectionSaveData() || isMobileClient()
  const skyCandidates = skyUrlCandidates(renderer.capabilities.maxTextureSize, constrainSkyBytes)
  const envSrcPromise: Promise<THREE.Texture | null> =
    skyCandidates[0] === SKYBOX_2K
      ? Promise.resolve(null)
      : texLoader.loadAsync(SKYBOX_2K).catch((err: unknown) => {
          console.error(`[v4] env sky texture failed to load: ${SKYBOX_2K}`, err)
          return null
        })
  const [{ texture: skyTex, url: skyUrl }, envSrcTex] = await Promise.all([
    loadSkyTexture(texLoader, skyCandidates),
    envSrcPromise,
  ])
  configureEquirectSky(skyTex)

  // The background is rendered by OUR OWN sky dome (below) rather than
  // scene.background: three converts an equirect background to an internal
  // cubemap resample, whose filtering never exactly matches the raw-equirect
  // sampling the black hole impostor does — leaving a visible brightness
  // seam at the quad edge. One shared sampling convention (equirectUv + yaw
  // rotation, identical GLSL in world/blackHole.ts) makes the seam
  // impossible by construction.
  const skyDome = createSkyDome(skyTex)
  scene.add(skyDome.mesh)

  const pmremSrc = envSrcTex ?? skyTex
  if (envSrcTex) {
    envSrcTex.mapping = THREE.EquirectangularReflectionMapping
    envSrcTex.colorSpace = THREE.SRGBColorSpace
  }
  const pmrem = new THREE.PMREMGenerator(renderer)
  pmrem.compileEquirectangularShader()
  const envRT = pmrem.fromEquirectangular(pmremSrc)
  scene.environment = envRT.texture
  const envMap = envRT.texture
  // The 2K env source has served its purpose once PMREM is baked.
  envSrcTex?.dispose()

  if (verificationMode) {
    const img = skyTex.image as { width?: number; height?: number } | undefined
    ;(window as Window & { __v4Sky?: unknown }).__v4Sky = {
      url: skyUrl,
      imageWidth: img?.width ?? 0,
      imageHeight: img?.height ?? 0,
      generateMipmaps: skyTex.generateMipmaps,
      minFilter: skyTex.minFilter,
      magFilter: skyTex.magFilter,
      wrapS: skyTex.wrapS,
      colorSpace: skyTex.colorSpace,
      anisotropy: skyTex.anisotropy,
      maxTextureSize: renderer.capabilities.maxTextureSize,
      constrained: constrainSkyBytes,
    }
  }

  // ─── Lighting — starlight fill + sun spec + cool rim + warm disk bounce ──
  scene.add(new THREE.HemisphereLight(0x8aa0c8, 0x0a0c10, 0.55))
  const sun = new THREE.DirectionalLight(0xfff1dc, 1.65)
  sun.position.set(600, 400, 250)
  scene.add(sun)
  const starRim = new THREE.DirectionalLight(0xb4c6e4, 0.95)
  starRim.position.set(-420, 260, -380)
  scene.add(starRim)
  const diskBounce = new THREE.PointLight(0xffc070, 130, 520, 1.7)
  diskBounce.position.set(0, 0, 0)
  scene.add(diskBounce)

  // ─── Near-camera dust — sells velocity in otherwise-empty space ────────────
  const dust = createDustField(lowPower)
  scene.add(dust.object)

  // ─── Twinkling near-field stars — the flat skybox can't shimmer; this can ──
  const starfield: Starfield = createStarfield(lowPower)
  scene.add(starfield.object)

  // ─── Postprocessing — keep bloom/grade, stop eating the sky ────────────────
  // Baseline (desktop 1440×900, 8K already on GPU, drawingBuffer 2160×1350):
  // NoiseEffect 0.05 sandpapered dark space; vignette 0.3/0.62 crushed MW
  // edges to black; contrast 0.08 + sat −0.06 turned dust lanes into blobs;
  // bloom 0.28 @ threshold 0.96 haloed the galactic core. Grain is gone.
  // Bloom stays for engines / photon-ring (still above 0.985 after ACES).
  const composer = new EffectComposer(renderer, { multisampling: lowPower ? 0 : 4 })
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new BloomEffect({
    intensity: reducedMotion ? 0.1 : lowPower ? 0.12 : 0.16,
    luminanceThreshold: 0.985,
    luminanceSmoothing: 0.06,
    mipmapBlur: true,
  })

  const vignette = new VignetteEffect({ offset: 0.52, darkness: 0.22 })
  const contrast = new BrightnessContrastEffect({ contrast: 0.02, brightness: 0 })
  const desaturate = new HueSaturationEffect({ saturation: -0.02 })

  const cinematicEffects: Effect[] = [bloom, contrast, desaturate, vignette]
  if (!lowPower && !reducedMotion) {
    // Chromatic aberration — tiny lens-edge color fringing. radialModulation
    // concentrates it at the frame edges (clean center, filmic fringe at the
    // rim) rather than a uniform shift across the whole image.
    const chromaticAberration = new ChromaticAberrationEffect({
      offset: new THREE.Vector2(0.0009, 0.0009),
      radialModulation: true,
      modulationOffset: 0.15,
    })
    cinematicEffects.splice(1, 0, chromaticAberration)
  }
  composer.addPass(new EffectPass(camera, ...cinematicEffects))

  // ─── RAF loop — THREE.Timer (Clock is deprecated as of r180) ────────────────
  const timer = new THREE.Timer()
  // `?debug=1` skips Page Visibility (hidden tabs freeze THREE.Timer + RAF).
  // Production still pauses when the tab is backgrounded.
  if (!verificationMode) timer.connect(document)
  const tickers = new Set<(dt: number, elapsed: number) => void>()
  let raf = 0
  let running = false

  const scheduleTick = (fn: (t: number) => void): number =>
    verificationMode && document.hidden
      ? (setTimeout(() => fn(performance.now()), 16) as unknown as number)
      : requestAnimationFrame(fn)

  const tick = (timestamp: number) => {
    if (!running) return
    timer.update(timestamp)
    const dt = Math.min(0.05, timer.getDelta())
    const elapsed = timer.getElapsed()
    for (const fn of tickers) fn(dt, elapsed)
    // "Alive sky": slow whole-background yaw + twinkling star shell. The
    // black hole shader receives the exact same yaw via its uSkyRot uniform
    // (world/blackHole.ts) so the lensed impostor never shows a seam.
    const skyYaw = elapsed * SKY_ROT_SPEED
    skyDome.setYaw(skyYaw)
    starfield.update(camera.position, elapsed, skyYaw)
    composer.render(dt)
    raf = scheduleTick(tick)
  }

  return {
    renderer,
    scene,
    camera,
    composer,
    dust,
    envMap,
    skyTex,

    setSize(w, h) {
      if (w < 2 || h < 2) return
      renderer.setSize(w, h, false)
      composer.setSize(w, h)
      camera.aspect = w / Math.max(h, 1)
      camera.updateProjectionMatrix()
    },

    onTick(fn) {
      tickers.add(fn)
      return () => tickers.delete(fn)
    },

    start() {
      if (running) return
      running = true
      timer.reset()
      raf = scheduleTick(tick)
    },

    stop() {
      running = false
      clearTimeout(raf)
      cancelAnimationFrame(raf)
    },

    dispose() {
      running = false
      clearTimeout(raf)
      cancelAnimationFrame(raf)
      timer.dispose()
      tickers.clear()
      dust.dispose()
      starfield.dispose()
      skyDome.dispose()
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          for (const m of mats) m?.dispose()
        }
      })
      envRT.dispose()
      pmrem.dispose()
      skyTex.dispose()
      composer.dispose()
      renderer.dispose()
      renderer.getContext().getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
