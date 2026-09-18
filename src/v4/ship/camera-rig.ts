import * as THREE from 'three'
import { BLACK_HOLE_POS } from '../engine/world-anchors'

// Classic chase in SHIP space: +Y = dorsal, +Z = aft (forward is local -Z).
// World-up height was a frog trap — nose-up pitch puts "behind" below the keel.
// Hull is ~34u (procedural) / ~28u (GLB). BACK must stay ≥1.6× the long hull
// so the nacelles cannot eat the frame or hide the hole AFTER launch.
const CHASE_SIDE = 0.15
const CHASE_HEIGHT = 6.8
const CHASE_BACK = 56
const LOOK_AHEAD = 48
const LOOK_HEIGHT = 2.4
const FOV_MIN = 55
const FOV_MAX = 60
const FOV_MIN_PORTRAIT = 58
const FOV_MAX_PORTRAIT = 62
const THRUST_PULLBACK = 6.5
const THRUST_PULLBACK_LERP = 4.5
const OFFSET_LERP_RATE = 10
const OFFSET_ANG_BOOST = 16

/** Cinematic start — world-space shot, not a chase. Camera sits close behind
 * the hull so the ship reads in the lower third; the hole stays a controlled
 * disk, not a full-frame matte. */
const LAUNCH_BACK = 22
const LAUNCH_HEIGHT = 12
const LAUNCH_SIDE = 4.5
const LAUNCH_LOOK_PULL = 14
const LAUNCH_LOOK_LIFT = 2
const LAUNCH_FOV = 50
const LAUNCH_BLEND_S = 0.95

const DEFLECT_PER_RATE = 0.45
const DEFLECT_MAX = 0.9
const DEFLECT_RESPONSE = 8

export type CameraRig = {
  update(
    dt: number,
    shipPos: THREE.Vector3,
    shipQuat: THREE.Quaternion,
    thrustLevel: number,
    shipBankAngle: number,
    angularVelocity: THREE.Vector3 | undefined,
    flags: { hasThrusted: boolean; reducedMotion: boolean },
  ): void
  /** Deterministic return to the staged start shot (reset / boot). */
  holdLaunch(shipPos: THREE.Vector3, shipQuat: THREE.Quaternion): void
  getPhase(): 'launch' | 'blend' | 'chase'
}

const worldUp = new THREE.Vector3(0, 1, 0)
const fwdFallback = new THREE.Vector3(0, 0, -1)
const upFallback = new THREE.Vector3(0, 1, 0)

function safeNormalize(v: THREE.Vector3, fallback: THREE.Vector3): THREE.Vector3 {
  if (!Number.isFinite(v.x + v.y + v.z) || v.lengthSq() < 1e-10) return fallback.clone()
  return v.normalize()
}

function launchFit(aspect: number): {
  back: number
  height: number
  side: number
  fov: number
  pull: number
  lookLift: number
} {
  // Portrait: extra back + a downward look so hull sits above the start dock
  // and the hammerhead is not cropped.
  if (aspect > 0 && aspect < 0.62) {
    return { back: 2.35, height: 1.28, side: 0.18, fov: 58, pull: 0.55, lookLift: -14 }
  }
  if (aspect > 0 && aspect < 0.85) {
    return { back: 2.05, height: 1.18, side: 0.26, fov: 56, pull: 0.65, lookLift: -11 }
  }
  return { back: 1, height: 1, side: 1, fov: LAUNCH_FOV, pull: 1, lookLift: 0 }
}

function smoothstep01(t: number): number {
  const x = THREE.MathUtils.clamp(t, 0, 1)
  return x * x * (3 - 2 * x)
}

export function createCameraRig(camera: THREE.PerspectiveCamera): CameraRig {
  const desiredPos = new THREE.Vector3()
  const lookTarget = new THREE.Vector3()
  const forward = new THREE.Vector3()
  const shipUp = new THREE.Vector3()
  const localOffset = new THREE.Vector3()
  const smoothedLocal = new THREE.Vector3(CHASE_SIDE, CHASE_HEIGHT, CHASE_BACK)
  const deflect = new THREE.Vector3()
  const viewDir = new THREE.Vector3()
  const radial = new THREE.Vector3()
  const right = new THREE.Vector3()
  const launchPos = new THREE.Vector3()
  const launchLook = new THREE.Vector3()
  const launchQuat = new THREE.Quaternion()
  const chaseQuat = new THREE.Quaternion()
  const fromPos = new THREE.Vector3()
  const fromQuat = new THREE.Quaternion()
  const dummy = new THREE.PerspectiveCamera()
  dummy.up.copy(worldUp)

  let pullbackSmoothed = 0
  let launchFov = LAUNCH_FOV
  let phase: 'launch' | 'blend' | 'chase' = 'launch'
  let blendT = 0
  let wasThrusted = false

  camera.fov = FOV_MIN
  camera.updateProjectionMatrix()

  function poseLaunch(shipPos: THREE.Vector3): void {
    const fit = launchFit(camera.aspect)
    radial.copy(shipPos).sub(BLACK_HOLE_POS)
    if (radial.lengthSq() < 1e-6) radial.set(0, 0, 1)
    radial.normalize()
    right.crossVectors(worldUp, radial)
    if (right.lengthSq() < 1e-8) right.set(1, 0, 0)
    right.normalize()

    launchPos.copy(shipPos)
      .addScaledVector(radial, LAUNCH_BACK * fit.back)
      .addScaledVector(worldUp, LAUNCH_HEIGHT * fit.height)
      .addScaledVector(right, LAUNCH_SIDE * fit.side)

    launchLook.copy(shipPos)
      .addScaledVector(radial, -LAUNCH_LOOK_PULL * fit.pull)
      .addScaledVector(worldUp, LAUNCH_LOOK_LIFT + fit.lookLift)
    launchFov = fit.fov

    dummy.position.copy(launchPos)
    dummy.up.copy(worldUp)
    dummy.lookAt(launchLook)
    launchQuat.copy(dummy.quaternion)
  }

  function applyLaunch(): void {
    camera.position.copy(launchPos)
    camera.quaternion.copy(launchQuat)
    camera.up.copy(worldUp)
    if (Math.abs(camera.fov - launchFov) > 0.01) {
      camera.fov = launchFov
      camera.updateProjectionMatrix()
    }
  }

  function holdLaunch(shipPos: THREE.Vector3, shipQuat: THREE.Quaternion): void {
    void shipQuat
    phase = 'launch'
    blendT = 0
    wasThrusted = false
    pullbackSmoothed = 0
    deflect.set(0, 0, 0)
    smoothedLocal.set(CHASE_SIDE, CHASE_HEIGHT, CHASE_BACK)
    poseLaunch(shipPos)
    applyLaunch()
  }

  function computeChase(
    dt: number,
    shipPos: THREE.Vector3,
    shipQuat: THREE.Quaternion,
    thrustLevel: number,
    angularVelocity: THREE.Vector3 | undefined,
  ): { fov: number } {
    const safeDt = Number.isFinite(dt) && dt > 0 ? Math.min(dt, 0.05) : 1 / 60

    const angSpeed = angularVelocity
      ? Math.min(Math.hypot(angularVelocity.x, angularVelocity.y), 12)
      : 0

    const deflectTargetX = angularVelocity
      ? THREE.MathUtils.clamp(-angularVelocity.y * DEFLECT_PER_RATE, -DEFLECT_MAX, DEFLECT_MAX)
      : 0
    const deflectTargetY = angularVelocity
      ? THREE.MathUtils.clamp(angularVelocity.x * DEFLECT_PER_RATE, -DEFLECT_MAX, DEFLECT_MAX)
      : 0
    const deflectK = 1 - Math.exp(-DEFLECT_RESPONSE * safeDt)
    deflect.x += (deflectTargetX - deflect.x) * deflectK
    deflect.y += (deflectTargetY - deflect.y) * deflectK

    const thrustT = THREE.MathUtils.clamp(Number.isFinite(thrustLevel) ? thrustLevel : 0, 0, 1)
    const pullbackTarget = thrustT * THRUST_PULLBACK
    pullbackSmoothed +=
      (pullbackTarget - pullbackSmoothed) * (1 - Math.exp(-THRUST_PULLBACK_LERP * safeDt))

    localOffset.set(
      CHASE_SIDE + deflect.x,
      CHASE_HEIGHT + deflect.y,
      CHASE_BACK + pullbackSmoothed,
    )
    const offsetK = 1 - Math.exp(-(OFFSET_LERP_RATE + angSpeed * OFFSET_ANG_BOOST) * safeDt)
    smoothedLocal.lerp(localOffset, offsetK)

    desiredPos.copy(smoothedLocal).applyQuaternion(shipQuat).add(shipPos)

    forward.set(0, 0, -1).applyQuaternion(shipQuat)
    safeNormalize(forward, fwdFallback)
    shipUp.set(0, 1, 0).applyQuaternion(shipQuat)
    safeNormalize(shipUp, upFallback)

    lookTarget.copy(shipPos).addScaledVector(forward, LOOK_AHEAD).addScaledVector(shipUp, LOOK_HEIGHT)

    dummy.position.copy(desiredPos)
    viewDir.copy(lookTarget).sub(desiredPos)
    if (viewDir.lengthSq() > 1e-8) {
      viewDir.normalize()
      dummy.up.copy(Math.abs(viewDir.dot(worldUp)) > 0.92 ? shipUp : worldUp)
    } else {
      dummy.up.copy(worldUp)
    }
    dummy.lookAt(lookTarget)
    chaseQuat.copy(dummy.quaternion)

    const portrait = camera.aspect > 0 && camera.aspect < 0.85
    const fovMin = portrait ? FOV_MIN_PORTRAIT : FOV_MIN
    const fovMax = portrait ? FOV_MAX_PORTRAIT : FOV_MAX
    return { fov: THREE.MathUtils.lerp(fovMin, fovMax, thrustT * thrustT) }
  }

  function applyChase(fov: number): void {
    camera.position.copy(desiredPos)
    camera.quaternion.copy(chaseQuat)
    camera.up.copy(dummy.up)
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
  }

  return {
    holdLaunch,
    getPhase() {
      return phase
    },
    update(dt, shipPos, shipQuat, thrustLevel, _shipBankAngle, angularVelocity, flags) {
      if (!flags.hasThrusted) {
        holdLaunch(shipPos, shipQuat)
        return
      }

      if (!wasThrusted) {
        wasThrusted = true
        poseLaunch(shipPos)
        fromPos.copy(camera.position)
        fromQuat.copy(camera.quaternion)
        if (flags.reducedMotion) {
          phase = 'chase'
          blendT = 1
        } else {
          phase = 'blend'
          blendT = 0
        }
      }

      const chase = computeChase(dt, shipPos, shipQuat, thrustLevel, angularVelocity)

      if (phase === 'blend') {
        const safeDt = Number.isFinite(dt) && dt > 0 ? Math.min(dt, 0.05) : 1 / 60
        blendT = Math.min(1, blendT + safeDt / LAUNCH_BLEND_S)
        const t = smoothstep01(blendT)
        camera.position.lerpVectors(fromPos, desiredPos, t)
        camera.quaternion.slerpQuaternions(fromQuat, chaseQuat, t)
        camera.up.copy(worldUp).lerp(dummy.up, t).normalize()
        const fov = THREE.MathUtils.lerp(launchFov, chase.fov, t)
        if (Math.abs(camera.fov - fov) > 0.01) {
          camera.fov = fov
          camera.updateProjectionMatrix()
        }
        if (blendT >= 1) phase = 'chase'
        return
      }

      applyChase(chase.fov)
    },
  }
}
