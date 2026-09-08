import * as THREE from 'three'
import type { PlanetId } from '../engine/world-anchors'

type MoonSpec = {
  /** Orbit radius as a multiple of the parent planet's radius. */
  orbitRadius: number
  /** Moon mesh radius as a multiple of the parent planet's radius. */
  moonRadius: number
  /** Radians per second around the planet. */
  orbitSpeed: number
  /** Orbital plane tilt, radians. */
  inclination: number
  /** Starting angle on the orbit, radians. */
  phase: number
  color: number
}

/** Per-planet moon layouts — kept lightweight (1–3 low-poly spheres each). */
const MOON_PRESETS: Record<PlanetId, MoonSpec[]> = {
  mint: [
    { orbitRadius: 1.75, moonRadius: 0.11, orbitSpeed: 0.07, inclination: 0.28, phase: 0.4, color: 0x8a9aaa },
    { orbitRadius: 2.35, moonRadius: 0.07, orbitSpeed: 0.045, inclination: -0.18, phase: 2.3, color: 0x6a7a88 },
  ],
  plumm: [
    { orbitRadius: 1.9, moonRadius: 0.09, orbitSpeed: 0.055, inclination: 0.42, phase: 1.1, color: 0x5a4a6a },
  ],
  idrive: [
    { orbitRadius: 1.65, moonRadius: 0.08, orbitSpeed: 0.08, inclination: 0.22, phase: 0.6, color: 0x9a8870 },
    { orbitRadius: 2.25, moonRadius: 0.055, orbitSpeed: 0.038, inclination: -0.35, phase: 3.8, color: 0x776858 },
  ],
  agentic: [
    { orbitRadius: 2.0, moonRadius: 0.1, orbitSpeed: 0.065, inclination: 0.32, phase: 1.6, color: 0xaa8860 },
    { orbitRadius: 2.7, moonRadius: 0.065, orbitSpeed: 0.042, inclination: -0.22, phase: 4.2, color: 0x887060 },
  ],
}

export type PlanetMoons = {
  update(dt: number, elapsed: number): void
  forEachCollider(fn: (position: THREE.Vector3, radius: number) => void): void
  dispose(): void
}

/**
 * Attaches simple procedural moon spheres as children of a planet group.
 * Moons orbit locally — discovery/collision still use world-anchors slot
 * positions, so panels and HUD behaviour are unchanged.
 */
export function attachMoons(
  planetGroup: THREE.Group,
  planetId: PlanetId,
  planetRadius: number,
  lowPower: boolean,
): PlanetMoons {
  const specs = MOON_PRESETS[planetId]
  const seg = lowPower ? 12 : 16
  const orbits: { pivot: THREE.Object3D; mesh: THREE.Mesh; speed: number; phase: number; radius: number }[] = []
  const disposables: { geo: THREE.BufferGeometry; mat: THREE.Material }[] = []
  const worldPos = new THREE.Vector3()

  for (const spec of specs) {
    const pivot = new THREE.Object3D()
    pivot.rotation.x = spec.inclination
    planetGroup.add(pivot)

    const moonR = planetRadius * spec.moonRadius
    const geo = new THREE.SphereGeometry(moonR, seg, seg)
    const mat = new THREE.MeshStandardMaterial({
      color: spec.color,
      roughness: 0.92,
      metalness: 0.04,
      emissive: new THREE.Color(spec.color).multiplyScalar(0.04),
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.x = planetRadius * spec.orbitRadius
    pivot.add(mesh)

    orbits.push({ pivot, mesh, speed: spec.orbitSpeed, phase: spec.phase, radius: moonR })
    disposables.push({ geo, mat })
  }

  return {
    update(_dt, elapsed) {
      for (const { pivot, speed, phase } of orbits) {
        pivot.rotation.y = elapsed * speed + phase
      }
    },
    forEachCollider(fn) {
      for (const { mesh, radius } of orbits) {
        mesh.getWorldPosition(worldPos)
        fn(worldPos, radius)
      }
    },
    dispose() {
      for (const { geo, mat } of disposables) {
        geo.dispose()
        mat.dispose()
      }
    },
  }
}
