import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
} from 'postprocessing'
import type { HeroScene, HeroSceneOptions } from './heroSceneTypes'
import { bindHeroPointer, getDpr, HERO_ROTATION_DAMP } from './heroSceneTypes'

// ─── Palette ────────────────────────────────────────────────────────────────
const C_INK = 0x080807
const C_MOON = 0x0c0b0a
const C_PAPER = 0xeceae4
const C_ACCENT = 0xf5a524
const C_RIM = 0xffb84d
const C_INDIGO = 0x5b6bff

// ─── Seeded pseudo-random (deterministic for SSR safety) ────────────────────
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ─── Build spherical particle BufferGeometry ─────────────────────────────────
function buildParticleGeo(
  THREE: typeof import('three'),
  count: number,
  innerR: number,
  outerR: number,
  seed: number,
): {
  geo: import('three').BufferGeometry
  phases: Float32Array
  speeds: Float32Array
} {
  const rand = mulberry32(seed)
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)
  const speeds = new Float32Array(count)

  const paperColor = new THREE.Color(C_PAPER)
  const accentColor = new THREE.Color(C_ACCENT)
  const rimColor = new THREE.Color(C_RIM)
  const indigoColor = new THREE.Color(C_INDIGO)

  for (let i = 0; i < count; i++) {
    // uniform spherical shell distribution
    const u = rand()
    const v = rand()
    const theta = 2 * Math.PI * u
    const phi = Math.acos(2 * v - 1)
    const r = innerR + rand() * (outerR - innerR)

    // widen on X so the field fills full screen width (16:9 / ultrawide)
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 1.7
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    // mix of paper, accent and rim
    const t = rand()
    let c: import('three').Color
    if (t < 0.5) c = paperColor
    else if (t < 0.74) c = accentColor
    else if (t < 0.88) c = rimColor
    else c = indigoColor
    // slight brightness variation
    const bright = 0.6 + rand() * 0.4
    colors[i * 3] = c.r * bright
    colors[i * 3 + 1] = c.g * bright
    colors[i * 3 + 2] = c.b * bright

    sizes[i] = 0.4 + rand() * 1.6
    phases[i] = rand() * Math.PI * 2
    speeds[i] = 0.4 + rand() * 0.8
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  return { geo, phases, speeds }
}

export async function createParticlesHeroScene(
  canvas: HTMLCanvasElement,
  options: HeroSceneOptions,
): Promise<HeroScene> {
  const THREE = await import('three')
  const low = options.lowPower ?? false
  const particleCount = low ? 2600 : 7200

  // ── Renderer ────────────────────────────────────────────────────────────
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

  // ── Scene ───────────────────────────────────────────────────────────────
  const scene = new THREE.Scene()
  // dark fog for depth
  scene.fog = new THREE.FogExp2(C_INK, low ? 0.035 : 0.025)

  // ── Camera ──────────────────────────────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 80)
  camera.position.set(0, 0, 7.5)

  // ── Lighting ─────────────────────────────────────────────────────────────
  const ambient = new THREE.AmbientLight(0x100e0a, 0.8)
  // warm rim light from upper-right (crescent effect)
  const rimLight = new THREE.DirectionalLight(C_RIM, low ? 1.6 : 2.6)
  rimLight.position.set(3.5, 3, 2)
  // cool backlight for silhouette
  const backLight = new THREE.DirectionalLight(0x1a2040, 0.5)
  backLight.position.set(-2, -2, -3)
  scene.add(ambient, rimLight, backLight)

  // ── Moon sphere ──────────────────────────────────────────────────────────
  const moonGeo = new THREE.SphereGeometry(1.65, low ? 32 : 64, low ? 32 : 64)
  const moonMat = new THREE.MeshStandardMaterial({
    color: C_MOON,
    roughness: 0.92,
    metalness: 0.04,
  })
  const moonMesh = new THREE.Mesh(moonGeo, moonMat)
  moonMesh.position.set(1.9, 0.1, 0)
  scene.add(moonMesh)

  // thin emissive crescent ring overlay (rim glow)
  const crescentGeo = new THREE.TorusGeometry(1.68, 0.05, low ? 16 : 32, low ? 48 : 96)
  const crescentMat = new THREE.MeshBasicMaterial({
    color: C_RIM,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const crescentMesh = new THREE.Mesh(crescentGeo, crescentMat)
  crescentMesh.position.set(1.9, 0.1, 0)
  crescentMesh.rotation.x = 0.3
  crescentMesh.rotation.y = 0.5
  scene.add(crescentMesh)

  // ── Nebula glow behind the moon (cosmic colour depth) ─────────────────────
  const nebCanvas = document.createElement('canvas')
  nebCanvas.width = nebCanvas.height = 256
  const nctx = nebCanvas.getContext('2d')!
  const ng = nctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  ng.addColorStop(0, 'rgba(255,170,80,0.5)')
  ng.addColorStop(0.4, 'rgba(120,95,255,0.2)')
  ng.addColorStop(1, 'rgba(0,0,0,0)')
  nctx.fillStyle = ng
  nctx.fillRect(0, 0, 256, 256)
  const nebTex = new THREE.CanvasTexture(nebCanvas)
  const nebGeo = new THREE.PlaneGeometry(16, 16)
  const nebMat = new THREE.MeshBasicMaterial({
    map: nebTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.9,
    fog: false,
  })
  const nebula = new THREE.Mesh(nebGeo, nebMat)
  nebula.position.set(2.3, 0.4, -5)
  scene.add(nebula)

  // ── Particle field ────────────────────────────────────────────────────────
  const { geo: particleGeo, phases, speeds } = buildParticleGeo(
    THREE,
    particleCount,
    low ? 2.4 : 2.8,
    low ? 6.5 : 9.0,
    0xdeadbeef,
  )

  const particleMat = new THREE.PointsMaterial({
    size: low ? 0.03 : 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  })

  const particleField = new THREE.Points(particleGeo, particleMat)
  const particleGroup = new THREE.Group()
  particleGroup.add(particleField)
  scene.add(particleGroup)

  // ── Postprocessing ─────────────────────────────────────────────────────
  const composer = new EffectComposer(renderer, { multisampling: low ? 0 : 4 })
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new BloomEffect({
    intensity: low ? 0.5 : 1.2,
    luminanceThreshold: low ? 0.75 : 0.5,
    luminanceSmoothing: 0.35,
    mipmapBlur: !low,
  })
  composer.addPass(new EffectPass(camera, bloom))

  // ── Animation state ────────────────────────────────────────────────────
  let raf = 0
  let running = false
  let time = 0
  let lastFrame = 0
  let targetRotX = 0
  let targetRotY = 0
  let smoothRotX = 0
  let smoothRotY = 0
  let removePointer: (() => void) | undefined
  let cursorNX = 0.5
  let cursorNY = 0.5
  let cursorActive = false
  let aspect = 1

  // working buffers
  const posAttr = particleGeo.getAttribute('position') as import('three').BufferAttribute
  const origPositions = new Float32Array(posAttr.array)
  const curPositions = new Float32Array(origPositions)
  const _cursor = new THREE.Vector3()

  const tick = (now: number) => {
    if (!running) return
    const dt = options.reducedMotion
      ? 0
      : Math.min(0.05, lastFrame ? (now - lastFrame) / 1000 : 0.016)
    lastFrame = now

    if (!options.reducedMotion) {
      time += dt

      smoothRotX += (targetRotX - smoothRotX) * HERO_ROTATION_DAMP
      smoothRotY += (targetRotY - smoothRotY) * HERO_ROTATION_DAMP

      // slow drift rotation of particle field
      particleGroup.rotation.y = smoothRotY * 0.4 + time * 0.025
      particleGroup.rotation.x = smoothRotX * 0.3 + Math.sin(time * 0.07) * 0.04

      // moon subtle parallax
      moonMesh.rotation.y = smoothRotY * 0.15
      moonMesh.rotation.x = smoothRotX * 0.1
      crescentMesh.rotation.z = time * 0.008
      nebMat.opacity = 0.78 + Math.sin(time * 0.5) * 0.12

      // rim light pulse for crescent flicker
      rimLight.intensity = (low ? 1.8 : 2.9) + Math.sin(time * 0.9) * 0.35

      // per-particle drift + cursor scatter (repel near pointer, spring back)
      const positions = posAttr.array as Float32Array
      let useCursor = false
      let lcx = 0
      let lcy = 0
      if (cursorActive) {
        const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z
        const halfW = halfH * aspect
        _cursor.set((cursorNX - 0.5) * 2 * halfW, (cursorNY - 0.5) * 2 * halfH, 0)
        particleGroup.updateMatrixWorld()
        particleGroup.worldToLocal(_cursor)
        lcx = _cursor.x
        lcy = _cursor.y
        useCursor = true
      }
      const R = 3.3
      const R2 = R * R
      const STR = 3.6
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const phase = phases[i]
        const speed = speeds[i]
        let tx = origPositions[i3] + Math.sin(time * speed + phase) * 0.06
        let ty = origPositions[i3 + 1] + Math.cos(time * speed * 0.7 + phase) * 0.06
        let tz = origPositions[i3 + 2] + Math.sin(time * speed + phase) * 0.03
        if (useCursor) {
          const dx = tx - lcx
          const dy = ty - lcy
          const d2 = dx * dx + dy * dy
          if (d2 < R2) {
            const d = Math.sqrt(d2) || 0.0001
            const f = 1 - d / R
            const push = f * f * STR
            tx += (dx / d) * push
            ty += (dy / d) * push
            tz += f * 1.0
          }
        }
        curPositions[i3] += (tx - curPositions[i3]) * 0.16
        curPositions[i3 + 1] += (ty - curPositions[i3 + 1]) * 0.16
        curPositions[i3 + 2] += (tz - curPositions[i3 + 2]) * 0.16
        positions[i3] = curPositions[i3]
        positions[i3 + 1] = curPositions[i3 + 1]
        positions[i3 + 2] = curPositions[i3 + 2]
      }
      posAttr.needsUpdate = true
    }

    composer.render(dt)
    raf = requestAnimationFrame(tick)
  }

  return {
    setSize(w: number, h: number) {
      if (w < 2 || h < 2) return
      renderer.setSize(w, h, false)
      composer.setSize(w, h)
      aspect = w / Math.max(h, 1)
      camera.aspect = aspect
      camera.updateProjectionMatrix()
    },

    start() {
      if (running) return
      running = true
      if (!options.reducedMotion) {
        const host = canvas.parentElement
        if (host) {
          removePointer = bindHeroPointer(host, (nx, ny, active) => {
            cursorNX = nx
            cursorNY = ny
            cursorActive = active
            const px = (nx - 0.5) * 2
            const py = (ny - 0.5) * 2
            targetRotX = active ? py * 0.35 : 0
            targetRotY = active ? px * 0.4 : 0
          })
        }
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
      moonGeo.dispose()
      moonMat.dispose()
      crescentGeo.dispose()
      crescentMat.dispose()
      nebGeo.dispose()
      nebMat.dispose()
      nebTex.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      composer.dispose()
      renderer.dispose()
      renderer.getContext().getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
