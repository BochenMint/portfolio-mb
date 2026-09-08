import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  GodRaysEffect,
  KernelSize,
  RenderPass,
} from 'postprocessing'
import type { HeroScene, HeroSceneOptions } from './heroSceneTypes'
import { bindHeroPointer, getDpr, HERO_ROTATION_DAMP } from './heroSceneTypes'

// ─── Palette ────────────────────────────────────────────────────────────────
const C_SUN = 0xfff2d6
const C_WARM_LIGHT = 0xffe0b0

// Warm procedural env-map → clear glass picks up subtle sunset reflections.
function buildEnvMap(THREE: typeof import('three')) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size * 2
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createLinearGradient(0, 0, 0, size)
  grad.addColorStop(0.0, '#0a0816')
  grad.addColorStop(0.45, '#241332')
  grad.addColorStop(0.7, '#a8460f')
  grad.addColorStop(0.88, '#f5a524')
  grad.addColorStop(1.0, '#ffe6a8')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size * 2, size)
  // bright sun hotspot upper-right
  const sun = ctx.createRadialGradient(size * 1.55, size * 0.22, 0, size * 1.55, size * 0.22, size * 0.4)
  sun.addColorStop(0, 'rgba(255,245,220,0.95)')
  sun.addColorStop(0.45, 'rgba(255,190,90,0.4)')
  sun.addColorStop(1, 'rgba(255,150,50,0)')
  ctx.fillStyle = sun
  ctx.fillRect(0, 0, size * 2, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.mapping = THREE.EquirectangularReflectionMapping
  return tex
}

export async function createOrbitHeroScene(
  canvas: HTMLCanvasElement,
  options: HeroSceneOptions,
): Promise<HeroScene> {
  const THREE = await import('three')
  const low = options.lowPower ?? false

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

  const envTex = buildEnvMap(THREE)
  const pmrem = new THREE.PMREMGenerator(renderer)
  pmrem.compileEquirectangularShader()
  const envMap = pmrem.fromEquirectangular(envTex).texture
  scene.environment = envMap
  envTex.dispose()
  pmrem.dispose()

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80)
  camera.position.set(0, 0, 9)

  // ── Lighting ─────────────────────────────────────────────────────────────
  const ambient = new THREE.AmbientLight(0xfff2e0, 0.35)
  const sunLight = new THREE.DirectionalLight(C_WARM_LIGHT, low ? 2.0 : 3.2)
  sunLight.position.set(5, 5.5, 3)
  const fillLight = new THREE.DirectionalLight(0x7e8bd0, 0.55)
  fillLight.position.set(-5, -2, 4)
  scene.add(ambient, sunLight, fillLight)

  // ── Clear crystal glass ──────────────────────────────────────────────────
  const makeGlassMat = (roughness: number) => {
    if (low) {
      return new THREE.MeshPhysicalMaterial({
        color: 0xeae6df,
        transparent: true,
        opacity: 0.4,
        roughness,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        envMap,
        envMapIntensity: 1.0,
      })
    }
    return new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 1,
      thickness: 1.6,
      ior: 1.5,
      roughness,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      iridescence: 0.28,
      iridescenceIOR: 1.25,
      transparent: true,
      attenuationColor: new THREE.Color(0xfff1e2), // near-clear, faintest warm
      attenuationDistance: 6.0,
      envMap,
      envMapIntensity: 1.15,
    })
  }

  const glassGroup = new THREE.Group()
  glassGroup.position.set(0.6, 0, 0) // bias right (behind portrait), left stays clean
  scene.add(glassGroup)

  // central faceted crystal
  const coreGeo = new THREE.IcosahedronGeometry(low ? 1.2 : 1.45, 0)
  const coreMat = makeGlassMat(0.03)
  const core = new THREE.Mesh(coreGeo, coreMat)
  glassGroup.add(core)

  // orbiting shards — sharp facets read as crystal even when transmission is weak
  const shardDefs = [
    { geo: new THREE.OctahedronGeometry(0.5, 0), pos: [2.5, 1.3, 0.4], r: 0.05 },
    { geo: new THREE.IcosahedronGeometry(0.42, 0), pos: [-2.4, 1.0, -0.4], r: 0.06 },
    { geo: new THREE.OctahedronGeometry(0.34, 0), pos: [2.0, -1.7, 0.7], r: 0.08 },
    { geo: new THREE.TetrahedronGeometry(0.5, 0), pos: [-1.9, -1.4, 0.2], r: 0.06 },
  ]
  const shards: import('three').Mesh[] = []
  const shardBaseY: number[] = []
  shardDefs.forEach((d) => {
    const m = new THREE.Mesh(d.geo, makeGlassMat(d.r))
    m.position.set(d.pos[0], d.pos[1], d.pos[2])
    m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
    shardBaseY.push(d.pos[1])
    glassGroup.add(m)
    shards.push(m)
  })

  // ── Sun (god-ray source), upper-right, partly behind the crystal ──────────
  const sunGeo = new THREE.SphereGeometry(low ? 0.7 : 0.85, 32, 32)
  const sunMat = new THREE.MeshBasicMaterial({ color: C_SUN, transparent: true, fog: false })
  const sunMesh = new THREE.Mesh(sunGeo, sunMat)
  sunMesh.position.set(3.4, 2.6, -2.0)
  scene.add(sunMesh)

  // ── Postprocessing: volumetric god rays + bloom ───────────────────────────
  const composer = new EffectComposer(renderer, { multisampling: low ? 0 : 4 })
  composer.addPass(new RenderPass(scene, camera))

  const bloom = new BloomEffect({
    intensity: low ? 0.7 : 1.3,
    luminanceThreshold: 0.5,
    luminanceSmoothing: 0.32,
    mipmapBlur: true,
  })

  if (low) {
    composer.addPass(new EffectPass(camera, bloom))
  } else {
    const godRays = new GodRaysEffect(camera, sunMesh, {
      height: 360,
      kernelSize: KernelSize.SMALL,
      density: 0.96,
      decay: 0.92,
      weight: 0.6,
      exposure: 0.55,
      samples: 60,
      clampMax: 1.0,
      blur: true,
    })
    composer.addPass(new EffectPass(camera, godRays, bloom))
  }

  // ── Animation ─────────────────────────────────────────────────────────────
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
    const dt = options.reducedMotion ? 0 : Math.min(0.05, lastFrame ? (now - lastFrame) / 1000 : 0.016)
    lastFrame = now

    if (!options.reducedMotion) {
      time += dt
      smoothRotX += (targetRotX - smoothRotX) * HERO_ROTATION_DAMP
      smoothRotY += (targetRotY - smoothRotY) * HERO_ROTATION_DAMP

      glassGroup.rotation.x = smoothRotX * 0.4 + time * 0.03
      glassGroup.rotation.y = smoothRotY + time * 0.08

      core.rotation.x += dt * 0.12
      core.rotation.y += dt * 0.16

      shards.forEach((s, i) => {
        s.rotation.x += dt * (0.07 + i * 0.02) * (i % 2 === 0 ? 1 : -1)
        s.rotation.y += dt * (0.05 + i * 0.015)
        s.position.y = shardBaseY[i] + Math.sin(time * 0.7 + i * 1.3) * 0.16
      })

      sunMesh.scale.setScalar(1 + Math.sin(time * 0.5) * 0.05)
    }

    composer.render(dt)
    raf = requestAnimationFrame(tick)
  }

  const allGeos: import('three').BufferGeometry[] = [coreGeo, sunGeo, ...shardDefs.map((d) => d.geo)]
  const allMats: import('three').Material[] = [coreMat, sunMat]
  shards.forEach((s) => allMats.push(s.material as import('three').Material))

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
      if (!options.reducedMotion) {
        const host = canvas.parentElement
        if (host) {
          removePointer = bindHeroPointer(host, (nx, ny, active) => {
            const px = (nx - 0.5) * 2
            const py = (ny - 0.5) * 2
            targetRotX = active ? py * 0.28 : 0
            targetRotY = active ? px * 0.42 : 0
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
      allGeos.forEach((g) => g.dispose())
      allMats.forEach((m) => m.dispose())
      envMap.dispose()
      composer.dispose()
      renderer.dispose()
      renderer.getContext().getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
