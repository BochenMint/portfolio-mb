import { PLANET_SLOTS, type PlanetId } from '../engine/world-anchors'
import { formatMissionTime } from '../engine/format'
import { MAIN_THRUST_ACCEL } from '../ship/controls'

export type HudState = {
  speed: number
  thrust: number
  hasThrusted: boolean
  /** Elapsed mission time in ms — 0 / static until the first thrust of the
   * run starts the clock (GameShell owns the start/stop logic). */
  missionMs: number
  discovered: ReadonlySet<PlanetId>
  /** Current gravitational acceleration at the ship's position (u/s^2, see
   * engine/gravity.ts's gravityAccelAt) — drives the fairness warning below. */
  gravityAccel: number
}

export type Hud = {
  update(state: HudState): void
  dispose(): void
}

const LEGEND_HIDE_DELAY_MS = 8000

/** Gravity starts to meaningfully cut into thrust authority past this
 * fraction of MAIN_THRUST_ACCEL — roughly r < 95u (engine/gravity.ts). */
const GRAVITY_WARNING_RATIO = 0.4

/**
 * Plain-DOM HUD overlay — deliberately not React state, so it can update every
 * RAF frame without triggering component re-renders.
 */
export function createHud(container: HTMLElement): Hud {
  const root = document.createElement('div')
  root.className = 'v4-hud'

  const pipsMarkup = PLANET_SLOTS.map((slot) => `<span class="v4-hud__pip" data-planet="${slot.id}"></span>`).join('')

  root.innerHTML = `
    <div class="v4-hud__panel v4-hud__speed">
      <div class="v4-hud__label">PRĘDKOŚĆ</div>
      <div class="v4-hud__speed-row">
        <span class="v4-hud__speed-value">0</span>
        <span class="v4-hud__speed-unit">u/s</span>
      </div>
      <div class="v4-hud__thrust-bar"><div class="v4-hud__thrust-fill"></div></div>
    </div>

    <div class="v4-hud__panel v4-hud__mission-status">
      <div class="v4-hud__label">CZAS MISJI</div>
      <div class="v4-hud__timer">00:00.0</div>
      <div class="v4-hud__pips">${pipsMarkup}</div>
    </div>

    <div class="v4-hud__panel v4-hud__mission">
      MISJA: znajdź nowoczesną stronę dla swojego biznesu
    </div>

    <div class="v4-hud__warning">UWAGA: STUDNIA GRAWITACYJNA</div>

    <div class="v4-hud__legend">
      <span>W/S/A/D</span> — ster · <span>SPACJA</span> — ciąg · <span>SHIFT</span> — hamowanie
    </div>

    <div class="v4-hud__links">
      <a href="/v4/assets/ATTRIBUTION.md" target="_blank" rel="noopener">Assety i licencje</a>
      <a href="/">&larr; klasyczne portfolio</a>
    </div>
  `

  container.appendChild(root)

  const speedValueEl = root.querySelector<HTMLElement>('.v4-hud__speed-value')!
  const thrustFillEl = root.querySelector<HTMLElement>('.v4-hud__thrust-fill')!
  const legendEl = root.querySelector<HTMLElement>('.v4-hud__legend')!
  const timerEl = root.querySelector<HTMLElement>('.v4-hud__timer')!
  const warningEl = root.querySelector<HTMLElement>('.v4-hud__warning')!
  const pipEls = Array.from(root.querySelectorAll<HTMLElement>('.v4-hud__pip'))

  const gravityWarningThreshold = GRAVITY_WARNING_RATIO * MAIN_THRUST_ACCEL

  let legendShown = false
  let legendTimer = 0

  return {
    update(state) {
      speedValueEl.textContent = String(Math.round(state.speed)).padStart(2, '0')
      thrustFillEl.style.transform = `scaleX(${Math.max(0, Math.min(1, state.thrust))})`

      if (state.hasThrusted && !legendShown) {
        legendShown = true
        legendEl.classList.add('is-visible')
        legendTimer = window.setTimeout(() => {
          legendEl.classList.remove('is-visible')
        }, LEGEND_HIDE_DELAY_MS)
      }

      timerEl.textContent = formatMissionTime(state.missionMs)
      warningEl.classList.toggle('is-visible', state.gravityAccel > gravityWarningThreshold)
      for (const pipEl of pipEls) {
        const id = pipEl.dataset.planet as PlanetId
        pipEl.classList.toggle('is-found', state.discovered.has(id))
      }
    },
    dispose() {
      window.clearTimeout(legendTimer)
      root.remove()
    },
  }
}
