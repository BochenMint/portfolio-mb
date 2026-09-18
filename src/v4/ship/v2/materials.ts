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

function assignEnv(mat: THREE.MeshPhysicalMaterial, map: THREE.Texture | null, intensity: number) {
  if (!map) return
  mat.envMap = map
  mat.envMapIntensity = intensity
}

/** Dual-env PBR: graphite may read the space PMREM as a blurred rim;
 * chrome/glass always use a local studio so they cannot pick up star sparkle. */
export function createShipMaterials(
  spaceEnvMap: THREE.Texture | null,
  renderer?: THREE.WebGLRenderer | null,
): ShipMaterials {
  const studio: HullStudioEnv = createHullStudioEnv(renderer ?? null)
  const graphiteEnv = spaceEnvMap ?? studio.map
  const chromeEnv = studio.map ?? spaceEnvMap

  const panelBase = createPanelTexture()
  const hullPanelTex = panelBase.clone()
  hullPanelTex.image = panelBase.image
  hullPanelTex.repeat.set(6, 2)
  hullPanelTex.needsUpdate = true

  const graphite = new THREE.MeshPhysicalMaterial({
    color: 0x2a2e36,
    metalness: 0.9,
    roughness: 0.27,
    roughnessMap: hullPanelTex,
    clearcoat: 0.08,
    clearcoatRoughness: 0.46,
  })
  assignEnv(graphite, graphiteEnv, 0.58)

  const chrome = new THREE.MeshPhysicalMaterial({
    color: 0xe4e7ec,
    metalness: 1,
    roughness: 0.12,
    clearcoat: 0.28,
    clearcoatRoughness: 0.16,
  })
  assignEnv(chrome, chromeEnv, 1.08)

  const ceramic = new THREE.MeshPhysicalMaterial({
    color: 0x3a322c,
    metalness: 0.32,
    roughness: 0.56,
    clearcoat: 0.06,
    clearcoatRoughness: 0.5,
  })
  assignEnv(ceramic, graphiteEnv, 0.28)

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x0a1218,
    metalness: 0.18,
    roughness: 0.08,
    clearcoat: 0.72,
    clearcoatRoughness: 0.1,
    emissive: new THREE.Color(0x061018),
    emissiveIntensity: 0.12,
  })
  assignEnv(glass, chromeEnv, 0.82)

  const heat = new THREE.MeshPhysicalMaterial({
    color: 0x1a120e,
    metalness: 0.72,
    roughness: 0.4,
    emissive: new THREE.Color(0x2a1408),
    emissiveIntensity: 0.18,
  })
  assignEnv(heat, graphiteEnv, 0.32)

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
    emissiveIntensity: 0.42,
    roughness: 0.55,
    metalness: 0,
  })
}
