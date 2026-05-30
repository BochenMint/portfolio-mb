import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
} from 'postprocessing'
import type { HeroScene, HeroSceneOptions } from './heroSceneTypes'
import { bindHeroPointer, getDpr, HERO_ROTATION_DAMP } from './heroSceneTypes'

const RING_COUNT = 5
const RADIAL_LINES = 32
const ACCENT = 0xffe800

export async function createOrbitHeroScene(
  canvas: HTMLCanvasElement,
  options: HeroSceneOptions,
): Promise<HeroScene> {
  const THREE = await import('three')
  const low = options.lowPower ?? false
  const segments = low ? 64 : 128
  const tubeSegments = low ? 8 : 12

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !low,
    alpha: true,
    powerPreference: low ? 'default' : 'high-performance',
  })
  renderer.setPixelRatio(getDpr(low))
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x080807, low ? 0.055 : 0.045)

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80)
  camera.position.set(0, 0, 9.5)

  const ambient = new THREE.AmbientLight(0xf2efe8, 0.38)
  const key = new THREE.DirectionalLight(0xffffff, 1.15)
  key.position.set(4, 6, 8)
  const rim = new THREE.DirectionalLight(0x88aaff, 0.5)
  rim.position.set(-6, -2, 4)
  const accentLight = new THREE.PointLight(ACCENT, low ? 0.6 : 1.2, 12)
  accentLight.position.set(0, 3.5, 2)
  scene.add(ambient, key, rim, accentLight)

  const orbitGroup = new THREE.Group()
  scene.add(orbitGroup)

  const lineMat = new THREE.LineBasicMaterial({
    color: 0xe8e4dc,
    transparent: true,
    opacity: 0.32,
  })

  const radialPoints: import('three').Vector3[] = []
  for (let i = 0; i < RADIAL_LINES; i++) {
    const a = (i / RADIAL_LINES) * Math.PI * 2
    radialPoints.push(new THREE.Vector3(0, 0, 0))
    radialPoints.push(new THREE.Vector3(Math.cos(a) * 4.2, Math.sin(a) * 4.2, 0))
  }
  const radialGeo = new THREE.BufferGeometry().setFromPoints(radialPoints)
  orbitGroup.add(new THREE.LineSegments(radialGeo, lineMat))

  const ringMeshes: import('three').Mesh[] = []
  for (let i = 0; i < RING_COUNT; i++) {
    const radius = 1.15 + i * 0.72
    const tube = 0.012 + i * 0.004
    const geo = new THREE.TorusGeometry(radius, tube, tubeSegments, segments)
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xd8d4cc,
      metalness: 0.88,
      roughness: 0.18,
      clearcoat: 0.55,
      clearcoatRoughness: 0.25,
      transparent: true,
      opacity: 0.24 + i * 0.09,
    })
    const ring = new THREE.Mesh(geo, mat)
    ring.rotation.x = Math.PI / 2 + i * 0.08
    ring.rotation.y = i * 0.35
    orbitGroup.add(ring)
    ringMeshes.push(ring)
  }

  const accentGeo = new THREE.TorusGeometry(1.15, 0.032, tubeSegments, segments / 2, Math.PI * 0.14)
  const accentMat = new THREE.MeshPhysicalMaterial({
    color: ACCENT,
    emissive: ACCENT,
    emissiveIntensity: low ? 1.6 : 2.4,
    metalness: 0.15,
    roughness: 0.35,
  })
  const accentRing = new THREE.Mesh(accentGeo, accentMat)
  accentRing.rotation.x = Math.PI / 2
  accentRing.rotation.z = -0.4
  orbitGroup.add(accentRing)

  const glint = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, low ? 12 : 16, low ? 12 : 16),
    new THREE.MeshBasicMaterial({ color: ACCENT }),
  )
  glint.position.set(0, 3.55, 0)
  orbitGroup.add(glint)

  const composer = new EffectComposer(renderer, { multisampling: low ? 0 : 4 })
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new BloomEffect({
    intensity: low ? 0.55 : 0.85,
    luminanceThreshold: 0.55,
    luminanceSmoothing: 0.35,
    mipmapBlur: true,
  })
  composer.addPass(new EffectPass(camera, bloom))

  let raf = 0
  let running = false
  let time = 0
  let lastFrame = 0
  let targetRotX = 0
  let targetRotY = 0
  let smoothRotX = 0
  let smoothRotY = 0
  let removePointer: (() => void) | undefined

  const tick = (now: number) => {
    if (!running) return
    const dt = options.reducedMotion
      ? 0
      : Math.min(0.05, lastFrame ? (now - lastFrame) / 1000 : 0.016)
    lastFrame = now

    if (!options.reducedMotion) {
      time += dt
      orbitGroup.rotation.z += dt * 0.1
      smoothRotX += (targetRotX - smoothRotX) * HERO_ROTATION_DAMP
      smoothRotY += (targetRotY - smoothRotY) * HERO_ROTATION_DAMP
      orbitGroup.rotation.x = smoothRotX
      orbitGroup.rotation.y = smoothRotY + time * 0.07

      ringMeshes.forEach((ring, i) => {
        ring.rotation.z += dt * (0.035 + i * 0.012) * (i % 2 === 0 ? 1 : -1)
      })
      accentRing.rotation.z += dt * 0.16
      glint.position.x = Math.sin(time * 0.9) * 0.08
      glint.position.y = 3.55 + Math.cos(time * 1.1) * 0.06
      accentLight.intensity = (low ? 0.6 : 1.2) + Math.sin(time * 1.4) * 0.15
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
    },

    start() {
      if (running) return
      running = true
      const host = canvas.parentElement
      if (host && !options.reducedMotion) {
        removePointer = bindHeroPointer(host, (nx, ny, active) => {
          const px = (nx - 0.5) * 2
          const py = (ny - 0.5) * 2
          targetRotX = active ? py * 0.32 : 0
          targetRotY = active ? px * 0.42 : 0
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
      radialGeo.dispose()
      lineMat.dispose()
      ringMeshes.forEach((m) => {
        m.geometry.dispose()
        ;(m.material as import('three').Material).dispose()
      })
      accentGeo.dispose()
      accentMat.dispose()
      glint.geometry.dispose()
      ;(glint.material as import('three').Material).dispose()
      composer.dispose()
      renderer.dispose()
      renderer.getContext().getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
