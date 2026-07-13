import * as THREE from 'three'
import type { Ship } from './buildShip'
import { buildShipHull } from './v2/hull'
import { createEngineFx } from './v2/engineFx'

/**
 * V2 — original lofted-hull frigate, built entirely from procedural geometry
 * (no downloaded base mesh). Evokes the Normandy-CLASS silhouette (wide
 * flattened hull, chiseled drooping nose with a cockpit glazing strip,
 * dorsal hump, faired-in flank nacelles ending in paired round nozzles,
 * twin upswept canted tail fins, two-tone flank banding) without reusing
 * any franchise geometry, markings, or livery — see BRIEFS/ship-v2 notes.
 *
 * Drop-in replacement for `buildShip` — identical exported `Ship` shape
 * (`group` / `updateThrust(thrust, elapsed)` / `dispose()`), same async
 * signature `(manager, envMap) => Promise<Ship>`, same world conventions
 * (overall length ~23 units hull + nozzles, forward = local -Z). The build is fully
 * synchronous procedural geometry, so the returned promise resolves
 * immediately — `manager` is accepted only for signature compatibility with
 * the loader-based V1 path and isn't otherwise used.
 */
export async function buildShipV2(_manager: THREE.LoadingManager, envMap: THREE.Texture | null): Promise<Ship> {
  const hull = buildShipHull(envMap)
  const engineFx = createEngineFx(hull.nozzleAttachPoints)

  const shipRoot = new THREE.Group()
  shipRoot.name = 'ship-root-v2'
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
