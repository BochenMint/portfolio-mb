import * as THREE from 'three'
import type { Ship } from './buildShip'
import { loadNormandyHull } from './loadShipNormandy'
import { createEngineFx } from './v2/engineFx'

/**
 * V2 hull loader — procedural MB Kite blockout by default.
 * Optional CC0 GLB via `?glb=1` when the file is present; otherwise the
 * same procedural fallback (lowPower included).
 *
 * Drop-in replacement for `buildShip` — identical exported `Ship` shape,
 * forward = local -Z, overall length ≈34 world units.
 */
export async function buildShipV2(
  manager: THREE.LoadingManager,
  envMap: THREE.Texture | null,
  renderer?: THREE.WebGLRenderer | null,
): Promise<Ship> {
  const { hull, source } = await loadNormandyHull(manager, envMap, renderer)
  const engineFx = createEngineFx(hull.nozzleAttachPoints)

  const shipRoot = new THREE.Group()
  shipRoot.name = 'ship-root-v2'
  shipRoot.userData.hullSource = source
  shipRoot.userData.hullStats = hull.group.userData.hullStats
  shipRoot.userData.engineAnchors = hull.group.userData.engineAnchors
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
