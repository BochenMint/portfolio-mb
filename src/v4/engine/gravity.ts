import * as THREE from 'three'
import { BLACK_HOLE_POS } from './world-anchors'

/**
 * Newtonian-ish inverse-square pull toward the black hole (a = GM / r^2),
 * scaled by a far-field falloff so gravity is a real, felt hazard close to
 * the hole without turning the entire play space into an inescapable
 * funnel. Applied every frame regardless of thrust input — it persists
 * while coasting, exactly like the real velocity it's added to.
 *
 * GRAVITY_GM = 120000 (u^3/s^2). Full inverse-square strength applies at/inside
 * FALLOFF_START (250u); a manual smoothstep fades it to exactly zero by
 * FALLOFF_END (600u), so open space beyond that is genuinely free flight —
 * no residual drift at all. START_POSITION (GameShell.tsx) sits at r≈250, i.e.
 * right at the edge of the danger band, not inside an inescapable well.
 *
 * Numerically verified curve (falloff = 1 for r <= 250; GM and the falloff
 * band are unchanged by the visual black-hole rescale — only EVENT_HORIZON_R
 * below tracks world/blackHole.ts HORIZON_R (now 124)):
 *  - a(300) ≈ 1.26 u/s^2 — light drift, easy correction, edge of the falloff band.
 *  - a(150) ≈ 5.33 u/s^2 — clearly felt, needs active correction, still flyable.
 *  - a(95)  ≈ 13.3 u/s^2 (0.25x thrust) — HUD fairness-warning threshold
 *    ("UWAGA: STUDNIA GRAWITACYJNA", ui/hud.ts).
 *  - a(47)  ≈ 54 u/s^2 — equal to MAIN_THRUST_ACCEL (54, ship/controls.ts):
 *    the force-balance point of no return sits at r = sqrt(GM/thrust) =
 *    sqrt(120000/54) ≈ 47u, where full outward thrust can no longer even
 *    hold position, let alone climb.
 *  - a(45)  ≈ 59 u/s^2 (~1.09x thrust) — just inside the force-balance
 *    radius, already doomed without prior outward speed.
 *  - a(58)  ≈ 36 u/s^2 — EVENT_HORIZON_R itself (game over). The margin
 *    between the force-balance point (~47u) and the death radius (58u) is
 *    ~11 units — thin but reactable with the faster ship.
 *
 * Energy check (work-energy integral of a(r) from r0 out to 600u, the
 * radius past which gravity is fully spent — this integral only depends on
 * GM and the falloff band, both unchanged, so these two values are
 * unaffected by the EVENT_HORIZON_R rescale): climbing out from r0=70u needs
 * an initial outward speed v0 ≈ 53.3 u/s, comfortably under the 60 u/s soft
 * speed cap (ship/controls.ts) — dramatic but genuinely flyable. From
 * r0=60u it needs v0 ≈ 58.4 u/s, right at that asymptotic cap (which is
 * only ever approached, never reached, while gravity keeps draining speed
 * during the climb) — not achievable in practice, and r0=60u is now just
 * 16u above the death radius (44u), underlining how thin the safety margin
 * near the hole has become. That's the intended shape: danger hugs the
 * hole, the rest of the map is free.
 */
export const GRAVITY_GM = 120000

/** Full-strength inverse-square pull at/inside this radius. */
const FALLOFF_START = 250
/** Pull fades to exactly zero by this radius — free flight beyond it. */
const FALLOFF_END = 600

/** Gameplay game-over trigger — just outside the visual horizon mesh (100u)
 * and inside the photon ring (~114u) in world/blackHole.ts. */
export const EVENT_HORIZON_R = 108

/** Floor on r so the accel doesn't spike toward infinity this close to the
 * singularity — irrelevant in practice since EVENT_HORIZON_R (26) always
 * ends the run well before r could get this small. */
const MIN_R = 5

const toBH = new THREE.Vector3()

/** Manual smoothstep (classic Hermite 3t^2 - 2t^3 on the clamped 0..1 t) —
 * no dependency on THREE.MathUtils.smoothstep. */
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

/** 1 at/inside FALLOFF_START, 0 at/beyond FALLOFF_END, smooth in between. */
function falloff(r: number): number {
  return 1 - smoothstep(FALLOFF_START, FALLOFF_END, r)
}

/** Mutates `velocity` in place with one frame's worth of gravitational
 * acceleration toward BLACK_HOLE_POS. Call before the controls' own
 * `update(dt)` so thrust/damping/position-integration for this frame see
 * the combined velocity (semi-implicit Euler, same convention the rest of
 * ship/controls.ts already uses). */
export function applyBlackHoleGravity(position: THREE.Vector3, velocity: THREE.Vector3, dt: number): void {
  toBH.copy(BLACK_HOLE_POS).sub(position)
  const r = Math.max(toBH.length(), MIN_R)
  const accel = (GRAVITY_GM / (r * r)) * falloff(r)
  toBH.normalize()
  velocity.addScaledVector(toBH, accel * dt)
}

/** Same formula as applyBlackHoleGravity, without mutating anything —
 * lets GameShell sample "how strong is gravity right now" once per tick to
 * drive the HUD fairness warning (ui/hud.ts). */
export function gravityAccelAt(position: THREE.Vector3): number {
  const r = Math.max(BLACK_HOLE_POS.distanceTo(position), MIN_R)
  return (GRAVITY_GM / (r * r)) * falloff(r)
}
