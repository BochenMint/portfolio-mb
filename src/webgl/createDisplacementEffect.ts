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
  uniform float uDissipation;
  uniform float uBrushRadius;
  uniform float uVelocity;
  varying vec2 vUv;

  void main() {
    vec4 info = texture2D(uTexture, vUv);
    float height = info.r;
    float vel = info.g;

    float left = texture2D(uTexture, vUv - vec2(uTexel.x, 0.0)).r;
    float right = texture2D(uTexture, vUv + vec2(uTexel.x, 0.0)).r;
    float up = texture2D(uTexture, vUv + vec2(0.0, uTexel.y)).r;
    float down = texture2D(uTexture, vUv - vec2(0.0, uTexel.y)).r;

    vel += (left + right + up + down) * 0.25 - height;
    vel *= uDissipation;
    height += vel;

    float dist = distance(vUv, uMouse);
    vel += smoothstep(uBrushRadius, 0.0, dist) * uVelocity;

    gl_FragColor = vec4(height, vel, 0.0, 1.0);
  }
`

const DISPLAY_VERTEX = /* glsl */ `
  uniform sampler2D uDisplacementMap;
  uniform float uVertexStrength;
  uniform float uProgress;
  uniform float uIntroStrength;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float disp = texture2D(uDisplacementMap, uv).r;
    float center = length(uv - 0.5);
    float intro = (1.0 - smoothstep(0.0, 0.72, center)) * uIntroStrength * (1.0 - uProgress);
    pos.z += (disp + intro) * uVertexStrength;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const DISPLAY_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform sampler2D uMap;
  uniform sampler2D uDisplacementMap;
  uniform float uDistortStrength;
  uniform float uProgress;
  uniform float uIntroStrength;
  varying vec2 vUv;

  void main() {
    vec2 texel = vec2(1.0 / 512.0);
    float h = texture2D(uDisplacementMap, vUv).r;
    float hL = texture2D(uDisplacementMap, vUv - vec2(texel.x, 0.0)).r;
    float hR = texture2D(uDisplacementMap, vUv + vec2(texel.x, 0.0)).r;
    float hD = texture2D(uDisplacementMap, vUv - vec2(0.0, texel.y)).r;
    float hU = texture2D(uDisplacementMap, vUv + vec2(0.0, texel.y)).r;
    vec2 grad = vec2(hR - hL, hU - hD);

    float center = length(vUv - 0.5);
    float intro = (1.0 - smoothstep(0.0, 0.65, center)) * uIntroStrength * (1.0 - uProgress);
    grad += vec2(intro * 0.15);

    vec2 uv = vUv + grad * uDistortStrength;
    gl_FragColor = texture2D(uMap, uv);
  }
`

export type DisplacementEffect = {
  setSize: (width: number, height: number) => void
  setMouse: (x: number, y: number, active: boolean) => void
  setIntroProgress: (t: number) => void
  start: () => void
  stop: () => void
  dispose: () => void
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
    alpha: false,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x0a0a0a, 1)

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

  const simMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: null as import('three').Texture | null },
      uTexel: { value: new THREE.Vector2(1 / size, 1 / size) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uDissipation: { value: options.dissipation },
      uBrushRadius: { value: options.brushRadius },
      uVelocity: { value: 0 },
    },
    vertexShader: SIM_VERTEX,
    fragmentShader: SIM_FRAGMENT,
  })

  const simQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial)
  simScene.add(simQuad)

  const displayScene = new THREE.Scene()
  const displayCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  displayCamera.position.z = 2.2

  const texture = await loadTexture(THREE, imageUrl)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter

  const displayMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: texture },
      uDisplacementMap: { value: readTarget.texture },
      uVertexStrength: { value: options.vertexStrength },
      uDistortStrength: { value: options.distortStrength },
      uProgress: { value: 0 },
      uIntroStrength: { value: options.introWaveStrength },
    },
    vertexShader: DISPLAY_VERTEX,
    fragmentShader: DISPLAY_FRAGMENT,
  })

  const geometry = new THREE.PlaneGeometry(1, 1, options.planeSegments, options.planeSegments)
  const displayMesh = new THREE.Mesh(geometry, displayMaterial)
  displayScene.add(displayMesh)

  let mouse = { x: 0.5, y: 0.5, active: false }
  let introProgress = 0
  let width = 1
  let height = 1
  let rafId = 0
  let running = false

  const fitPlane = () => {
    const imgAspect = texture.image
      ? (texture.image as HTMLImageElement).width / (texture.image as HTMLImageElement).height
      : 16 / 9
    const viewAspect = width / height
    if (viewAspect > imgAspect) {
      displayMesh.scale.set(viewAspect / imgAspect, 1, 1)
    } else {
      displayMesh.scale.set(1, imgAspect / viewAspect, 1)
    }
  }

  const stepSimulation = () => {
    simMaterial.uniforms.uTexture.value = readTarget.texture
    simMaterial.uniforms.uMouse.value.set(mouse.x, 1 - mouse.y)
    simMaterial.uniforms.uVelocity.value = mouse.active ? options.brushVelocity : 0

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
    renderer.render(displayScene, displayCamera)
    rafId = requestAnimationFrame(tick)
  }

  return {
    setSize(w: number, h: number) {
      if (w < 2 || h < 2) return
      width = w
      height = h
      renderer.setSize(w, h, false)
      displayCamera.aspect = w / h
      displayCamera.updateProjectionMatrix()
      fitPlane()
    },

    setMouse(x: number, y: number, active: boolean) {
      mouse = { x, y, active }
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

function loadTexture(
  THREE: ThreeModule,
  url: string,
): Promise<import('three').Texture> {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(url, resolve, undefined, reject)
  })
}
