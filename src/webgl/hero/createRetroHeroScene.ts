import {
  BloomEffect,
  BlendFunction,
  ChromaticAberrationEffect,
  EffectComposer,
  EffectPass,
  NoiseEffect,
  RenderPass,
  ScanlineEffect,
  VignetteEffect,
} from 'postprocessing'
import type { HeroScene, HeroSceneOptions } from './heroSceneTypes'
import { bindHeroPointer, getDpr } from './heroSceneTypes'

// ─── Palette ─────────────────────────────────────────────────────────────────
const C_SKY_TOP   = 0x140a2e  // deep indigo — clear colour
const C_GRID_LINE = 0xff3dbb  // neon magenta
const C_GRID_ALT  = 0xff9d3d  // amber accent
const C_SUN_GLOW  = 0xff5e8a  // warm halo

// ─── Sky shader: gradient + twinkling stars + horizon glow ────────────────────
const SKY_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }
`
const SKY_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;

  vec3 skyTop  = vec3(0.078, 0.039, 0.180);
  vec3 skyMid  = vec3(0.560, 0.137, 0.420);
  vec3 horizon = vec3(1.000, 0.420, 0.380);

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    float y = vUv.y;
    vec3 col;
    if (y > 0.5) {
      float t = (y - 0.5) * 2.0;                 // 0 horizon → 1 top
      col = mix(horizon, mix(skyMid, skyTop, t * t), t);

      // stars (upper sky only, density fades toward horizon)
      vec2 sp = vec2(vUv.x * uAspect, vUv.y) * 90.0;
      vec2 id = floor(sp);
      float h = hash(id);
      float star = step(0.972, h) * smoothstep(0.5, 0.0, length(fract(sp) - 0.5));
      float tw = 0.5 + 0.5 * sin(uTime * 3.0 + h * 40.0);
      col += star * tw * vec3(1.0, 0.92, 0.85) * t;

      // soft horizon bloom
      col += horizon * pow(1.0 - t, 3.5) * 0.6;
    } else {
      // below horizon — dark floor base, slight warm tint near the line
      col = mix(vec3(0.015, 0.008, 0.04), horizon * 0.45, pow(y * 2.0, 1.5));
    }
    gl_FragColor = vec4(col, 1.0);
  }
`

// ─── Sun shader: vertical gradient + animated horizontal slits ────────────────
const SUN_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const SUN_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;

  vec3 sunTop = vec3(1.000, 0.847, 0.420);
  vec3 sunBot = vec3(1.000, 0.239, 0.467);

  void main() {
    vec2 p = vUv - 0.5;
    float d = length(p) * 2.0;
    if (d > 1.0) discard;

    vec3 col = mix(sunBot, sunTop, vUv.y);

    // slits in the lower 55%, drifting slowly downward
    if (vUv.y < 0.55) {
      float bandY = (vUv.y * 16.0) - uTime * 0.6;
      float gap   = step(0.42, fract(bandY));
      float fade  = smoothstep(0.0, 0.55, vUv.y);   // fewer slits higher up
      float cut   = mix(1.0, gap, 1.0 - fade);
      float aedge = 1.0 - smoothstep(0.9, 1.0, d);
      gl_FragColor = vec4(col, cut * aedge);
      return;
    }

    float edge = 1.0 - smoothstep(0.92, 1.0, d);
    gl_FragColor = vec4(col, edge);
  }
`

// ─── Halo shader: additive radial glow behind the sun ─────────────────────────
const HALO_FRAG = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uPulse;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float a = smoothstep(1.0, 0.0, d);
    a = pow(a, 2.2) * (0.55 + uPulse * 0.15);
    gl_FragColor = vec4(uColor, a);
  }
`

// ─── Grid floor shader: infinite scrolling neon grid w/ glow + horizon fade ────
const GRID_VERT = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`
const GRID_FRAG = /* glsl */ `
  precision highp float;
  varying vec3 vWorld;
  uniform float uTime;
  uniform vec3 uColorA;   // magenta (lines along view)
  uniform vec3 uColorB;   // amber (cross lines)
  uniform float uScale;

  void main() {
    vec2 p = vWorld.xz;
    p.y += uTime * 5.0;                       // scroll toward camera
    vec2 c = p * uScale;
    vec2 fr = fract(c);
    vec2 dist = min(fr, 1.0 - fr);            // distance to nearest line per-axis

    float lw = 0.018;
    float lineX = smoothstep(lw, 0.0, dist.x);
    float lineZ = smoothstep(lw, 0.0, dist.y);
    float glowX = exp(-dist.x * 13.0) * 0.5;
    float glowZ = exp(-dist.y * 13.0) * 0.5;
    float ix = lineX + glowX;
    float iz = lineZ + glowZ;
    float intensity = clamp(max(ix, iz), 0.0, 1.7);

    vec3 col = iz > ix ? uColorA : uColorB;

    float depth = -vWorld.z;                  // camera ~z=0 looking -z
    float fogFar  = smoothstep(160.0, 28.0, depth);
    float fogNear = smoothstep(-4.0, 14.0, depth);
    float sideFade = smoothstep(70.0, 22.0, abs(vWorld.x));
    float a = intensity * fogFar * fogNear * sideFade;
    if (a < 0.004) discard;

    gl_FragColor = vec4(col * intensity, a);
  }
`

export async function createRetroHeroScene(
  canvas: HTMLCanvasElement,
  options: HeroSceneOptions,
): Promise<HeroScene> {
  const THREE = await import('three')
  const low = options.lowPower ?? false

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !low,
    alpha: false,
    powerPreference: low ? 'default' : 'high-performance',
  })
  renderer.setPixelRatio(getDpr(low))
  renderer.setClearColor(C_SKY_TOP, 1)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(62, 1, 0.01, 400)
  const LOOK_Y = 1.15
  camera.position.set(0, 1.5, 0)
  camera.lookAt(0, LOOK_Y, -10)

  // ─── Sky (fullscreen, own ortho scene) ──────────────────────────────────────
  const skyGeo = new THREE.PlaneGeometry(2, 2)
  const skyMat = new THREE.ShaderMaterial({
    vertexShader: SKY_VERT,
    fragmentShader: SKY_FRAG,
    uniforms: { uTime: { value: 0 }, uAspect: { value: 1 } },
    depthTest: false,
    depthWrite: false,
  })
  const skyScene = new THREE.Scene()
  const skyCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  skyScene.add(new THREE.Mesh(skyGeo, skyMat))

  // ─── Grid floor (shader plane) ──────────────────────────────────────────────
  const gridGeo = new THREE.PlaneGeometry(320, 320)
  const gridMat = new THREE.ShaderMaterial({
    vertexShader: GRID_VERT,
    fragmentShader: GRID_FRAG,
    uniforms: {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(C_GRID_LINE) },
      uColorB: { value: new THREE.Color(C_GRID_ALT) },
      uScale: { value: low ? 0.4 : 0.5 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const grid = new THREE.Mesh(gridGeo, gridMat)
  grid.rotation.x = -Math.PI / 2
  grid.position.set(0, 0, -140)
  grid.renderOrder = 0
  scene.add(grid)

  // ─── Sun + halo ─────────────────────────────────────────────────────────────
  const sunGeo = new THREE.CircleGeometry(0.5, low ? 48 : 96)
  const sunMat = new THREE.ShaderMaterial({
    vertexShader: SUN_VERT,
    fragmentShader: SUN_FRAG,
    uniforms: { uTime: { value: 0 } },
    transparent: true,
  })
  const sun = new THREE.Mesh(sunGeo, sunMat)
  sun.position.set(0, 1.85, -22)
  sun.scale.setScalar(9)
  sun.renderOrder = 1
  scene.add(sun)

  const haloGeo = new THREE.PlaneGeometry(1, 1)
  const haloMat = new THREE.ShaderMaterial({
    vertexShader: SUN_VERT,
    fragmentShader: HALO_FRAG,
    uniforms: { uColor: { value: new THREE.Color(C_SUN_GLOW) }, uPulse: { value: 0 } },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const halo = new THREE.Mesh(haloGeo, haloMat)
  halo.position.set(0, 1.85, -22.2)
  halo.scale.setScalar(22)
  halo.renderOrder = 0
  scene.add(halo)

  // ─── Postprocessing — bloom + CRT stack ─────────────────────────────────────
  const composer = new EffectComposer(renderer, { multisampling: low ? 0 : 2 })
  composer.addPass(new RenderPass(skyScene, skyCamera))
  const mainPass = new RenderPass(scene, camera)
  mainPass.clearPass.enabled = false
  composer.addPass(mainPass)

  const bloom = new BloomEffect({
    intensity: low ? 0.9 : 1.7,
    luminanceThreshold: 0.25,
    luminanceSmoothing: 0.4,
    mipmapBlur: true,
  })
  composer.addPass(new EffectPass(camera, bloom))

  let chroma: ChromaticAberrationEffect | undefined
  let scanline: ScanlineEffect | undefined
  let vignette: VignetteEffect | undefined
  let noise: NoiseEffect | undefined
  if (!low) {
    chroma = new ChromaticAberrationEffect({
      offset: new THREE.Vector2(0.0016, 0.0011),
      radialModulation: true,
      modulationOffset: 0.4,
    })
    scanline = new ScanlineEffect({ density: 1.1 })
    scanline.blendMode.opacity.value = 0.18
    vignette = new VignetteEffect({ offset: 0.28, darkness: 0.62 })
    noise = new NoiseEffect({ blendFunction: BlendFunction.OVERLAY, premultiply: true })
    noise.blendMode.opacity.value = 0.085
    composer.addPass(new EffectPass(camera, chroma, scanline, vignette, noise))
  } else {
    vignette = new VignetteEffect({ offset: 0.3, darkness: 0.5 })
    composer.addPass(new EffectPass(camera, vignette))
  }

  // ─── State ──────────────────────────────────────────────────────────────────
  let raf = 0
  let running = false
  let time = 0
  let lastFrame = 0
  let targetNX = 0.5
  let targetNY = 0.5
  let smoothNX = 0.5
  let smoothNY = 0.5
  let removePointer: (() => void) | undefined

  const tick = (now: number) => {
    if (!running) return
    const dt = options.reducedMotion ? 0 : Math.min(0.05, lastFrame ? (now - lastFrame) / 1000 : 0.016)
    lastFrame = now

    if (!options.reducedMotion) {
      time += dt
      gridMat.uniforms.uTime.value = time
      skyMat.uniforms.uTime.value = time
      sunMat.uniforms.uTime.value = time
      haloMat.uniforms.uPulse.value = Math.sin(time * 1.7) * 0.5 + 0.5

      smoothNX += (targetNX - smoothNX) * 0.06
      smoothNY += (targetNY - smoothNY) * 0.06
      camera.position.x = (smoothNX - 0.5) * 0.7
      camera.position.y = 1.5 + (smoothNY - 0.5) * 0.25
      camera.lookAt(0, LOOK_Y, -10)
    }

    composer.render(dt)
    raf = requestAnimationFrame(tick)
  }

  return {
    setSize(w: number, h: number) {
      if (w < 2 || h < 2) return
      renderer.setSize(w, h, false)
      composer.setSize(w, h)
      camera.aspect = w / Math.max(h, 1)
      camera.updateProjectionMatrix()
      skyMat.uniforms.uAspect.value = w / Math.max(h, 1)
    },

    start() {
      if (running) return
      running = true
      const host = canvas.parentElement
      if (host && !options.reducedMotion) {
        removePointer = bindHeroPointer(host, (nx, ny) => {
          targetNX = nx
          targetNY = ny
        })
      }
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
      skyGeo.dispose()
      skyMat.dispose()
      gridGeo.dispose()
      gridMat.dispose()
      sunGeo.dispose()
      sunMat.dispose()
      haloGeo.dispose()
      haloMat.dispose()
      composer.dispose()
      renderer.dispose()
      renderer.getContext().getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
