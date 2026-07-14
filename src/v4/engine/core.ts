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
  const { lowPower, manager } = opts

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !lowPower,
    alpha: false,
    powerPreference: lowPower ? 'default' : 'high-performance',
    // Matches src/webgl/createDisplacementEffect.ts — without this, a WebGL
    // canvas reads back as blank (readPixels/toDataURL/screenshot tooling)
    // any time the read happens between frames rather than in the same tick
    // as the draw call, which software-rendering verification (SwiftShader,
    // very slow per-frame) hits constantly.
    preserveDrawingBuffer: true,
  })
  renderer.setPixelRatio(getDpr(lowPower))
  renderer.setClearColor(0x000000, 1)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 6000)
  camera.position.set(0, 4, 16)

  // Camera-attached fill light — keeps the ship's near side readable regardless
  // of where the fixed world "sun" happens to be relative to the chase angle.
  // (Point lights in three's physically-based lighting need large intensity to
  // read at these travel distances — inverse-square falloff over ~30-40 units.)
  const cameraFill = new THREE.PointLight(0xbfd6ff, 1400, 220, 2)
  camera.add(cameraFill)
  scene.add(camera)

  // ─── Skybox: equirect background + PMREM env for PBR reflections ───────────
  // Desktop tier gets the full-resolution 8K background (crisp Milky Way when
  // the camera lingers), while the PMREM env — which gets prefiltered down to
  // low-frequency mips anyway — is built from the cheaper 4K. Low-power keeps
  // 2K for both. The background texture is ALSO what the black hole shader
  // lenses, so the impostor stays pixel-continuous with the real sky.
  const texLoader = new THREE.TextureLoader(manager)
  const maxAniso = Math.min(renderer.capabilities.getMaxAnisotropy(), 8)

  const skyboxUrl = lowPower ? SKYBOX_2K : SKYBOX_8K
  const envSrcUrl = lowPower ? SKYBOX_2K : SKYBOX_4K
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
  // The 4K env source has served its purpose once PMREM is baked.
  envSrcTex?.dispose()

  // ─── Lighting — starlight fill + a directional "sun" for specular pop ───────
  scene.add(new THREE.HemisphereLight(0x8fa6ff, 0x0a0a12, 0.6))
  const sun = new THREE.DirectionalLight(0xffffff, 2.2)
  sun.position.set(600, 400, 250)
  scene.add(sun)

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
    intensity: lowPower ? 0.55 : 0.9,
    luminanceThreshold: 0.65,
    luminanceSmoothing: 0.3,
    mipmapBlur: true,
  })

  // Film grain — premultiplied so it reads stronger against dark space and
  // stays subtle over bright disk/bloom highlights. Kept at the low end of
  // the 0.05–0.08 target range on lowPower (less visible noise to resolve).
  const grain = new NoiseEffect({ premultiply: true })
  grain.blendMode.opacity.value = lowPower ? 0.05 : 0.07

  // Subtle framing vignette — offset/darkness kept gentle so it reads as
  // lens falloff, not a tunnel around the ship.
  const vignette = new VignetteEffect({ offset: 0.32, darkness: 0.55 })

  // Filmic restraint: a touch of contrast, slightly desaturated highlights —
  // the "not Instagram" grade the brief for this pass calls for.
  const contrast = new BrightnessContrastEffect({ contrast: 0.06 })
  const desaturate = new HueSaturationEffect({ saturation: -0.04 })

  const cinematicEffects: Effect[] = [bloom, contrast, desaturate, grain, vignette]
  if (!lowPower) {
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

  // `?debug=1` verification-only fallback: some headless/automation browser
  // contexts report document.hidden = true for the tab under test forever
  // (no real window ever gets focus). Two separate things break in that
  // case, both worked around only in this mode (real visitors always have
  // document.hidden === false, so production behavior — pausing the sim
  // while backgrounded — is completely unchanged):
  //  1. Chrome never invokes requestAnimationFrame callbacks for a hidden
  //     page, so the render loop would silently freeze forever with no
  //     error — scheduleTick() below falls back to setTimeout.
  //  2. THREE.Timer's Page Visibility integration (timer.connect(document))
  //     hard-zeroes getDelta() for every update() call while document.hidden
  //     is true, by design (it exists to avoid huge deltas after a real tab
  //     switch) — which would leave dt permanently 0 even once (1) is
  //     worked around, freezing all physics/animation while still rendering
  //     (mostly) static frames. Skipping connect() in verification mode
  //     avoids that.
  const verificationMode = new URLSearchParams(location.search).has('debug')

  // ─── RAF loop — THREE.Timer (Clock is deprecated as of r180) ────────────────
  const timer = new THREE.Timer()
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
