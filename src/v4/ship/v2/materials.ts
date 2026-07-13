import * as THREE from 'three'
import { createPanelTexture } from './panelTexture'

export type ShipMaterials = {
  steel: THREE.MeshPhysicalMaterial
  gunmetal: THREE.MeshPhysicalMaterial
  glass: THREE.MeshPhysicalMaterial
  /** Map-free steel for extruded blades (wings/fins) — ExtrudeGeometry's
   * position-derived UVs turn the tiled panel maps into moiré stripes, so
   * blades get a clean untextured finish instead. */
  blade: THREE.MeshPhysicalMaterial
  dispose(): void
}

/** Polished-steel hull skin + dark gunmetal accent + glazed bridge glass —
 * all close-up-proof via the procedural panel texture (roughness + bump). */
export function createShipMaterials(envMap: THREE.Texture | null): ShipMaterials {
  const panelBase = createPanelTexture()

  const hullPanelTex = panelBase.clone()
  hullPanelTex.image = panelBase.image
  hullPanelTex.repeat.set(11, 3)
  hullPanelTex.needsUpdate = true

  const accentPanelTex = panelBase.clone()
  accentPanelTex.image = panelBase.image
  accentPanelTex.repeat.set(6, 5)
  accentPanelTex.needsUpdate = true

  const steel = new THREE.MeshPhysicalMaterial({
    color: 0xd7dde3,
    metalness: 1.0,
    roughness: 0.16,
    roughnessMap: hullPanelTex,
    bumpMap: hullPanelTex,
    bumpScale: 0.01,
    envMapIntensity: 1.5,
    clearcoat: 0.3,
    clearcoatRoughness: 0.25,
  })

  const gunmetal = new THREE.MeshPhysicalMaterial({
    color: 0x2c3036,
    metalness: 0.9,
    roughness: 0.36,
    roughnessMap: accentPanelTex,
    bumpMap: accentPanelTex,
    bumpScale: 0.008,
    envMapIntensity: 1.2,
  })

  // Opaque near-black glossy canopy — a dark visor strip that reads clearly
  // against the polished-steel hull (transmissive glass rendered almost
  // invisible over the metal beneath it).
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x04070b,
    metalness: 0.2,
    roughness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    emissive: new THREE.Color(0x10283c),
    emissiveIntensity: 0.4,
    envMapIntensity: 1.6,
  })

  const blade = new THREE.MeshPhysicalMaterial({
    color: 0xb8c0c8,
    metalness: 1.0,
    roughness: 0.28,
    envMapIntensity: 1.2,
    clearcoat: 0.2,
    clearcoatRoughness: 0.3,
  })

  if (envMap) {
    steel.envMap = envMap
    gunmetal.envMap = envMap
    glass.envMap = envMap
    blade.envMap = envMap
  }

  return {
    steel,
    gunmetal,
    glass,
    blade,
    dispose() {
      steel.dispose()
      gunmetal.dispose()
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
    emissiveIntensity: 4,
    roughness: 0.4,
    metalness: 0,
  })
}
