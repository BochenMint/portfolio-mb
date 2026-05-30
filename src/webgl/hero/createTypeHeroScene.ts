import {
  BloomEffect,
  ChromaticAberrationEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  VignetteEffect,
} from 'postprocessing'
import type { HeroScene, HeroSceneOptions } from './heroSceneTypes'
import { bindHeroPointer, getDpr } from './heroSceneTypes'

const TYPE_VERTEX = /* glsl */ `
  uniform sampler2D uMap;
  uniform sampler2D uNoise;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uDispStrength;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec2 nUv = texture2D(uNoise, uv * 1.8 + uTime * 0.03).rg;
    vec2 m = (uMouse - 0.5) * 2.0;
    float breathe = sin(uTime * 1.2 + uv.y * 6.0) * 0.012;
    vec2 offset = (nUv - 0.5) * uDispStrength + m * 0.04 * uDispStrength;
    offset += vec2(breathe, breathe * 0.6);
    vec3 pos = position + normal * length(offset) * 0.35;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const TYPE_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform sampler2D uMap;
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  void main() {
    vec2 m = (uMouse - 0.5) * 0.02;
    float ca = 0.0035 + 0.002 * sin(uTime * 0.8);
    float r = texture2D(uMap, vUv + m + vec2(ca, 0.0)).r;
    float g = texture2D(uMap, vUv + m).g;
    float b = texture2D(uMap, vUv + m - vec2(ca, 0.0)).b;
    float a = texture2D(uMap, vUv + m).a;
    vec3 col = vec3(r, g, b);
    col += vec3(0.15, 0.25, 0.35) * (1.0 - a) * 0.15;
    gl_FragColor = vec4(col, a * 0.28);
  }
`

function buildTypeTexture(
  THREE: typeof import('three'),
  lines: string[],
  width: number,
  height: number,
): import('three').CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2d context unavailable')

  ctx.clearRect(0, 0, width, height)
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, 'rgba(240, 236, 228, 0.95)')
  gradient.addColorStop(1, 'rgba(200, 210, 230, 0.85)')
  ctx.fillStyle = gradient

  const fontSize = Math.round(width * 0.11)
  ctx.font = `700 ${fontSize}px "Bebas Neue", "Arial Narrow", sans-serif`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'

  const lineHeight = fontSize * 0.92
  const blockH = lines.length * lineHeight
  let y = height * 0.38 - blockH / 2 + lineHeight / 2

  for (const line of lines) {
    ctx.fillText(line.toUpperCase(), width * 0.06, y)
    y += lineHeight
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.needsUpdate = true
  return tex
}

function buildNoiseTexture(THREE: typeof import('three')): import('three').DataTexture {
  const size = 128
  const data = new Uint8Array(size * size * 4)
  for (let i = 0; i < size * size; i++) {
    const v = Math.random() * 255
    data[i * 4] = v
    data[i * 4 + 1] = v
    data[i * 4 + 2] = v
    data[i * 4 + 3] = 255
  }
  const tex = new THREE.DataTexture(data, size, size)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.needsUpdate = true
  return tex
}

export async function createTypeHeroScene(
  canvas: HTMLCanvasElement,
  lines: string[],
  options: HeroSceneOptions,
): Promise<HeroScene> {
  const THREE = await import('three')

  await document.fonts.load('700 1em "Bebas Neue"')

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(getDpr())
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40)
  camera.position.z = 3.2

  const textTex = buildTypeTexture(THREE, lines, 2048, 1024)
  const noiseTex = buildNoiseTexture(THREE)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: textTex },
      uNoise: { value: noiseTex },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uDispStrength: { value: options.reducedMotion ? 0.02 : 0.08 },
    },
    vertexShader: TYPE_VERTEX,
    fragmentShader: TYPE_FRAGMENT,
    transparent: true,
    depthWrite: false,
  })

  const segments = options.reducedMotion ? 32 : 64
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, segments, segments),
    material,
  )
  mesh.position.set(-0.15, 0.05, 0)
  scene.add(mesh)

  const composer = new EffectComposer(renderer, { multisampling: 0 })
  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(
    new EffectPass(
      camera,
      new BloomEffect({
        intensity: 1.1,
        luminanceThreshold: 0.35,
        luminanceSmoothing: 0.4,
      }),
      new ChromaticAberrationEffect({
        offset: new THREE.Vector2(0.0025, 0.0015),
        radialModulation: true,
        modulationOffset: 0.2,
      }),
      new VignetteEffect({ darkness: 0.4, offset: 0.35 }),
    ),
  )

  let width = 1
  let height = 1
  let raf = 0
  let running = false
  let time = 0
  let lastFrame = 0
  let smoothMouse = new THREE.Vector2(0.5, 0.5)
  let targetMouse = new THREE.Vector2(0.5, 0.5)
  let mouseActive = false
  let removePointer: (() => void) | undefined

  const fitPlane = () => {
    const viewAspect = width / Math.max(height, 1)
    camera.aspect = viewAspect
    camera.updateProjectionMatrix()
    const texAspect = 2
    const dist = camera.position.z
    const vFov = THREE.MathUtils.degToRad(camera.fov)
    const visibleH = 2 * Math.tan(vFov / 2) * dist
    const visibleW = visibleH * viewAspect
    let planeW = visibleW * 0.95
    let planeH = planeW / texAspect
    if (planeH > visibleH * 0.55) {
      planeH = visibleH * 0.55
      planeW = planeH * texAspect
    }
    mesh.scale.set(planeW, planeH, 1)
  }

  const tick = (now: number) => {
    if (!running) return
    const dt = options.reducedMotion
      ? 0
      : Math.min(0.05, lastFrame ? (now - lastFrame) / 1000 : 0.016)
    lastFrame = now

    if (!options.reducedMotion) {
      time += dt
      const lerp = mouseActive ? 0.1 : 0.04
      smoothMouse.lerp(targetMouse, lerp)
      mesh.rotation.y = Math.sin(time * 0.35) * 0.02
      mesh.rotation.x = Math.cos(time * 0.28) * 0.015
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
      textTex.dispose()
      noiseTex.dispose()
      composer.dispose()
      renderer.dispose()
      renderer.getContext().getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
