import * as THREE from 'three'

// Behind (+Z, since ship-forward is local -Z) and above the ship, in ship space.
// Hull is ~22u long — sit well back so the whole silhouette reads in frame.
const CHASE_OFFSET = new THREE.Vector3(0, 7, 34)
const LOOK_AHEAD = 20
const POSITION_LERP_RATE = 5.5 // /s — exponential approach, framerate independent
const FOV_MIN = 60
const FOV_MAX = 66

/** Camera inherits only a fraction of the ship's bank — full inherit would
 * feel like the camera is welded to the hull; this keeps the horizon tilt
 * readable as "dynamic" without being disorienting. */
const BANK_INHERIT = 0.6
/** Camera's own roll lags slightly behind the ship's (smaller/slower than
 * the ship's own ROLL_RESPONSE in ship/controls.ts) for a touch of extra
 * weight on top of the ship's bank-to-turn response. */
const BANK_LERP_RATE = 4.5 // /s

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

/** Chwilowe odchylenie kamery podczas manewrów (w przestrzeni statku) —
 * proporcjonalne do prędkości kątowych, sprężyście wraca do zera po
 * zakończeniu manewru: „kamera odchyla się, ale wraca do pierwotnego
 * położenia względem statku" (feedback Marcina). */
const DEFLECT_PER_RATE = 2.4 // u odchylenia na rad/s
const DEFLECT_MAX = 4.0 // u
const DEFLECT_RESPONSE = 5 // /s

export function createCameraRig(camera: THREE.PerspectiveCamera): CameraRig {
  const desiredPos = new THREE.Vector3()
  const lookTarget = new THREE.Vector3()
  const forward = new THREE.Vector3()
  const offsetWorld = new THREE.Vector3()
  const upVec = new THREE.Vector3()
  const offsetLocal = new THREE.Vector3()
  const deflect = new THREE.Vector3()
  let primed = false
  let camBank = 0

  camera.fov = FOV_MIN
  camera.updateProjectionMatrix()

  return {
    update(dt, shipPos, shipQuat, thrustLevel, shipBankAngle, angularVelocity) {
      // Cel odchylenia: pitch odchyla kamerę w pionie, skręt — w bok
      // (przeciwnie do ruchu dziobu, jak głowa pilota pod przeciążeniem).
      if (angularVelocity) {
        const tx = THREE.MathUtils.clamp(-angularVelocity.y * DEFLECT_PER_RATE, -DEFLECT_MAX, DEFLECT_MAX)
        const ty = THREE.MathUtils.clamp(angularVelocity.x * DEFLECT_PER_RATE, -DEFLECT_MAX, DEFLECT_MAX)
        const k = 1 - Math.exp(-DEFLECT_RESPONSE * dt)
        deflect.x += (tx - deflect.x) * k
        deflect.y += (ty - deflect.y) * k
      }

      offsetLocal.copy(CHASE_OFFSET).add(deflect)
      offsetWorld.copy(offsetLocal).applyQuaternion(shipQuat)
      desiredPos.copy(shipPos).add(offsetWorld)

      if (!primed) {
        camera.position.copy(desiredPos)
        camBank = -shipBankAngle * BANK_INHERIT
        primed = true
      } else {
        const lerpFactor = 1 - Math.exp(-POSITION_LERP_RATE * dt)
        camera.position.lerp(desiredPos, lerpFactor)
      }

      forward.set(0, 0, -1).applyQuaternion(shipQuat)

      // Partial, slightly-lagged roll inherit: tilt the camera's up vector
      // around the shared forward axis rather than snapping to the ship's
      // full bank — see BANK_INHERIT/BANK_LERP_RATE above. Negated because
      // applyAxisAngle uses the world-space FORWARD axis (-Z-ish), which is
      // the opposite sense from the ship's own local +Z bank axis — without
      // the flip the horizon would tilt away from the hull's lean.
      const targetCamBank = -shipBankAngle * BANK_INHERIT
      camBank += (targetCamBank - camBank) * (1 - Math.exp(-BANK_LERP_RATE * dt))
      upVec.set(0, 1, 0).applyAxisAngle(forward, camBank)
      camera.up.copy(upVec)

      lookTarget.copy(shipPos).addScaledVector(forward, LOOK_AHEAD)
      camera.lookAt(lookTarget)

      const fov = THREE.MathUtils.lerp(FOV_MIN, FOV_MAX, THREE.MathUtils.clamp(thrustLevel, 0, 1))
      if (Math.abs(camera.fov - fov) > 0.01) {
        camera.fov = fov
        camera.updateProjectionMatrix()
      }
    },
  }
}
