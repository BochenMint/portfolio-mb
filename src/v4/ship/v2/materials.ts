import * as THREE from 'three'
import { createPanelTexture } from './panelTexture'
import { createHullStudioEnv, type HullStudioEnv } from './studioEnv'

export type ShipMaterials = {
  /** Graphite hull — ~70% of the silhouette. */
  graphite: THREE.MeshPhysicalMaterial
  /** Chrome leading edges / chines only. */
  chrome: THREE.MeshPhysicalMaterial
  /** Ceramic heat tiles around nozzles. */
  ceramic: THREE.MeshPhysicalMaterial
  glass: THREE.MeshPhysicalMaterial
  /** Heat-stained nozzle throats. */
  heat: THREE.MeshPhysicalMaterial
  dispose(): void
}

function assignStudio(mat: THREE.MeshPhysicalMaterial, map: THREE.Texture | null, intensity: number) {
  if (!map) return
  mat.envMap = map
  mat.envMapIntensity = intensity
  mat.needsUpdate = true
}

/** Dual-env PBR: every hull slot uses the local studio PMREM so graphite
 * cannot fall into the sky cubemap (Gaia sparkle / full-black metals). */
export function createShipMaterials(
  _spaceEnvMap: THREE.Texture | null,
  renderer?: THREE.WebGLRenderer | null,
): ShipMaterials {
  void _spaceEnvMap
  const studio: HullStudioEnv = createHullStudioEnv(renderer ?? null)
  const env = studio.map

  const panelBase = createPanelTexture()
  const hullPanelTex = panelBase.clone()
  hullPanelTex.image = panelBase.image
  hullPanelTex.repeat.set(6, 2)
  hullPanelTex.needsUpdate = true

  const graphite = new THREE.MeshPhysicalMaterial({
    color: 0x3a424e,
    metalness: 0.82,
    roughness: 0.34,
    roughnessMap: hullPanelTex,
    clearcoat: 0.12,
    clearcoatRoughness: 0.42,
    emissive: new THREE.Color(0x0e141c),
    emissiveIntensity: 0.09,
  })
  assignStudio(graphite, env, 0.68)

  const chrome = new THREE.MeshPhysicalMaterial({
    color: 0xb4bcc6,
    metalness: 1,
    roughness: 0.11,
    clearcoat: 0.4,
    clearcoatRoughness: 0.12,
  })
  assignStudio(chrome, env, 1.35)

  const ceramic = new THREE.MeshPhysicalMaterial({
    color: 0x4a4038,
    metalness: 0.28,
    roughness: 0.58,
    clearcoat: 0.06,
    clearcoatRoughness: 0.5,
  })
  assignStudio(ceramic, env, 0.38)

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x101820,
    metalness: 0.22,
    roughness: 0.08,
    clearcoat: 0.72,
    clearcoatRoughness: 0.1,
    emissive: new THREE.Color(0x071018),
    emissiveIntensity: 0.18,
  })
  assignStudio(glass, env, 0.9)

  const heat = new THREE.MeshPhysicalMaterial({
    color: 0x221610,
    metalness: 0.64,
    roughness: 0.36,
    emissive: new THREE.Color(0x4a220c),
    emissiveIntensity: 0.42,
  })
  assignStudio(heat, env, 0.28)

  return {
    graphite,
    chrome,
    ceramic,
    glass,
    heat,
    dispose() {
      graphite.dispose()
      chrome.dispose()
      ceramic.dispose()
      glass.dispose()
      heat.dispose()
      panelBase.dispose()
      hullPanelTex.dispose()
      studio.dispose()
    },
  }
}

export function createNavLightMaterial(color: number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.7,
    roughness: 0.5,
    metalness: 0,
  })
}
