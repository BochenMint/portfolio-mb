import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import type { ShipHull } from './v2/hull'
import { buildShipHull } from './v2/hull'
import { createShipMaterials } from './v2/materials'

/**
 * CC0 community mesh (JoshuaS, BlendSwap #8489) — drop the exported GLB here
 * after manual download + Blender export. If missing, falls back to the
 * procedural SR2-class hull in v2/hull.ts.
 */
export const NORMANDY_GLB_URL = '/v4/assets/ships/normandy-sr2-joshuas-cc0.glb'

const TARGET_HULL_LENGTH = 28
const NOSE_FLIP_Y = Math.PI

function orientAndNormalize(root: THREE.Object3D): { group: THREE.Group; box: THREE.Box3 } {
  const box = new THREE.Box3().setFromObject(root)
  const center = new THREE.Vector3()
  box.getCenter(center)
  root.position.sub(center)

  const size = new THREE.Vector3()
  box.getSize(size)

  const rotationGroup = new THREE.Group()
  rotationGroup.add(root)

  if (size.x >= size.y && size.x >= size.z) {
    rotationGroup.rotation.y = Math.PI / 2
  } else if (size.y > size.x && size.y >= size.z) {
    rotationGroup.rotation.x = Math.PI / 2
  }
  rotationGroup.rotation.y += NOSE_FLIP_Y

  const orientedBox = new THREE.Box3().setFromObject(rotationGroup)
  const orientedSize = new THREE.Vector3()
  orientedBox.getSize(orientedSize)
  const orientedLength = Math.max(orientedSize.z, 0.0001)
  const scale = TARGET_HULL_LENGTH / orientedLength

  const hullGroup = new THREE.Group()
  hullGroup.name = 'normandy-glb-hull'
  hullGroup.add(rotationGroup)
  hullGroup.scale.setScalar(scale)

  const finalBox = new THREE.Box3().setFromObject(hullGroup)
  return { group: hullGroup, box: finalBox }
}

/** Heuristic nozzle anchors for a Normandy-shaped mesh after normalization. */
function nozzlePointsFromBounds(box: THREE.Box3): THREE.Vector3[] {
  const min = box.min
  const max = box.max
  const cx = (min.x + max.x) / 2
  const cy = min.y + (max.y - min.y) * 0.42
  const depth = max.z - min.z
  const cz = max.z
  const wingX = (max.x - min.x) * 0.36
  const wingY = (max.y - min.y) * 0.14
  const sternZ = cz - depth * 0.04
  return [
    new THREE.Vector3(cx + wingX, cy - wingY, cz),
    new THREE.Vector3(cx + wingX, cy + wingY * 0.6, cz),
    new THREE.Vector3(cx - wingX, cy - wingY, cz),
    new THREE.Vector3(cx - wingX, cy + wingY * 0.6, cz),
    new THREE.Vector3(cx + wingX * 0.22, cy, sternZ),
    new THREE.Vector3(cx - wingX * 0.22, cy, sternZ),
  ]
}

function applyAllianceMaterials(root: THREE.Object3D, envMap: THREE.Texture | null): THREE.Material[] {
  const materials = createShipMaterials(envMap)
  const owned: THREE.Material[] = [materials.steel, materials.gunmetal, materials.ceramic, materials.glass, materials.blade]
  let meshIndex = 0
  root.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const name = child.name.toLowerCase()
      if (name.includes('glass') || name.includes('canopy') || name.includes('window')) {
        child.material = materials.glass
      } else if (name.includes('stripe') || name.includes('band') || name.includes('ceramic')) {
        child.material = materials.ceramic
      } else if (name.includes('engine') || name.includes('nozzle') || name.includes('dark')) {
        child.material = materials.gunmetal
      } else {
        child.material = meshIndex % 4 === 0 ? materials.ceramic : materials.steel
      }
      child.castShadow = false
      child.receiveShadow = false
      meshIndex += 1
    }
  })
  return owned
}

function buildHullFromGltf(gltf: { scene: THREE.Group }, envMap: THREE.Texture | null): ShipHull {
  const clone = gltf.scene.clone(true)
  const { group, box } = orientAndNormalize(clone)
  const ownedMaterials = applyAllianceMaterials(group, envMap)
  const nozzleAttachPoints = nozzlePointsFromBounds(box)

  const ownedGeometries: THREE.BufferGeometry[] = []
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) ownedGeometries.push(child.geometry)
  })

  return {
    group,
    nozzleAttachPoints,
    dispose() {
      for (const geo of ownedGeometries) geo.dispose()
      for (const mat of ownedMaterials) mat.dispose()
    },
  }
}

/** Vite (and many static hosts) return `index.html` with 200 for missing assets —
 * a bare HEAD/ok check falsely triggers GLTFLoader on HTML. Probe the first
 * bytes for the GLB magic (`glTF`) and reject `text/html`. */
async function normandyGlbAvailable(): Promise<boolean> {
  try {
    const res = await fetch(NORMANDY_GLB_URL, {
      method: 'GET',
      headers: { Range: 'bytes=0-11' },
      cache: 'force-cache',
    })
    if (!res.ok) return false
    const ct = res.headers.get('content-type') ?? ''
    if (ct.includes('text/html')) return false
    const buf = new Uint8Array(await res.arrayBuffer())
    if (buf.byteLength < 4) return false
    return buf[0] === 0x67 && buf[1] === 0x6c && buf[2] === 0x54 && buf[3] === 0x46
  } catch {
    return false
  }
}

/** Load CC0 Normandy GLB when present; otherwise procedural SR2-class hull.
 * The BlendSwap file is not in the repo — probing it on every visit 404s in
 * the console. Opt in with `?glb=1` (or VITE_LOAD_NORMANDY_GLB) after dropping
 * the GLB next to this URL. */
export async function loadNormandyHull(
  manager: THREE.LoadingManager,
  envMap: THREE.Texture | null,
): Promise<{ hull: ShipHull; source: 'glb' | 'procedural' }> {
  const wantGlb =
    import.meta.env.VITE_LOAD_NORMANDY_GLB === 'true' ||
    (typeof location !== 'undefined' && new URLSearchParams(location.search).has('glb'))
  if (!wantGlb || !(await normandyGlbAvailable())) {
    return { hull: buildShipHull(envMap), source: 'procedural' }
  }
  try {
    const loader = new GLTFLoader(manager)
    const gltf = await loader.loadAsync(NORMANDY_GLB_URL)
    return { hull: buildHullFromGltf(gltf, envMap), source: 'glb' }
  } catch {
    return { hull: buildShipHull(envMap), source: 'procedural' }
  }
}
