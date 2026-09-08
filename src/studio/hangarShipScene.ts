import type { HeroScene, HeroSceneOptions } from '../webgl/hero/heroSceneTypes'
import { getDpr } from '../webgl/hero/heroSceneTypes'

export type HangarShipScene = HeroScene & { hullReady: boolean }

/** Soft gold/space studio — hangar reflections, not the game skybox. */
function buildHangarEnvMap(THREE: typeof import('three')) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size * 2
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const sky = ctx.createLinearGradient(0, 0, 0, size)
  sky.addColorStop(0, '#070b14')
  sky.addColorStop(0.42, '#101828')
  sky.addColorStop(0.72, '#1a2238')
  sky.addColorStop(1, '#0c0e12')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, size * 2, size)

  const gold = ctx.createRadialGradient(size * 1.42, size * 0.28, 0, size * 1.42, size * 0.28, size * 0.48)
  gold.addColorStop(0, 'rgba(232, 196, 96, 0.72)')
  gold.addColorStop(0.4, 'rgba(201, 162, 39, 0.28)')
  gold.addColorStop(1, 'rgba(201, 162, 39, 0)')
  ctx.fillStyle = gold
  ctx.fillRect(0, 0, size * 2, size)

  const tex = new THREE.CanvasTexture(canvas)
  tex.mapping = THREE.EquirectangularReflectionMapping
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function isWhiteClayHull(root: import('three').Object3D, THREE: typeof import('three')): boolean {
  let samples = 0
  let bright = 0
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return
    const list = Array.isArray(obj.material) ? obj.material : [obj.material]
    for (const mat of list) {
      if (!mat || !('color' in mat)) continue
      const color = (mat as import('three').MeshStandardMaterial).color
      if (!color) continue
      samples += 1
      const lum = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b
      if (lum > 0.78 && color.r > 0.75 && color.g > 0.75 && color.b > 0.75) bright += 1
    }
  })
  return samples > 0 && bright / samples >= 0.55
}

function hasWebGL(): boolean {
  try {
    const probe = document.createElement('canvas')
    return Boolean(probe.getContext('webgl2') || probe.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * Thin hangar preview — calls the game ship builder, does not fork hull/materials.
 */
export async function createHangarShipScene(
  canvas: HTMLCanvasElement,
  options: HeroSceneOptions,
): Promise<HangarShipScene> {
  if (!hasWebGL()) {
    return {
      hullReady: false,
      setSize() {},
      start() {},
      stop() {},
      dispose() {},
    }
  }

  const THREE = await import('three')
  const { buildShipV2 } = await import('../v4/ship/buildShipV2')
  const low = options.lowPower ?? false
  const reduced = options.reducedMotion

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !low,
    alpha: true,
    powerPreference: low ? 'default' : 'high-performance',
  })
  renderer.setPixelRatio(getDpr(low))
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.08
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()

  const envTex = buildHangarEnvMap(THREE)
  const pmrem = new THREE.PMREMGenerator(renderer)
  let envMap: import('three').Texture | null = null
  if (envTex) {
    envMap = pmrem.fromEquirectangular(envTex).texture
    scene.environment = envMap
    envTex.dispose()
  }
  pmrem.dispose()

  const camera = new THREE.PerspectiveCamera(34, 1, 0.2, 200)
  camera.position.set(16, 6.5, 20)

  scene.add(new THREE.AmbientLight(0x9aa8c4, 0.32))
  const key = new THREE.DirectionalLight(0xf0d48a, low ? 1.55 : 2.15)
  key.position.set(14, 18, 8)
  const fill = new THREE.DirectionalLight(0x6a88c8, 0.55)
  fill.position.set(-12, 2, 10)
  const rim = new THREE.DirectionalLight(0xc9a227, 0.85)
  rim.position.set(-6, 8, -16)
  scene.add(key, fill, rim)

  const idle = new THREE.Group()
  idle.name = 'hangar-ship-idle'
  scene.add(idle)

  let ship: Awaited<ReturnType<typeof buildShipV2>> | null = null
  let hullReady = false
  let radius = 14
  let raf = 0
  let running = false
  let elapsed = 0
  let last = 0

  const manager = new THREE.LoadingManager()

  try {
    ship = await buildShipV2(manager, envMap)
  } catch {
    ship = null
  }

  if (ship && !isWhiteClayHull(ship.group, THREE)) {
    const box = new THREE.Box3().setFromObject(ship.group)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    ship.group.position.sub(center)
    radius = Math.max(size.x, size.y, size.z) * 0.52
    idle.add(ship.group)
    hullReady = true
  } else {
    ship?.dispose()
    ship = null
  }

  const frameCamera = (w: number, h: number) => {
    const aspect = Math.max(w, 1) / Math.max(h, 1)
    camera.aspect = aspect
    const fov = camera.fov * (Math.PI / 180)
    const dist = (radius / Math.sin(fov / 2)) * (aspect < 1.1 ? 0.7 : 0.54)
    camera.position.set(dist * 0.52, dist * 0.22, dist * 0.74)
    camera.lookAt(0, radius * 0.04, 0)
    camera.updateProjectionMatrix()
  }

  const tick = (now: number) => {
    if (!running) return
    const t = now / 1000
    const dt = last === 0 ? 0.016 : Math.min(0.05, t - last)
    last = t
    elapsed += dt

    if (!reduced) {
      idle.rotation.y = Math.sin(elapsed * 0.22) * 0.16
      idle.position.y = Math.sin(elapsed * 0.7) * 0.14
      idle.rotation.x = Math.sin(elapsed * 0.31) * 0.03
    }

    ship?.updateThrust(0.08, elapsed)
    renderer.render(scene, camera)
    raf = requestAnimationFrame(tick)
  }

  return {
    hullReady,
    setSize(w, h) {
      renderer.setSize(w, h, false)
      frameCamera(w, h)
    },
    start() {
      if (running || !hullReady) return
      running = true
      last = 0
      raf = requestAnimationFrame(tick)
    },
    stop() {
      running = false
      cancelAnimationFrame(raf)
    },
    dispose() {
      running = false
      cancelAnimationFrame(raf)
      ship?.dispose()
      ship = null
      envMap?.dispose()
      renderer.dispose()
    },
  }
}
