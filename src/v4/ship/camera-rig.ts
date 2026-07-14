import * as THREE from 'three'

// Behind (+Z, since ship-forward is local -Z) and above the ship, in ship space.
// Hull is ~22u long — sit well back so the whole silhouette reads in frame.
const CHASE_OFFSET = new THREE.Vector3(0, 7, 34)
const LOOK_AHEAD = 20
const POSITION_LERP_RATE = 5.5 // /s — exponential approach, framerate independent
const FOV_MIN = 60
const FOV_MAX = 66

/** Up kamery podąża za PEŁNĄ orientacją statku (z tym lagiem) — bez
 * osobliwości world-up przy pętlach; lag daje naturalne „dociąganie"
 * horyzontu przy szybkich manewrach. */
const UP_LERP_RATE = 4.5 // /s

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
  const upSmoothed = new THREE.Vector3(0, 1, 0)
  let primed = false

  camera.fov = FOV_MIN
  camera.updateProjectionMatrix()

  return {
    update(dt, shipPos, shipQuat, thrustLevel, _shipBankAngle, angularVelocity) {
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
        upSmoothed.set(0, 1, 0).applyQuaternion(shipQuat)
        primed = true
      } else {
        const lerpFactor = 1 - Math.exp(-POSITION_LERP_RATE * dt)
        camera.position.lerp(desiredPos, lerpFactor)
      }

      forward.set(0, 0, -1).applyQuaternion(shipQuat)

      // Up kamery = up STATKU (z lekkim lagiem), nie up świata. Poprzednie
      // world-up + roll-only dawało klasyczny flip lookAt: przy pętli/pitchu
      // powyżej pionu kamera przeskakiwała o 180° i statek bywał „do góry
      // nogami względem kamery". Podążanie za pełną orientacją statku nie ma
      // osobliwości — kamera jest „nieruchoma względem statku", a lag daje
      // naturalne odchylenie przy manewrach.
      upVec.set(0, 1, 0).applyQuaternion(shipQuat)
      upSmoothed.lerp(upVec, 1 - Math.exp(-UP_LERP_RATE * dt)).normalize()
      camera.up.copy(upSmoothed)

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
