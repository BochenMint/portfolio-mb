import * as THREE from 'three'

/** Origin anchor — the black hole shader (world/blackHole.ts) sits here. */
export const BLACK_HOLE_POS = new THREE.Vector3(0, 0, 0)

export type PlanetId = 'plumm' | 'mint' | 'idrive' | 'agentic'

export type PlanetSlot = {
  id: PlanetId
  /** World position, orbital radius ~850–1400 units from the black hole. */
  position: THREE.Vector3
  radius: number
  /** Identity tint — matches each planet's real shader palette (world/planet*.ts). */
  color: number
}

// Four destinations scattered around the black hole at varied radii/altitudes so
// flight has clear, distinct waypoints. Radii spread ~850–1400u (×1.4 vs prior
// 400–900u band), heights vary so the ship has to pitch/roll between them.
export const PLANET_SLOTS: PlanetSlot[] = [
  {
    id: 'mint',
    position: new THREE.Vector3(784, 126, -364),
    radius: 40,
    color: 0x2dd4bf,
  },
  {
    id: 'plumm',
    position: new THREE.Vector3(-588, -196, 728),
    radius: 34,
    color: 0x8a6bff,
  },
  {
    id: 'idrive',
    position: new THREE.Vector3(420, 308, 1176),
    radius: 28,
    color: 0xffc861,
  },
  {
    id: 'agentic',
    position: new THREE.Vector3(-1092, -84, -840),
    radius: 45,
    color: 0xf5a524,
  },
]
