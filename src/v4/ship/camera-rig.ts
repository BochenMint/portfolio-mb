import * as THREE from 'three'

// Classic chase in SHIP space: +Y = dorsal, +Z = aft (forward is local -Z).
// World-up height was a frog trap — nose-up pitch puts "behind" below the keel.
const CHASE_SIDE = 0.15
const CHASE_HEIGHT = 5.4
const CHASE_BACK = 28
const LOOK_AHEAD = 18
const LOOK_HEIGHT = 0.8
const FOV_MIN = 50
const FOV_MAX = 56
const THRUST_PULLBACK = 5.5
const THRUST_PULLBACK_LERP = 4.5
const OFFSET_LERP_RATE = 10
const OFFSET_ANG_BOOST = 16

export type CameraRig = {
  update(
    dt: number,
    shipPos: THREE.Vector3,
    shipQuat: THREE.Quaternion,
    thrustLevel: number,
    shipBankAngle: number,
    angularVelocity?: THREE.Vector3,
  ): void
}

const DEFLECT_PER_RATE = 0.45
const DEFLECT_MAX = 0.9
const DEFLECT_RESPONSE = 8

const worldUp = new THREE.Vector3(0, 1, 0)
const fwdFallback = new THREE.Vector3(0, 0, -1)
const upFallback = new THREE.Vector3(0, 1, 0)

function safeNormalize(v: THREE.Vector3, fallback: THREE.Vector3): THREE.Vector3 {
  if (!Number.isFinite(v.x + v.y + v.z) || v.lengthSq() < 1e-10) return fallback.clone()
  return v.normalize()
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
  let pullbackSmoothed = 0

  camera.fov = FOV_MIN
  camera.updateProjectionMatrix()

  return {
    update(dt, shipPos, shipQuat, thrustLevel, _shipBankAngle, angularVelocity) {
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
      camera.position.copy(desiredPos)

      forward.set(0, 0, -1).applyQuaternion(shipQuat)
      safeNormalize(forward, fwdFallback)
      shipUp.set(0, 1, 0).applyQuaternion(shipQuat)
      safeNormalize(shipUp, upFallback)

      lookTarget.copy(shipPos).addScaledVector(forward, LOOK_AHEAD).addScaledVector(shipUp, LOOK_HEIGHT)

      // Physics quat is roll-free (controls.ts). Camera stays world-up so a
      // cosmetic mesh bank cannot put the belly at the top of the frame.
      viewDir.copy(lookTarget).sub(camera.position)
      if (viewDir.lengthSq() > 1e-8) {
        viewDir.normalize()
        camera.up.copy(Math.abs(viewDir.dot(worldUp)) > 0.92 ? shipUp : worldUp)
      } else {
        camera.up.copy(worldUp)
      }
      camera.lookAt(lookTarget)

      const fov = THREE.MathUtils.lerp(FOV_MIN, FOV_MAX, thrustT * thrustT)
      if (Math.abs(camera.fov - fov) > 0.01) {
        camera.fov = fov
        camera.updateProjectionMatrix()
      }
    },
  }
}
