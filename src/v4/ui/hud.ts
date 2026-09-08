import { PLANET_SLOTS, type PlanetId } from '../engine/world-anchors'
import { formatMissionTime } from '../engine/format'
import { MAIN_THRUST_ACCEL } from '../ship/controls'

const PORTFOLIO_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PORTFOLIO_URL) ||
  'https://marcinbochenek.com'


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
  /** Fresh run — start prompt and control legend come back. */
  reset(): void
  dispose(): void
}

const LEGEND_HIDE_DELAY_MS = 8000

/** Gravity starts to meaningfully cut into thrust authority past this
 * fraction of MAIN_THRUST_ACCEL — roughly r < 95u (engine/gravity.ts). */
const GRAVITY_WARNING_RATIO = 0.4

type HudOptions = {
  touchActive?: boolean
}

/**
 * Plain-DOM HUD overlay — deliberately not React state, so it can update every
 * RAF frame without triggering component re-renders.
 */
export function createHud(container: HTMLElement, opts: HudOptions = {}): Hud {
  // Production never shows an FPS readout. A stuck "0.00 fps" (mission
  // clock / first-frame dt=0) reads as a broken build — debug=1 only,
  // measured from performance.now() after a few valid frames.
  const debugFps =
    typeof location !== 'undefined' && new URLSearchParams(location.search).has('debug')
  for (const leftover of container.querySelectorAll('.stats, #stats, [class*="fps"]')) {
    leftover.remove()
  }

  const touchActive = opts.touchActive ?? false
  const legendControls = touchActive
    ? '<span>Lewy drążek</span> — lot · <span>Ciąg</span> — napęd · <span>Ham</span> — hamowanie'
    : '<span>W/S</span> — pochylenie · <span>A/D</span> — skręt · <span>Spacja</span> — ciąg · <span>Shift</span> — hamowanie'
  const startPrompt = touchActive
    ? 'Przytrzymaj <span class="v4-hud__start-keys">Ciąg</span>, aby uruchomić silniki'
    : 'Naciśnij <span class="v4-hud__start-keys">Spację</span>, aby uruchomić silniki'
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
    ${debugFps ? '<div class="v4-hud__panel v4-hud__fps" hidden>fps</div>' : ''}

    <div class="v4-hud__panel v4-hud__mission">
      Misja: znajdź nowoczesną stronę dla swojego biznesu
    </div>

    <div class="v4-hud__warning">Uwaga: studnia grawitacyjna</div>

    <div class="v4-hud__start-prompt">${startPrompt}</div>

    <div class="v4-hud__legend" aria-hidden="true">
      ${legendControls}
    </div>

    <div class="v4-hud__links">
      <a href="/v4/assets/ATTRIBUTION.md" target="_blank" rel="noopener">Assety i licencje</a>
      <a href="${PORTFOLIO_URL}">&larr; klasyczne portfolio</a>
    </div>
  `

  container.appendChild(root)

  const speedValueEl = root.querySelector<HTMLElement>('.v4-hud__speed-value')!
  const thrustFillEl = root.querySelector<HTMLElement>('.v4-hud__thrust-fill')!
  const legendEl = root.querySelector<HTMLElement>('.v4-hud__legend')!
  const startPromptEl = root.querySelector<HTMLElement>('.v4-hud__start-prompt')!
  const timerEl = root.querySelector<HTMLElement>('.v4-hud__timer')!
  const warningEl = root.querySelector<HTMLElement>('.v4-hud__warning')!
  const pipEls = Array.from(root.querySelectorAll<HTMLElement>('.v4-hud__pip'))
  const fpsEl = root.querySelector<HTMLElement>('.v4-hud__fps')
  let fpsLastMs = performance.now()
  let fpsSmoothed = 0
  let fpsSamples = 0

  const gravityWarningOn = GRAVITY_WARNING_RATIO * MAIN_THRUST_ACCEL
  const gravityWarningOff = gravityWarningOn * 0.78

  let legendShown = false
  let legendTimer = 0
  let gravityWarned = false

  function hideLegendSoon() {
    window.clearTimeout(legendTimer)
    legendTimer = window.setTimeout(() => {
      legendEl.classList.remove('is-visible')
      legendEl.setAttribute('aria-hidden', 'true')
    }, LEGEND_HIDE_DELAY_MS)
  }

  return {
    update(state) {
      speedValueEl.textContent = String(Math.round(state.speed)).padStart(2, '0')
      thrustFillEl.style.transform = `scaleX(${Math.max(0, Math.min(1, state.thrust))})`

      if (state.hasThrusted && !legendShown) {
        legendShown = true
        startPromptEl.classList.add('is-hidden')
        legendEl.classList.add('is-visible')
        legendEl.setAttribute('aria-hidden', 'false')
        hideLegendSoon()
      }

      timerEl.textContent = formatMissionTime(state.missionMs)
      if (fpsEl) {
        const now = performance.now()
        const frameMs = now - fpsLastMs
        fpsLastMs = now
        if (frameMs > 0.75 && frameMs < 250) {
          const inst = 1000 / frameMs
          fpsSmoothed = fpsSamples === 0 ? inst : fpsSmoothed * 0.88 + inst * 0.12
          fpsSamples += 1
          if (fpsSamples >= 8 && fpsSmoothed >= 1) {
            fpsEl.hidden = false
            fpsEl.textContent = `${Math.round(fpsSmoothed)} fps`
          }
        }
      }
      if (gravityWarned) {
        gravityWarned = state.gravityAccel > gravityWarningOff
      } else {
        gravityWarned = state.gravityAccel > gravityWarningOn
      }
      warningEl.classList.toggle('is-visible', gravityWarned)
      for (const pipEl of pipEls) {
        const id = pipEl.dataset.planet as PlanetId
        pipEl.classList.toggle('is-found', state.discovered.has(id))
      }
    },
    reset() {
      legendShown = false
      gravityWarned = false
      window.clearTimeout(legendTimer)
      startPromptEl.classList.remove('is-hidden')
      legendEl.classList.remove('is-visible')
      legendEl.setAttribute('aria-hidden', 'true')
      warningEl.classList.remove('is-visible')
    },
    dispose() {
      window.clearTimeout(legendTimer)
      root.remove()
    },
  }
}
