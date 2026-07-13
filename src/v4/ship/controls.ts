import * as THREE from 'three'

/**
 * Newtonian flight controls with DIRECT yaw + cosmetic coordinated lean.
 *
 * Key mapping (flight-stick convention — physical push/pull, not screen direction):
 *   W / ArrowUp    — pitch nose DOWN  (stick forward)
 *   S / ArrowDown  — pitch nose UP    (stick back)
 *   A / ArrowLeft  — turn left  (nose carves left; hull leans into it, left wing down)
 *   D / ArrowRight — turn right (nose carves right; hull leans into it, right wing down)
 *   Q              — bank trim left  (cosmetic only, no effect on heading)
 *   E              — bank trim right (cosmetic only, no effect on heading)
 *   Space          — main thrust along +forward
 *   Shift          — retro-brake (thrust opposite velocity, weaker than main)
 *
 * A/D command a YAW RATE directly — target = ±YAW_MAX, and the actual rate
 * chases it with a fast exponential response (YAW_ATTACK while a key is
 * held, YAW_RELEASE once it's let go). This is precision-first: heading
 * starts responding within ~150ms of a keypress and stops promptly on
 * release, so short taps produce small, discrete heading changes instead of
 * a slow lag-then-drift.
 *
 * Bank (roll) is purely COSMETIC and reads off the current yaw rate — it no
 * longer feeds back into yaw. targetBank tracks (yawRate / YAW_MAX) *
 * BANK_MAX, so holding D (turning right, yaw rate negative) leans the hull
 * into the turn with the RIGHT wing down, and releasing auto-levels the
 * bank back toward 0 (or the Q/E trim value) as the yaw rate decays. Q/E add
 * a trim offset to this visual target only.
 *
 * A slight automatic nose-up (PITCH_COUPLE) rides along in proportion to
 * the current yaw rate, for the "podnosimy dziób" look while turning.
 *
 * W/S remain pure manual pitch (own accel/clamp/damping). Linear velocity
 * persists after thrust stops — releasing SPACE must NOT stop the ship —
 * with only a tiny passive damping and a soft asymptotic speed cap.
 */

const X_AXIS = new THREE.Vector3(1, 0, 0)
const Y_AXIS = new THREE.Vector3(0, 1, 0)
const Z_AXIS = new THREE.Vector3(0, 0, 1)

const DEG2RAD = Math.PI / 180

const PITCH_ACCEL = 4.2 // rad/s^2 — góra-dół wyraźnie mocniejsze (feedback: „zwiększ możliwość sterowania góra-dół")
const MAX_PITCH_RATE = 1.9 // rad/s
const ANGULAR_DAMPING = 0.9 // flat per-frame multiplier on the manual pitch rate (house style — frame-based, not dt-scaled)

/** Direct yaw-rate command from A/D. */
const YAW_MAX = 1.15 // rad/s
/** Exponential approach rate of actual yaw toward its target while a turn key is held. */
const YAW_ATTACK = 7 // 1/s
/** Exponential approach rate of actual yaw back toward 0 once released — slightly snappier than attack. */
const YAW_RELEASE = 9 // 1/s

/** Cosmetic bank magnitude at full yaw rate — hull leans into the turn, no effect on heading. */
const BANK_MAX_RAD = 48 * DEG2RAD
/** Extra bank trim from Q/E, added on top of the yaw-derived target — visual only. */
const BANK_TRIM_MAX_RAD = 20 * DEG2RAD
/** Exponential approach rate of the cosmetic bank toward its target. */
const BANK_RESPONSE = 5 // 1/s
/** Automatic nose-up pitch coupling at full yaw rate — the "podnosimy dziób" look. */
const PITCH_COUPLE = 0.1 // rad/s

const MAIN_THRUST_ACCEL = 44 // u/s^2 — „przyspiesz normandię"
const BRAKE_ACCEL = 26 // u/s^2 — weaker than main thrust
const PASSIVE_DAMPING = 0.999 // flat per-frame multiplier — inertia persists
const SOFT_SPEED_CAP = 80 // u/s, asymptotic

const THRUST_SPOOL_UP = 3.5 // 1/s
const THRUST_SPOOL_DOWN = 2.0 // 1/s

/** Exported so ui/hud.ts can size its gravity-fairness warning threshold
 * (engine/gravity.ts) relative to how hard the ship can push back. */
export { MAIN_THRUST_ACCEL }

export type ControlsState = {
  position: THREE.Vector3
  quaternion: THREE.Quaternion
  velocity: THREE.Vector3
  angularVelocity: THREE.Vector3
  /** Current smoothed cosmetic bank angle, radians — positive = left (hull
   * rolls so the left wing dips). Purely visual: read by camera-rig.ts for
   * its partial roll inherit, and has no effect on yaw/heading. */
  bankAngle: number
  /** Smoothed 0..1 — drives engine emissive/glow, not raw physics. */
  thrustLevel: number
  /** Smoothed 0..1 — retro-brake visual feedback. */
  brakeLevel: number
  speed: number
  hasThrusted: boolean
}

export type Controls = {
  state: ControlsState
  update(dt: number): void
  dispose(): void
}

const FORWARD_KEYS = new Set(['Space'])
const BRAKE_KEYS = new Set(['ShiftLeft', 'ShiftRight'])
const PITCH_DOWN_KEYS = new Set(['KeyW', 'ArrowUp'])
const PITCH_UP_KEYS = new Set(['KeyS', 'ArrowDown'])
const TURN_LEFT_KEYS = new Set(['KeyA', 'ArrowLeft'])
const TURN_RIGHT_KEYS = new Set(['KeyD', 'ArrowRight'])
const TRIM_LEFT_KEYS = new Set(['KeyQ'])
const TRIM_RIGHT_KEYS = new Set(['KeyE'])

const PREVENT_DEFAULT_CODES = new Set([
  'Space',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
])

export function createControls(startPosition: THREE.Vector3): Controls {
  const pressed = new Set<string>()

  const state: ControlsState = {
    position: startPosition.clone(),
    quaternion: new THREE.Quaternion(),
    velocity: new THREE.Vector3(),
    angularVelocity: new THREE.Vector3(),
    bankAngle: 0,
    thrustLevel: 0,
    brakeLevel: 0,
    speed: 0,
    hasThrusted: false,
  }

  const onKeyDown = (e: KeyboardEvent) => {
    pressed.add(e.code)
    if (PREVENT_DEFAULT_CODES.has(e.code)) e.preventDefault()
  }
  const onKeyUp = (e: KeyboardEvent) => {
    pressed.delete(e.code)
  }
  const onBlur = () => pressed.clear()

  window.addEventListener('keydown', onKeyDown, { passive: false })
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', onBlur)

  const has = (set: Set<string>) => {
    for (const code of set) if (pressed.has(code)) return true
    return false
  }

  const forwardVec = new THREE.Vector3()
  const qx = new THREE.Quaternion()
  const qy = new THREE.Quaternion()
  const qz = new THREE.Quaternion()

  return {
    state,

    update(dt) {
      // ─── Manual pitch (W/S) — own accel/clamp/damping, unchanged character ──
      let pitchInput = 0
      if (has(PITCH_DOWN_KEYS)) pitchInput -= 1
      if (has(PITCH_UP_KEYS)) pitchInput += 1

      state.angularVelocity.x += pitchInput * PITCH_ACCEL * dt
      state.angularVelocity.x = THREE.MathUtils.clamp(state.angularVelocity.x, -MAX_PITCH_RATE, MAX_PITCH_RATE)
      state.angularVelocity.x *= ANGULAR_DAMPING

      // ─── Direct yaw-rate command from A/D — precise, no bank coupling ──
      let turnInput = 0
      if (has(TURN_LEFT_KEYS)) turnInput += 1
      if (has(TURN_RIGHT_KEYS)) turnInput -= 1

      const targetYawRate = turnInput * YAW_MAX
      const yawResponse = targetYawRate !== 0 ? YAW_ATTACK : YAW_RELEASE
      state.angularVelocity.y += (targetYawRate - state.angularVelocity.y) * Math.min(1, yawResponse * dt)

      // Nose-up pitch coupling scales with the current yaw rate (cosmetic).
      const pitchCouple = PITCH_COUPLE * Math.abs(state.angularVelocity.y) / YAW_MAX

      // ─── Cosmetic bank target: yaw-derived lean-into-turn + Q/E trim ──
      // No feedback into yaw — this only ever drives the visual roll below.
      let trimInput = 0
      if (has(TRIM_LEFT_KEYS)) trimInput += 1
      if (has(TRIM_RIGHT_KEYS)) trimInput -= 1

      const targetBank = (state.angularVelocity.y / YAW_MAX) * BANK_MAX_RAD + trimInput * BANK_TRIM_MAX_RAD

      const prevBank = state.bankAngle
      state.bankAngle += (targetBank - state.bankAngle) * Math.min(1, BANK_RESPONSE * dt)

      // Roll rate that reproduces this frame's bank delta. Positive Z_AXIS
      // rotation physically rolls the hull LEFT (right wing up), matching
      // the "positive bankAngle = left" convention directly — no negation.
      const rollDelta = state.bankAngle - prevBank
      state.angularVelocity.z = dt > 1e-6 ? rollDelta / dt : 0

      // ─── Integrate rotation in local space (post-multiply → object-space axes) ─
      qx.setFromAxisAngle(X_AXIS, (state.angularVelocity.x + pitchCouple) * dt)
      qy.setFromAxisAngle(Y_AXIS, state.angularVelocity.y * dt)
      qz.setFromAxisAngle(Z_AXIS, state.angularVelocity.z * dt)
      state.quaternion.multiply(qx).multiply(qy).multiply(qz)
      state.quaternion.normalize()

      // ─── Linear thrust ──────────────────────────────────────────────────
      const thrustHeld = has(FORWARD_KEYS)
      const brakeHeld = has(BRAKE_KEYS)
      if (thrustHeld) state.hasThrusted = true

      forwardVec.set(0, 0, -1).applyQuaternion(state.quaternion)

      const speed = state.velocity.length()
      if (thrustHeld) {
        const capFactor = Math.max(0, 1 - (speed / SOFT_SPEED_CAP) ** 2)
        state.velocity.addScaledVector(forwardVec, MAIN_THRUST_ACCEL * capFactor * dt)
      }
      if (brakeHeld && speed > 0.05) {
        const brakeDir = state.velocity.clone().normalize()
        const brakeAmount = Math.min(BRAKE_ACCEL * dt, speed)
        state.velocity.addScaledVector(brakeDir, -brakeAmount)
      }

      state.velocity.multiplyScalar(PASSIVE_DAMPING)
      state.position.addScaledVector(state.velocity, dt)
      state.speed = state.velocity.length()

      // ─── Smoothed levels for HUD / engine glow ─────────────────────────
      const thrustTarget = thrustHeld ? 1 : 0
      const thrustRate = thrustHeld ? THRUST_SPOOL_UP : THRUST_SPOOL_DOWN
      state.thrustLevel += (thrustTarget - state.thrustLevel) * Math.min(1, thrustRate * dt)

      const brakeTarget = brakeHeld ? 1 : 0
      state.brakeLevel += (brakeTarget - state.brakeLevel) * Math.min(1, 4 * dt)
    },

    dispose() {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
      pressed.clear()
    },
  }
}
