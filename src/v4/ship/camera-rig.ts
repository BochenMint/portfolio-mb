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

/** Cinematic start — ship-local 3/4 rear/top. Distance is fitted from the
 * live hull AABB (MB Kite ~35×7.4), not the old T-hull constants. */
export type HullFit = {
  length: number
  span: number
  height: number
}

const LAUNCH_FOV = 50
const LAUNCH_BLEND_S = 0.95
const LAUNCH_WIDTH_TARGET = 0.37
const DEFAULT_HULL: HullFit = { length: 34, span: 7.4, height: 3.3 }

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

function smoothstep01(t: number): number {
  const x = THREE.MathUtils.clamp(t, 0, 1)
  return x * x * (3 - 2 * x)
}

function readHull(fit?: HullFit | null): HullFit {
  const length = fit?.length
  const span = fit?.span
  const height = fit?.height
  return {
    length: Number.isFinite(length) && (length as number) > 8 ? (length as number) : DEFAULT_HULL.length,
    span: Number.isFinite(span) && (span as number) > 2 ? (span as number) : DEFAULT_HULL.span,
    height: Number.isFinite(height) && (height as number) > 1 ? (height as number) : DEFAULT_HULL.height,
  }
}

function launchProfile(aspect: number): {
  fov: number
  sideOverBack: number
  heightOverBack: number
  widthTarget: number
  cyTarget: number
  bottomNdc: number
  lookAheadMul: number
  lookLiftMul: number
} {
  // Portrait is a different shot: extra pullback, milder look-down, room
  // above the start dock. Do not reuse the desktop pose.
  if (aspect > 0 && aspect < 0.62) {
    return {
      fov: 55,
      sideOverBack: 0.24,
      heightOverBack: 0.5,
      widthTarget: 0.4,
      cyTarget: 0.54,
      bottomNdc: -0.62,
      lookAheadMul: 0.9,
      lookLiftMul: 2.2,
    }
  }
  if (aspect > 0 && aspect < 0.85) {
    return {
      fov: 53,
      sideOverBack: 0.26,
      heightOverBack: 0.46,
      widthTarget: 0.38,
      cyTarget: 0.56,
      bottomNdc: -0.66,
      lookAheadMul: 0.8,
      lookLiftMul: 2.0,
    }
  }
  return {
    fov: LAUNCH_FOV,
    sideOverBack: 0.32,
    heightOverBack: 0.48,
    widthTarget: LAUNCH_WIDTH_TARGET,
    cyTarget: 0.62,
    bottomNdc: -0.74,
    lookAheadMul: 0.55,
    lookLiftMul: 2.1,
  }
}

export function createCameraRig(camera: THREE.PerspectiveCamera, hullFit?: HullFit | null): CameraRig {
  const hull = readHull(hullFit)
  const hullCorners: THREE.Vector3[] = []
  for (const sx of [-0.5, 0.5] as const) {
    for (const sy of [-0.5, 0.5] as const) {
      for (const sz of [-0.5, 0.5] as const) {
        hullCorners.push(new THREE.Vector3(sx * hull.span, sy * hull.height, sz * hull.length))
      }
    }
  }
  const cornerWorld = new THREE.Vector3()
  const ndc = new THREE.Vector3()

  const desiredPos = new THREE.Vector3()
  const lookTarget = new THREE.Vector3()
  const forward = new THREE.Vector3()
  const shipUp = new THREE.Vector3()
  const localOffset = new THREE.Vector3()
  const smoothedLocal = new THREE.Vector3(CHASE_SIDE, CHASE_HEIGHT, CHASE_BACK)
  const deflect = new THREE.Vector3()
  const viewDir = new THREE.Vector3()
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

  function poseLaunch(shipPos: THREE.Vector3, shipQuat: THREE.Quaternion): void {
    const aspect = camera.aspect > 0.05 ? camera.aspect : 1.6
    const profile = launchProfile(aspect)
    launchFov = profile.fov

    forward.set(0, 0, -1).applyQuaternion(shipQuat)
    safeNormalize(forward, fwdFallback)
    shipUp.set(0, 1, 0).applyQuaternion(shipQuat)
    safeNormalize(shipUp, upFallback)
    right.set(1, 0, 0).applyQuaternion(shipQuat)
    if (right.lengthSq() < 1e-8) right.crossVectors(forward, worldUp)
    right.normalize()

    dummy.near = camera.near
    dummy.far = camera.far
    dummy.aspect = aspect
    dummy.fov = launchFov
    dummy.up.copy(worldUp)

    const hypot = Math.hypot(1, profile.heightOverBack, profile.sideOverBack)
    const vfov = THREE.MathUtils.degToRad(launchFov)
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect)
    const projected = hull.length * 0.72 + hull.span * 0.85
    let dist = projected / Math.max(0.12, profile.widthTarget * 2 * Math.tan(hfov / 2))
    const distMin = hull.length * 1.05
    const distMax = hull.length * 3.2
    dist = THREE.MathUtils.clamp(dist, distMin, distMax)

    let lookAhead = hull.length * profile.lookAheadMul
    let lookLift = hull.height * profile.lookLiftMul
    const lookAheadMin = hull.length * 0.12
    const lookAheadMax = hull.length * 2.2

    const applyPose = () => {
      const back = dist / hypot
      launchPos.copy(shipPos)
        .addScaledVector(forward, -back)
        .addScaledVector(worldUp, back * profile.heightOverBack)
        .addScaledVector(right, back * profile.sideOverBack)
      launchLook.copy(shipPos)
        .addScaledVector(forward, lookAhead)
        .addScaledVector(worldUp, lookLift)
      dummy.fov = launchFov
      dummy.position.copy(launchPos)
      dummy.lookAt(launchLook)
      dummy.updateProjectionMatrix()
      dummy.updateMatrixWorld(true)
    }

    for (let i = 0; i < 10; i++) {
      applyPose()
      let minX = Infinity
      let maxX = -Infinity
      let minY = Infinity
      let maxY = -Infinity
      for (const local of hullCorners) {
        cornerWorld.copy(local).applyQuaternion(shipQuat).add(shipPos)
        ndc.copy(cornerWorld).project(dummy)
        if (!Number.isFinite(ndc.x + ndc.y)) continue
        minX = Math.min(minX, ndc.x)
        maxX = Math.max(maxX, ndc.x)
        minY = Math.min(minY, ndc.y)
        maxY = Math.max(maxY, ndc.y)
      }
      if (!Number.isFinite(minX)) break

      const widthFrac = (maxX - minX) * 0.5
      const cy = 0.5 - (minY + maxY) * 0.25
      const clippedBottom = minY < profile.bottomNdc
      const clipped = minX < -0.9 || maxX > 0.9 || maxY > 0.92 || clippedBottom

      if (clippedBottom) {
        lookAhead = Math.max(lookAheadMin, lookAhead * 0.78)
        lookLift = Math.max(hull.height * 0.3, lookLift * 0.88)
        dist = Math.min(distMax, dist * 1.07)
        continue
      }
      if (clipped) {
        dist = Math.min(distMax, dist * 1.08)
        continue
      }

      if (widthFrac > 0.02) {
        const next = dist * (widthFrac / profile.widthTarget)
        dist = THREE.MathUtils.clamp(dist + (next - dist) * 0.55, distMin, distMax)
      }

      if (cy < profile.cyTarget - 0.04) {
        lookAhead = Math.min(lookAheadMax, lookAhead + hull.length * 0.06)
        lookLift = Math.min(hull.height * 5, lookLift + hull.height * 0.2)
      } else if (cy > profile.cyTarget + 0.05) {
        lookAhead = Math.max(lookAheadMin, lookAhead - hull.length * 0.08)
        lookLift = Math.max(hull.height * 0.3, lookLift - hull.height * 0.18)
      }

      ndc.copy(BLACK_HOLE_POS).project(dummy)
      if (Number.isFinite(ndc.y)) {
        const bhCy = 0.5 - ndc.y * 0.5
        if (bhCy > 0.44 && !clippedBottom) {
          lookAhead = Math.min(lookAheadMax, lookAhead + hull.length * 0.05)
        }
      }

      lookAhead = THREE.MathUtils.clamp(lookAhead, lookAheadMin, lookAheadMax)
      lookLift = THREE.MathUtils.clamp(lookLift, hull.height * 0.3, hull.height * 5)
    }

    applyPose()
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
    phase = 'launch'
    blendT = 0
    wasThrusted = false
    pullbackSmoothed = 0
    deflect.set(0, 0, 0)
    smoothedLocal.set(CHASE_SIDE, CHASE_HEIGHT, CHASE_BACK)
    poseLaunch(shipPos, shipQuat)
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
        poseLaunch(shipPos, shipQuat)
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
