import * as THREE from 'three'
import {
  BloomEffect,
  BrightnessContrastEffect,
  ChromaticAberrationEffect,
  type Effect,
  EffectComposer,
  EffectPass,
  HueSaturationEffect,
  NoiseEffect,
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
  // First paint loads the 4K background on desktop tier (2K on low-power);
  // `scheduleSkyUpgrade` below swaps the dome — and the black hole shader
  // that lenses the same texture object — up to the full 8K once the scene
  // is idle, so the initial load never pays for the crisp-Milky-Way version.
  // The PMREM env — which gets prefiltered down to low-frequency mips anyway
  // — never needs more than 2K on any tier; a 4K source only cost bandwidth
  // for identical output. The background texture is ALSO what the black hole
  // shader lenses, so the impostor stays pixel-continuous with the real sky.
  const texLoader = new THREE.TextureLoader(manager)
  const maxAniso = Math.min(renderer.capabilities.getMaxAnisotropy(), 8)

  const skyboxUrl = lowPower ? SKYBOX_2K : SKYBOX_4K
  const envSrcUrl = SKYBOX_2K
  const skyTexPromise = texLoader.loadAsync(skyboxUrl)
  const envSrcPromise: Promise<THREE.Texture | null> =
    skyboxUrl === envSrcUrl ? Promise.resolve(null) : texLoader.loadAsync(envSrcUrl)
  const skyTex = await skyTexPromise
  const envSrcTex = await envSrcPromise
  skyTex.mapping = THREE.EquirectangularReflectionMapping
  skyTex.colorSpace = THREE.SRGBColorSpace
  skyTex.anisotropy = maxAniso
  // Repeat na osi U — warunek konieczny bezszwowego próbkowania na styku 0/1
  // (dual-sample trick w SKY_FRAG i w blackHole.ts wybiera próbkę o mniejszej
  // pochodnej UV, co eliminuje mipmapowy „szew" na nieciągłości atan2).
  skyTex.wrapS = THREE.RepeatWrapping
  skyTex.needsUpdate = true

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

  // Set by dispose(), declared here so the idle sky upgrade below (and
  // nothing else) can check it before touching a torn-down texture/renderer.
  let engineDisposed = false

  // ─── Progressive sky upgrade — 4K → 8K once idle ───────────────────────────
  // `skyTex` is the SAME Texture instance the dome's `uSky` uniform and
  // `createBlackHole`'s `uSky` uniform both hold a reference to (see
  // world/index.ts / world/blackHole.ts), so swapping its `.image` in place —
  // rather than creating a new Texture — upgrades both consumers for free,
  // with no extra plumbing and no risk of the two ever showing different
  // resolutions. Low-power skips this entirely: it is already at 2K/2K and
  // has no idle budget to spend on a bigger download.
  // A 4.4 MB texture is worth it on a desktop with a real connection and
  // nowhere near worth it on a phone on mobile data, which is exactly what
  // the Network Information API exists to tell us: 4g (or nothing said at
  // all, on browsers that do not implement it) gets the upgrade, everything
  // slower and anyone who has asked their browser to save data keeps the 4K.
  const conn = (
    navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } }
  ).connection
  const wantsBytes = !conn?.saveData && (conn?.effectiveType ?? '4g') === '4g'
  if (!lowPower && wantsBytes) {
    const scheduleIdle = (cb: () => void): number => {
      if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
        return window.requestIdleCallback(cb, { timeout: 4000 })
      }
      return window.setTimeout(cb, 2000)
    }
    scheduleIdle(() => {
      if (engineDisposed) return
      const upgradeLoader = new THREE.ImageLoader()
      upgradeLoader.load(SKYBOX_8K, (img) => {
        if (engineDisposed) return
        skyTex.image = img
        skyTex.needsUpdate = true
      })
    })
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

  // ─── Postprocessing — cinematic grade ──────────────────────────────────────
  // Bloom (engines/stars glow, hull stays matte) + a tasteful film-grade stack:
  // grain + vignette + filmic desaturated contrast on every tier, chromatic
  // aberration added only on desktop (an extra per-fragment sample offset).
  // All effects are merged into ONE EffectPass — postprocessing.js compiles a
  // single combined fragment shader for every effect handed to one pass, so
  // this stays a single extra draw call regardless of how many effects run.
  const composer = new EffectComposer(renderer, { multisampling: lowPower ? 0 : 4 })
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new BloomEffect({
    // Disk/photon-ring sit near white after ACES; a low threshold + mipmap
    // kernel smeared that gold band straight through the event-horizon disk.
    // Engines/stars still bloom — they remain well above this cut.
    intensity: reducedMotion ? 0.14 : lowPower ? 0.22 : 0.28,
    luminanceThreshold: 0.96,
    luminanceSmoothing: 0.08,
    mipmapBlur: true,
  })

  // Film grain — premultiplied so it reads stronger against dark space and
  // stays subtle over bright disk/bloom highlights. Kept at the low end of
  // the 0.05–0.08 target range on lowPower (less visible noise to resolve).
  const grain = new NoiseEffect({ premultiply: true })
  grain.blendMode.opacity.value = reducedMotion ? 0 : lowPower ? 0.03 : 0.05

  const vignette = new VignetteEffect({ offset: 0.3, darkness: 0.62 })

  const contrast = new BrightnessContrastEffect({ contrast: 0.08, brightness: 0.01 })
  const desaturate = new HueSaturationEffect({ saturation: -0.06 })

  const cinematicEffects: Effect[] = [bloom, contrast, desaturate, grain, vignette]
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
      engineDisposed = true
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
