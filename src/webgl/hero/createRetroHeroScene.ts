import {
  BloomEffect,
  ChromaticAberrationEffect,
  EffectComposer,
  EffectPass,
  HueSaturationEffect,
  NoiseEffect,
  PixelationEffect,
  RenderPass,
  VignetteEffect,
} from 'postprocessing'
import type { HeroScene, HeroSceneOptions } from './heroSceneTypes'
import { bindHeroPointer, getDpr } from './heroSceneTypes'

const RETRO_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const RETRO_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.1;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    vec2 p = (uv - 0.5) * aspect;

    float t = uTime * 0.08;
    vec2 scroll = vec2(t * 0.12, t * 0.07);
    vec2 m = (uMouse - 0.5) * 0.35;
    float n = fbm(p * 2.4 + scroll + m);
    float n2 = fbm(p * 4.0 - scroll * 1.3 - m * 0.5);

    vec2 refractUv = uv + (n - 0.5) * 0.018 + (n2 - 0.5) * 0.01;
    float edge = length(p);
    refractUv += normalize(p + 0.001) * edge * 0.012 * sin(uTime * 0.5 + edge * 6.0);

    vec3 warm = vec3(0.95, 0.42, 0.28);
    vec3 cool = vec3(0.22, 0.55, 0.95);
    vec3 deep = vec3(0.04, 0.03, 0.09);

    float g1 = smoothstep(0.0, 1.0, 1.0 - length(refractUv - vec2(0.35, 0.62) * aspect - m * 0.2));
    float g2 = smoothstep(0.0, 1.0, 1.0 - length(refractUv - vec2(0.78, 0.28) * aspect + m * 0.15));
    float g3 = smoothstep(0.0, 1.0, 1.0 - length(refractUv - vec2(0.52, 0.48) * aspect));

    vec3 col = deep;
    col = mix(col, mix(warm, cool, 0.35 + 0.25 * sin(uTime * 0.2)), g1 * 0.85);
    col = mix(col, cool * 0.9, g2 * 0.7);
    col = mix(col, mix(warm, vec3(0.6, 0.2, 0.55), 0.5), g3 * 0.55);

    float frost = smoothstep(0.2, 0.95, n) * 0.22;
    col += vec3(0.85, 0.9, 1.0) * frost;

    float scan = sin((refractUv.y + uTime * 0.15) * 280.0) * 0.015;
    col += scan;

    float leakL = smoothstep(0.0, 0.35, 1.0 - uv.x) * smoothstep(0.2, 0.9, uv.y);
    float leakR = smoothstep(0.0, 0.35, uv.x) * smoothstep(0.15, 0.85, 1.0 - uv.y);
    col += vec3(1.0, 0.35, 0.15) * leakL * (0.06 + 0.04 * sin(uTime * 0.7));
    col += vec3(0.2, 0.55, 1.0) * leakR * (0.05 + 0.03 * cos(uTime * 0.55));

    float vig = smoothstep(1.1, 0.25, edge);
    col *= mix(0.35, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
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
    antialias: false,
    alpha: false,
    powerPreference: low ? 'default' : 'high-performance',
  })
  renderer.setPixelRatio(getDpr(low))
  renderer.setClearColor(0x08060e, 1)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50)
  camera.position.z = 2.4

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    },
    vertexShader: RETRO_VERTEX,
    fragmentShader: RETRO_FRAGMENT,
    depthWrite: false,
  })

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), material)
  scene.add(mesh)

  const composer = new EffectComposer(renderer, { multisampling: 0 })
  composer.addPass(new RenderPass(scene, camera))

  const bloom = new BloomEffect({
    intensity: low ? 1.05 : 1.45,
    luminanceThreshold: 0.12,
    luminanceSmoothing: 0.45,
    mipmapBlur: true,
  })
  const chroma = new ChromaticAberrationEffect({
    offset: new THREE.Vector2(0.0018, 0.0012),
    radialModulation: true,
    modulationOffset: 0.35,
  })
  const vignette = new VignetteEffect({ darkness: 0.65, offset: 0.28 })
  const grain = new NoiseEffect({ premultiply: true })
  grain.blendMode.opacity.value = 0.22
  const hue = new HueSaturationEffect({ hue: 0.02, saturation: 0.12 })
  const pixel = new PixelationEffect(2.5)
  pixel.blendMode.opacity.value = 0.18

  composer.addPass(
    new EffectPass(camera, bloom, chroma, hue, vignette, grain, pixel),
  )

  let width = 1
  let height = 1
  let raf = 0
  let running = false
  let time = 0
  let smoothMouse = new THREE.Vector2(0.5, 0.5)
  let targetMouse = new THREE.Vector2(0.5, 0.5)
  let mouseActive = false
  let removePointer: (() => void) | undefined

  const fitPlane = () => {
    const viewAspect = width / Math.max(height, 1)
    camera.aspect = viewAspect
    camera.updateProjectionMatrix()
    material.uniforms.uResolution.value.set(width, height)

    const dist = camera.position.z
    const vFov = THREE.MathUtils.degToRad(camera.fov)
    const visibleH = 2 * Math.tan(vFov / 2) * dist
    const visibleW = visibleH * viewAspect
    mesh.scale.set(visibleW * 1.08, visibleH * 1.08, 1)
  }

  let lastFrame = 0
  const tick = (now: number) => {
    if (!running) return
    const dt = options.reducedMotion
      ? 0
      : Math.min(0.05, lastFrame ? (now - lastFrame) / 1000 : 0.016)
    lastFrame = now

    if (!options.reducedMotion) {
      time += dt
      const drift = Math.sin(time * 0.15) * 0.04
      camera.position.x = drift
      camera.position.y = Math.cos(time * 0.11) * 0.03
      camera.lookAt(0, 0, 0)

      const lerp = mouseActive ? 0.08 : 0.03
      smoothMouse.lerp(targetMouse, lerp)
    }

    material.uniforms.uTime.value = time
    material.uniforms.uMouse.value.copy(smoothMouse)

    composer.render(dt)
    raf = requestAnimationFrame(tick)
  }

  return {
    setSize(w: number, h: number) {
      if (w < 2 || h < 2) return
      width = w
      height = h
      renderer.setSize(w, h, false)
      composer.setSize(w, h)
      fitPlane()
    },

    start() {
      if (running) return
      running = true
      const host = canvas.parentElement
      if (host && !options.reducedMotion) {
        removePointer = bindHeroPointer(host, (nx, ny, active) => {
          targetMouse.set(nx, ny)
          mouseActive = active
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
      mesh.geometry.dispose()
      material.dispose()
      composer.dispose()
      renderer.dispose()
      const gl = renderer.getContext()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
