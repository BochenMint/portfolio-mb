import * as THREE from 'three'
import { createPanelTexture } from './panelTexture'

export type ShipMaterials = {
  /** Dark Alliance hull — charcoal metal with readable spec, not chrome or clay. */
  steel: THREE.MeshPhysicalMaterial
  gunmetal: THREE.MeshPhysicalMaterial
  /** Dark slate accent — flank / dorsal stripes, never white ceramic. */
  ceramic: THREE.MeshPhysicalMaterial
  glass: THREE.MeshPhysicalMaterial
  blade: THREE.MeshPhysicalMaterial
  dispose(): void
}

/** Dark opaque PBR — enough env to catch the disk/Milky Way as rim, not clay. */
export function createShipMaterials(envMap: THREE.Texture | null): ShipMaterials {
  const panelBase = createPanelTexture()

  const hullPanelTex = panelBase.clone()
  hullPanelTex.image = panelBase.image
  hullPanelTex.repeat.set(8, 2)
  hullPanelTex.needsUpdate = true

  const accentPanelTex = panelBase.clone()
  accentPanelTex.image = panelBase.image
  accentPanelTex.repeat.set(5, 4)
  accentPanelTex.needsUpdate = true

  const steel = new THREE.MeshPhysicalMaterial({
    color: 0x5a6574,
    metalness: 0.78,
    roughness: 0.32,
    roughnessMap: hullPanelTex,
    envMapIntensity: 0.95,
    clearcoat: 0.22,
    clearcoatRoughness: 0.34,
  })

  const gunmetal = new THREE.MeshPhysicalMaterial({
    color: 0x1e232c,
    metalness: 0.72,
    roughness: 0.36,
    roughnessMap: accentPanelTex,
    envMapIntensity: 0.58,
    clearcoat: 0.12,
    clearcoatRoughness: 0.4,
  })

  const ceramic = new THREE.MeshPhysicalMaterial({
    color: 0x2a313c,
    metalness: 0.28,
    roughness: 0.48,
    roughnessMap: accentPanelTex,
    envMapIntensity: 0.4,
    clearcoat: 0.1,
    clearcoatRoughness: 0.45,
  })

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x071018,
    metalness: 0.22,
    roughness: 0.06,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    emissive: new THREE.Color(0x0a2030),
    emissiveIntensity: 0.28,
    envMapIntensity: 0.7,
  })

  const blade = new THREE.MeshPhysicalMaterial({
    color: 0x2c333e,
    metalness: 0.74,
    roughness: 0.34,
    envMapIntensity: 0.55,
    clearcoat: 0.14,
    clearcoatRoughness: 0.4,
  })

  if (envMap) {
    steel.envMap = envMap
    gunmetal.envMap = envMap
    ceramic.envMap = envMap
    glass.envMap = envMap
    blade.envMap = envMap
  }

  return {
    steel,
    gunmetal,
    ceramic,
    glass,
    blade,
    dispose() {
      steel.dispose()
      gunmetal.dispose()
      ceramic.dispose()
      glass.dispose()
      blade.dispose()
      panelBase.dispose()
      hullPanelTex.dispose()
      accentPanelTex.dispose()
    },
  }
}

export function createNavLightMaterial(color: number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.35,
    roughness: 0.6,
    metalness: 0,
  })
}
