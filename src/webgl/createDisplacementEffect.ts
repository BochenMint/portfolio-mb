import type { DisplacementOptions } from './displacementConfig'

type ThreeModule = typeof import('three')

const SIM_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const SIM_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform sampler2D uTexture;
  uniform vec2 uTexel;
  uniform vec2 uMouse;
  uniform float uAspect;
  uniform float uDissipation;
  uniform float uBrushRadius;
  uniform float uVelocity;
  uniform float uMouseSpeed;
  uniform float uWaveFrequency;
  uniform float uHeightClamp;
  uniform float uVelocityClamp;
  uniform float uIdleDamping;
  varying vec2 vUv;

  void main() {
    vec4 info = texture2D(uTexture, vUv);
    float height = info.r;
    float vel = info.g;

    float aspect = max(uAspect, 0.25);
    vec2 dx = vec2(uTexel.x / aspect, 0.0);
    vec2 dy = vec2(0.0, uTexel.y);

    float left = texture2D(uTexture, vUv - dx).r;
    float right = texture2D(uTexture, vUv + dx).r;
    float up = texture2D(uTexture, vUv + dy).r;
    float down = texture2D(uTexture, vUv - dy).r;

    vel += (left + right + up + down) * uWaveFrequency - height * uWaveFrequency;
    vel *= uDissipation;
    height += vel;

    vec2 toMouse = (vUv - uMouse) * vec2(aspect, 1.0);
    float dist = length(toMouse);
    float brush = 1.0 - smoothstep(uBrushRadius * 0.08, uBrushRadius, dist);
    float speedBoost = 0.4 + min(uMouseSpeed, 2.8) * 0.55;
    vel += brush * uVelocity * speedBoost;

    height = clamp(height, -uHeightClamp, uHeightClamp);
    vel = clamp(vel, -uVelocityClamp, uVelocityClamp);

    height *= uIdleDamping;
    vel *= uIdleDamping;

    gl_FragColor = vec4(height, vel, 0.0, 1.0);
  }
`

const DISPLAY_VERTEX = /* glsl */ `
  uniform sampler2D uDisplacementMap;
  uniform float uVertexStrength;
  uniform float uMaxVertexOffset;
  uniform float uProgress;
  uniform float uIntroStrength;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float disp = texture2D(uDisplacementMap, uv).r;
    float center = length(uv - 0.5);
    float intro = (1.0 - smoothstep(0.0, 0.78, center)) * uIntroStrength * (1.0 - uProgress);
    float z = (disp + intro) * uVertexStrength;
    z = clamp(z, -uMaxVertexOffset, uMaxVertexOffset);
    pos.z += z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const DISPLAY_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform sampler2D uMap;
  uniform sampler2D uDisplacementMap;
  uniform vec2 uGradTexel;
  uniform float uDistortStrength;
  uniform float uMaxDistort;
  uniform float uChromaticStrength;
  uniform float uProgress;
  uniform float uIntroStrength;
  varying vec2 vUv;

  void main() {
    float h = texture2D(uDisplacementMap, vUv).r;
    float hL = texture2D(uDisplacementMap, vUv - vec2(uGradTexel.x, 0.0)).r;
    float hR = texture2D(uDisplacementMap, vUv + vec2(uGradTexel.x, 0.0)).r;
    float hD = texture2D(uDisplacementMap, vUv - vec2(0.0, uGradTexel.y)).r;
    float hU = texture2D(uDisplacementMap, vUv + vec2(0.0, uGradTexel.y)).r;
    vec2 grad = vec2(hR - hL, hU - hD);

    float center = length(vUv - 0.5);
    float intro = (1.0 - smoothstep(0.0, 0.78, center)) * uIntroStrength * (1.0 - uProgress);
    grad += vec2(intro * 0.04);

    vec2 offset = clamp(grad * uDistortStrength, -uMaxDistort, uMaxDistort);
    vec2 uv = clamp(vUv + offset, 0.001, 0.999);
    vec3 col = texture2D(uMap, uv).rgb;

    if (uChromaticStrength > 0.0001) {
      vec2 chroma = grad * uChromaticStrength;
      col.r = texture2D(uMap, clamp(vUv + offset + chroma, 0.001, 0.999)).r;
      col.b = texture2D(uMap, clamp(vUv + offset - chroma, 0.001, 0.999)).b;
    }

    gl_FragColor = vec4(col, 1.0);
  }
`

export type DisplacementEffect = {
  setSize: (width: number, height: number) => void
  setMouse: (x: number, y: number, active: boolean, speed?: number) => void
  setIntroProgress: (t: number) => void
  start: () => void
  stop: () => void
  dispose: () => void
  readonly ready: boolean
}

export async function createDisplacementEffect(
  canvas: HTMLCanvasElement,
  imageUrl: string,
  options: DisplacementOptions,
): Promise<DisplacementEffect> {
  const THREE = await import('three')

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: true,
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const simScene = new THREE.Scene()
  const simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  const canFloat = renderer.capabilities.isWebGL2
  const rtOpts = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: canFloat ? THREE.HalfFloatType : THREE.UnsignedByteType,
  }

  const size = options.simResolution
  let readTarget = new THREE.WebGLRenderTarget(size, size, rtOpts)
  let writeTarget = new THREE.WebGLRenderTarget(size, size, rtOpts)
  clearRenderTarget(renderer, readTarget)
  clearRenderTarget(renderer, writeTarget)

  const simMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: null as import('three').Texture | null },
      uTexel: { value: new THREE.Vector2(1 / size, 1 / size) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uAspect: { value: 1 },
      uDissipation: { value: options.dissipation },
      uBrushRadius: { value: options.brushRadius },
      uVelocity: { value: 0 },
      uMouseSpeed: { value: 0 },
      uWaveFrequency: { value: options.waveFrequency },
      uHeightClamp: { value: options.heightClamp },
      uVelocityClamp: { value: options.velocityClamp },
      uIdleDamping: { value: 1 },
    },
    vertexShader: SIM_VERTEX,
    fragmentShader: SIM_FRAGMENT,
  })

  const simQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial)
  simScene.add(simQuad)

  const displayScene = new THREE.Scene()
  const displayCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  displayCamera.position.z = 2.2

  const maxVertexOffset = Math.min(options.vertexStrength * options.heightClamp * 1.15, 0.18)

  const texture = await loadTexture(THREE, imageUrl)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter

  const displayMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: texture },
      uDisplacementMap: { value: readTarget.texture },
      uGradTexel: { value: new THREE.Vector2(1 / size, 1 / size) },
      uVertexStrength: { value: options.vertexStrength },
      uMaxVertexOffset: { value: maxVertexOffset },
      uDistortStrength: { value: options.distortStrength },
      uMaxDistort: { value: options.distortStrength * 1.35 },
      uChromaticStrength: { value: options.chromaticStrength },
      uProgress: { value: 0 },
      uIntroStrength: { value: options.introWaveStrength },
    },
    vertexShader: DISPLAY_VERTEX,
    fragmentShader: DISPLAY_FRAGMENT,
    transparent: true,
  })

  const geometry = new THREE.PlaneGeometry(1, 1, options.planeSegments, options.planeSegments)
  const displayMesh = new THREE.Mesh(geometry, displayMaterial)
  displayScene.add(displayMesh)

  let targetMouse = { x: 0.5, y: 0.5, active: false, speed: 0 }
  let smoothMouse = { x: 0.5, y: 0.5, speed: 0 }
  let introProgress = 0
  let width = 1
  let height = 1
  let rafId = 0
  let running = false
  let ready = false

  const updateAspectUniforms = () => {
    const viewAspect = width / Math.max(height, 1)
    simMaterial.uniforms.uAspect.value = viewAspect
    const gradX = (1 / size) / Math.max(viewAspect, 0.25)
    displayMaterial.uniforms.uGradTexel.value.set(gradX, 1 / size)
  }

  const fitPlane = () => {
    const imgAspect = texture.image
      ? (texture.image as HTMLImageElement).width / (texture.image as HTMLImageElement).height
      : 16 / 9
    const containerAspect = width / Math.max(height, 1)
    if (containerAspect > imgAspect) {
      displayMesh.scale.set(containerAspect / imgAspect, 1, 1)
    } else {
      displayMesh.scale.set(1, imgAspect / containerAspect, 1)
    }
    updateAspectUniforms()
  }

  const stepSimulation = () => {
    const lerp = targetMouse.active ? 0.14 : 0.06
    smoothMouse.x += (targetMouse.x - smoothMouse.x) * lerp
    smoothMouse.y += (targetMouse.y - smoothMouse.y) * lerp
    smoothMouse.speed += (targetMouse.speed - smoothMouse.speed) * (targetMouse.active ? 0.22 : 0.08)

    const idleDamping = targetMouse.active ? 1 : 0.952
    simMaterial.uniforms.uIdleDamping.value = idleDamping
    simMaterial.uniforms.uDissipation.value = targetMouse.active
      ? options.dissipation
      : Math.min(options.dissipation + 0.008, 0.99)

    simMaterial.uniforms.uTexture.value = readTarget.texture
    simMaterial.uniforms.uMouse.value.set(smoothMouse.x, 1 - smoothMouse.y)
    simMaterial.uniforms.uVelocity.value = targetMouse.active ? options.brushVelocity : 0
    simMaterial.uniforms.uMouseSpeed.value = targetMouse.active ? smoothMouse.speed : 0

    renderer.setRenderTarget(writeTarget)
    renderer.render(simScene, simCamera)
    renderer.setRenderTarget(null)

    const swap = readTarget
    readTarget = writeTarget
    writeTarget = swap

    displayMaterial.uniforms.uDisplacementMap.value = readTarget.texture
  }

  const tick = () => {
    if (!running) return
    stepSimulation()
    displayMaterial.uniforms.uProgress.value = introProgress
    renderer.setClearColor(0x000000, 0)
    renderer.render(displayScene, displayCamera)
    rafId = requestAnimationFrame(tick)
  }

  ready = true

  return {
    get ready() {
      return ready
    },

    setSize(w: number, h: number) {
      if (w < 2 || h < 2) return
      width = w
      height = h
      renderer.setSize(w, h, false)
      displayCamera.aspect = w / h
      displayCamera.updateProjectionMatrix()
      fitPlane()
    },

    setMouse(x: number, y: number, active: boolean, speed = 0) {
      const cx = Number.isFinite(x) ? Math.min(1, Math.max(0, x)) : smoothMouse.x
      const cy = Number.isFinite(y) ? Math.min(1, Math.max(0, y)) : smoothMouse.y
      const sp = active && Number.isFinite(speed) ? Math.min(3.2, Math.max(0, speed)) : 0
      targetMouse = { x: cx, y: cy, active, speed: sp }
    },

    setIntroProgress(t: number) {
      introProgress = Math.min(1, Math.max(0, t))
    },

    start() {
      if (running) return
      running = true
      rafId = requestAnimationFrame(tick)
    },

    stop() {
      running = false
      cancelAnimationFrame(rafId)
    },

    dispose() {
      running = false
      cancelAnimationFrame(rafId)
      texture.dispose()
      geometry.dispose()
      displayMaterial.dispose()
      simMaterial.dispose()
      readTarget.dispose()
      writeTarget.dispose()
      simQuad.geometry.dispose()
      renderer.dispose()
      const gl = renderer.getContext()
      const ext = gl.getExtension('WEBGL_lose_context')
      ext?.loseContext()
    },
  }
}

function clearRenderTarget(
  renderer: import('three').WebGLRenderer,
  target: import('three').WebGLRenderTarget,
) {
  const prev = renderer.getRenderTarget()
  renderer.setRenderTarget(target)
  renderer.setClearColor(0x000000, 0)
  renderer.clear()
  renderer.setRenderTarget(prev)
}

function loadTexture(
  THREE: ThreeModule,
  url: string,
): Promise<import('three').Texture> {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(url, resolve, undefined, reject)
  })
}
