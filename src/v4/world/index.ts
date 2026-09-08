import * as THREE from 'three'
import { PLANET_SLOTS } from '../engine/world-anchors'
import { createBlackHole, type BlackHole } from './blackHole'
import { createPlanetMint, type Planet } from './planetMint'
import { createPlanetPlumm } from './planetPlumm'
import { createPlanetIdrive } from './planetIdrive'
import { createPlanetAgentic } from './planetAgentic'
import { createMeteorField, type MeteorField } from './meteors'
import { attachMoons, type PlanetMoons } from './moons'

const EARTH_DAY_TEX_URL = '/v4/assets/tex/earth-day-2k.jpg'
const CITY_LIGHTS_TEX_URL = '/v4/assets/tex/city-lights-2k.jpg'

function fallbackWorldTexture(): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 8
  canvas.height = 8
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#141820'
    ctx.fillRect(0, 0, 8, 8)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

async function loadWorldTexture(loader: THREE.TextureLoader, url: string): Promise<THREE.Texture> {
  try {
    return await loader.loadAsync(url)
  } catch {
    return fallbackWorldTexture()
  }
}

export type WorldAssets = {
  manager: THREE.LoadingManager
  skyTex: THREE.Texture
  envMap: THREE.Texture | null
  lowPower: boolean
  renderer: THREE.WebGLRenderer
}

export type World = {
  /** `elapsed` must be the engine timer's elapsed (not a local dt sum) — the
   * black hole's sky-yaw uniform has to match engine/core.ts's sky dome yaw
   * exactly, or the lensing impostor edge develops a seam over time. */
  update(dt: number, elapsed: number, camera: THREE.PerspectiveCamera): void
  /** Dev/preview-only — see meteors.ts's debugForceSpawn. */
  debugForceMeteor(kind?: 'meteor' | 'comet'): void
  forEachMoonCollider(fn: (position: THREE.Vector3, radius: number) => void): void
  dispose(): void
}

/**
 * Builds the "real world" the ship flies through: the black hole centerpiece
 * plus the four themed project planets, at the positions/radii defined in
 * engine/world-anchors.ts. Owns all of its own geometry/material/texture
 * lifetimes — dispose() fully tears it down and removes everything from
 * `scene`.
 */
export async function createWorld(scene: THREE.Scene, assets: WorldAssets): Promise<World> {
  const { manager, skyTex, envMap, lowPower, renderer } = assets

  // Cap at 8x per spec — diminishing returns above that, and some low-end
  // GPUs report much higher max values than are worth spending on tiny
  // grazing-angle sphere surfaces.
  const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8)

  const texLoader = new THREE.TextureLoader(manager)
  const [earthTex, cityTex] = await Promise.all([
    loadWorldTexture(texLoader, EARTH_DAY_TEX_URL),
    loadWorldTexture(texLoader, CITY_LIGHTS_TEX_URL),
  ])
  for (const tex of [earthTex, cityTex]) {
    tex.colorSpace = THREE.SRGBColorSpace
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    tex.generateMipmaps = true
    tex.minFilter = THREE.LinearMipmapLinearFilter
    tex.anisotropy = maxAnisotropy
  }

  const blackHole: BlackHole = createBlackHole(skyTex, lowPower)
  scene.add(blackHole.object)

  const meteors: MeteorField = createMeteorField()
  scene.add(meteors.object)

  const planetById = new Map<string, Planet>()
  const moonSystems: PlanetMoons[] = []
  for (const slot of PLANET_SLOTS) {
    let planet: Planet
    switch (slot.id) {
      case 'mint':
        planet = createPlanetMint(slot.radius, earthTex, lowPower)
        break
      case 'plumm':
        planet = createPlanetPlumm(slot.radius, cityTex, lowPower)
        break
      case 'idrive':
        planet = createPlanetIdrive(slot.radius, lowPower)
        break
      case 'agentic':
        planet = createPlanetAgentic(slot.radius, envMap, lowPower, maxAnisotropy)
        break
      default:
        throw new Error(`Unknown planet id: ${slot.id satisfies never}`)
    }
    planet.group.position.copy(slot.position)
    planet.group.name = `planet-${slot.id}`
    scene.add(planet.group)
    planetById.set(slot.id, planet)
    moonSystems.push(attachMoons(planet.group, slot.id, slot.radius, lowPower))
  }

  return {
    update(dt, elapsed, camera) {
      blackHole.update(dt, elapsed, camera)
      for (const planet of planetById.values()) planet.update(dt, elapsed)
      for (const moons of moonSystems) moons.update(dt, elapsed)
      meteors.update(dt, camera)
    },

    debugForceMeteor(kind) {
      meteors.debugForceSpawn(kind)
    },

    forEachMoonCollider(fn) {
      for (const moons of moonSystems) moons.forEachCollider(fn)
    },

    dispose() {
      scene.remove(blackHole.object)
      blackHole.dispose()
      for (const planet of planetById.values()) {
        scene.remove(planet.group)
        planet.dispose()
      }
      planetById.clear()
      for (const moons of moonSystems) moons.dispose()
      moonSystems.length = 0
      scene.remove(meteors.object)
      meteors.dispose()
      earthTex.dispose()
      cityTex.dispose()
    },
  }
}
