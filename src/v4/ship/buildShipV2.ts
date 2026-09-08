import * as THREE from 'three'
import type { Ship } from './buildShip'
import { loadNormandyHull } from './loadShipNormandy'
import { createEngineFx } from './v2/engineFx'

/**
 * V2 — Normandy SR2-class frigate. Loads CC0 community GLB when present at
 * `public/v4/assets/ships/normandy-sr2-joshuas-cc0.glb` (JoshuaS / BlendSwap
 * #8489); otherwise builds a procedural SR2 silhouette (offset hammerhead,
 * S-curve nacelles, twin pods + stern aux engines, dorsal fins, Alliance bands).
 *
 * Drop-in replacement for `buildShip` — identical exported `Ship` shape,
 * forward = local -Z, overall length ≈28 world units.
 */
export async function buildShipV2(manager: THREE.LoadingManager, envMap: THREE.Texture | null): Promise<Ship> {
  const { hull, source } = await loadNormandyHull(manager, envMap)
  const engineFx = createEngineFx(hull.nozzleAttachPoints)

  const shipRoot = new THREE.Group()
  shipRoot.name = 'ship-root-v2'
  shipRoot.userData.hullSource = source
  shipRoot.add(hull.group)
  shipRoot.add(engineFx.group)

  return {
    group: shipRoot,

    updateThrust(thrust, elapsed) {
      engineFx.updateThrust(thrust, elapsed)
    },

    dispose() {
      hull.dispose()
      engineFx.dispose()
    },
  }
}
