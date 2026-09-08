import * as THREE from 'three'
import type { TouchInput } from './touchControls'

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
 * Physics quaternion is pitch + yaw only. Cosmetic bank lives in `bankAngle`
 * and is applied to the mesh in GameShell — it is NEVER integrated into the
 * physics quat. Integrating roll-from-bank in object space while yawing is
 * what left the hull permanently twisted to the left (non-commutative
 * composition + leftover ω.z). After each pitch/yaw step we also kill
 * accumulated roll vs world-up (Euler YXZ, z=0) so yaw cannot masquerade
 * as roll and the chase camera cannot drift under the belly.
 */

const X_AXIS = new THREE.Vector3(1, 0, 0)
const Y_AXIS = new THREE.Vector3(0, 1, 0)

const DEG2RAD = Math.PI / 180

const PITCH_MAX = 1.9 // rad/s
/** Exponential pitch-rate response — same feel as yaw, less twitch than raw accel. */
const PITCH_ATTACK = 6.5 // 1/s
const PITCH_RELEASE = 8 // 1/s
/** Per-second angular damping on manual pitch rate (framerate-independent). */
const PITCH_DAMPING = 3.2 // 1/s

/** Direct yaw-rate command from A/D. */
const YAW_MAX = 1.15 // rad/s
/** Exponential approach rate of actual yaw toward its target while a turn key is held. */
const YAW_ATTACK = 7 // 1/s
/** Exponential approach rate of actual yaw back toward 0 once released — slightly snappier than attack. */
const YAW_RELEASE = 9 // 1/s

/** Cosmetic bank magnitude at full yaw rate — hull leans into the turn, no effect on heading. */
const BANK_MAX_RAD = 52 * DEG2RAD
/** Extra bank trim from Q/E, added on top of the yaw-derived target — visual only. */
const BANK_TRIM_MAX_RAD = 20 * DEG2RAD
/** Exponential approach rate of the cosmetic bank toward its target. */
const BANK_RESPONSE = 5 // 1/s
/** Automatic nose-up pitch coupling at full yaw rate — the "podnosimy dziób" look. */
const PITCH_COUPLE = 0.1 // rad/s

const MAIN_THRUST_ACCEL = 54 // u/s^2 — bumped for snappier Normandy cruise
const BRAKE_ACCEL = 30 // u/s^2 — weaker than main thrust
const PASSIVE_DAMPING = 0.999 // flat per-frame multiplier — inertia persists
const SOFT_SPEED_CAP = 92 // u/s, asymptotic

const THRUST_SPOOL_UP = 4.2 // 1/s — slightly snappier spool for punchy Normandy thrust
const THRUST_SPOOL_DOWN = 2.4 // 1/s

/** Exported so ui/hud.ts can size its gravity-fairness warning threshold
 * (engine/gravity.ts) relative to how hard the ship can push back. */
export { MAIN_THRUST_ACCEL }

export type ControlsState = {
  position: THREE.Vector3
  quaternion: THREE.Quaternion
  velocity: THREE.Vector3
  angularVelocity: THREE.Vector3
  /** Current smoothed cosmetic bank angle, radians — positive = left (hull
   * rolls so the left wing dips). Purely visual: applied to the mesh in
   * GameShell, never written into the physics quaternion. */
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

export function createControls(startPosition: THREE.Vector3, touch?: TouchInput): Controls {
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
  const levelEuler = new THREE.Euler(0, 0, 0, 'YXZ')

  return {
    state,

    update(dt) {
      // ─── Pitch (W/S) — exponential rate chase, framerate-independent damping ─
      let pitchInput = 0
      if (has(PITCH_DOWN_KEYS)) pitchInput -= 1
      if (has(PITCH_UP_KEYS)) pitchInput += 1
      if (touch && (touch.pitch !== 0 || pitchInput === 0)) {
        pitchInput = Math.max(-1, Math.min(1, pitchInput + touch.pitch))
      }

      const targetPitchRate = pitchInput * PITCH_MAX
      const pitchResponse = pitchInput !== 0 ? PITCH_ATTACK : PITCH_RELEASE
      state.angularVelocity.x += (targetPitchRate - state.angularVelocity.x) * Math.min(1, pitchResponse * dt)
      state.angularVelocity.x *= Math.exp(-PITCH_DAMPING * dt)

      // ─── Direct yaw-rate command from A/D — precise, no bank coupling ──
      let turnInput = 0
      if (has(TURN_LEFT_KEYS)) turnInput += 1
      if (has(TURN_RIGHT_KEYS)) turnInput -= 1
      if (touch && (touch.turn !== 0 || turnInput === 0)) {
        turnInput = Math.max(-1, Math.min(1, turnInput + touch.turn))
      }

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
      state.bankAngle += (targetBank - state.bankAngle) * Math.min(1, BANK_RESPONSE * dt)
      // Visual only — do not integrate into the physics quat (that leftover
      // ω.z is what kept the hull rolled left after the turn ended).
      state.angularVelocity.z = 0

      // ─── Integrate rotation in local space (post-multiply → object-space axes) ─
      qx.setFromAxisAngle(X_AXIS, (state.angularVelocity.x + pitchCouple) * dt)
      qy.setFromAxisAngle(Y_AXIS, state.angularVelocity.y * dt)
      state.quaternion.multiply(qx).multiply(qy)
      state.quaternion.normalize()

      // Kill accumulated roll so yaw cannot collect as a permanent left twist.
      // Skip when nearly vertical — YXZ gimbal would steal yaw into roll.
      levelEuler.setFromQuaternion(state.quaternion, 'YXZ')
      if (Math.abs(levelEuler.x) < 1.35) {
        levelEuler.z = 0
        state.quaternion.setFromEuler(levelEuler)
      }

      // ─── Linear thrust ──────────────────────────────────────────────────
      const thrustHeld = has(FORWARD_KEYS) || (touch?.thrust ?? false)
      const brakeHeld = has(BRAKE_KEYS) || (touch?.brake ?? false)
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
