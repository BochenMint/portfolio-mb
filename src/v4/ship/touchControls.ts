/**
 * Virtual stick + thrust/brake buttons for coarse-pointer devices.
 * Writes into a shared TouchInput object read by ship/controls.ts each frame.
 */

export type TouchInput = {
  pitch: number
  turn: number
  thrust: boolean
  brake: boolean
}

export type TouchControls = {
  input: TouchInput
  /** True when the overlay is mounted (coarse pointer). */
  active: boolean
  dispose(): void
}

const STICK_RADIUS_PX = 52
const DEADZONE = 0.12

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

function applyDeadzone(v: number) {
  const a = Math.abs(v)
  if (a < DEADZONE) return 0
  return Math.sign(v) * ((a - DEADZONE) / (1 - DEADZONE))
}

export function createTouchControls(container: HTMLElement): TouchControls {
  const input: TouchInput = { pitch: 0, turn: 0, thrust: false, brake: false }

  const coarse = window.matchMedia('(pointer: coarse)').matches
  if (!coarse) {
    return { input, active: false, dispose() {} }
  }

  const root = document.createElement('div')
  root.className = 'v4-touch'
  root.innerHTML = `
    <div class="v4-touch__stick-zone" aria-hidden="true">
      <div class="v4-touch__stick-ring"></div>
      <div class="v4-touch__stick-knob"></div>
    </div>
    <div class="v4-touch__actions">
      <button type="button" class="v4-touch__btn v4-touch__btn--brake" data-action="brake" aria-label="Hamowanie">HAM</button>
      <button type="button" class="v4-touch__btn v4-touch__btn--thrust" data-action="thrust" aria-label="Ciąg główny">CIĄG</button>
    </div>
  `
  container.appendChild(root)

  const stickZone = root.querySelector<HTMLElement>('.v4-touch__stick-zone')!
  const stickKnob = root.querySelector<HTMLElement>('.v4-touch__stick-knob')!
  const thrustBtn = root.querySelector<HTMLButtonElement>('[data-action="thrust"]')!
  const brakeBtn = root.querySelector<HTMLButtonElement>('[data-action="brake"]')!

  let stickPointerId: number | null = null
  let stickCenterX = 0
  let stickCenterY = 0

  function resetStick() {
    stickPointerId = null
    input.pitch = 0
    input.turn = 0
    stickKnob.style.transform = 'translate(-50%, -50%)'
  }

  function updateStick(clientX: number, clientY: number) {
    const dx = clientX - stickCenterX
    const dy = clientY - stickCenterY
    const dist = Math.hypot(dx, dy)
    const clamped = dist > STICK_RADIUS_PX ? STICK_RADIUS_PX / dist : 1
    const nx = (dx * clamped) / STICK_RADIUS_PX
    const ny = (dy * clamped) / STICK_RADIUS_PX
    stickKnob.style.transform = `translate(calc(-50% + ${nx * STICK_RADIUS_PX}px), calc(-50% + ${ny * STICK_RADIUS_PX}px))`
    // Stick forward (up on screen) = pitch nose down; left = turn left.
    input.pitch = applyDeadzone(clamp(-ny, -1, 1))
    input.turn = applyDeadzone(clamp(nx, -1, 1))
  }

  const onStickDown = (e: PointerEvent) => {
    if (stickPointerId !== null) return
    stickPointerId = e.pointerId
    stickZone.setPointerCapture(e.pointerId)
    const rect = stickZone.getBoundingClientRect()
    stickCenterX = rect.left + rect.width / 2
    stickCenterY = rect.top + rect.height / 2
    updateStick(e.clientX, e.clientY)
    e.preventDefault()
  }

  const onStickMove = (e: PointerEvent) => {
    if (e.pointerId !== stickPointerId) return
    updateStick(e.clientX, e.clientY)
    e.preventDefault()
  }

  const onStickUp = (e: PointerEvent) => {
    if (e.pointerId !== stickPointerId) return
    stickZone.releasePointerCapture(e.pointerId)
    resetStick()
    e.preventDefault()
  }

  stickZone.addEventListener('pointerdown', onStickDown)
  stickZone.addEventListener('pointermove', onStickMove)
  stickZone.addEventListener('pointerup', onStickUp)
  stickZone.addEventListener('pointercancel', onStickUp)

  const setBtn = (btn: HTMLButtonElement, active: boolean, key: 'thrust' | 'brake') => {
    input[key] = active
    btn.classList.toggle('is-active', active)
  }

  const holdBtn = (btn: HTMLButtonElement, key: 'thrust' | 'brake') => {
    const onDown = (e: PointerEvent) => {
      btn.setPointerCapture(e.pointerId)
      setBtn(btn, true, key)
      e.preventDefault()
    }
    const onUp = (e: PointerEvent) => {
      if (btn.hasPointerCapture(e.pointerId)) btn.releasePointerCapture(e.pointerId)
      setBtn(btn, false, key)
      e.preventDefault()
    }
    btn.addEventListener('pointerdown', onDown)
    btn.addEventListener('pointerup', onUp)
    btn.addEventListener('pointercancel', onUp)
    return () => {
      btn.removeEventListener('pointerdown', onDown)
      btn.removeEventListener('pointerup', onUp)
      btn.removeEventListener('pointercancel', onUp)
    }
  }

  const unbindThrust = holdBtn(thrustBtn, 'thrust')
  const unbindBrake = holdBtn(brakeBtn, 'brake')

  const onBlur = () => {
    resetStick()
    setBtn(thrustBtn, false, 'thrust')
    setBtn(brakeBtn, false, 'brake')
  }
  window.addEventListener('blur', onBlur)

  return {
    input,
    active: true,
    dispose() {
      window.removeEventListener('blur', onBlur)
      stickZone.removeEventListener('pointerdown', onStickDown)
      stickZone.removeEventListener('pointermove', onStickMove)
      stickZone.removeEventListener('pointerup', onStickUp)
      stickZone.removeEventListener('pointercancel', onStickUp)
      unbindThrust()
      unbindBrake()
      root.remove()
    },
  }
}
