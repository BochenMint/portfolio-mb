import type { LeaderboardEntry } from '../engine/leaderboard'
import { escapeHtml, formatMissionTime, formatShortDate } from '../engine/format'

export type CompletionOverlay = {
  show(missionMs: number, leaderboard: LeaderboardEntry[]): void
  /** Re-render just the table (after a save), without resetting the save
   * form's disabled state. */
  updateBoard(leaderboard: LeaderboardEntry[]): void
  reset(): void
  dispose(): void
}

/**
 * "MISJA WYKONANA" — all 4 planets discovered. Shows the run time, a
 * light-hearted dilation joke, a nick + save-score form, and the local
 * top-10 leaderboard table.
 */
export function createCompletionOverlay(
  container: HTMLElement,
  opts: { onRestart: () => void; onSave: (nick: string) => void },
): CompletionOverlay {
  const root = document.createElement('div')
  root.className = 'v4-overlay v4-overlay--completion'
  root.setAttribute('aria-hidden', 'true')
  root.inert = true
  root.innerHTML = `
    <div class="v4-overlay__card v4-overlay__card--wide">
      <h1 class="v4-overlay__title" id="v4-completion-title">Misja wykonana</h1>
      <p class="v4-overlay__time">Twój czas: <strong class="v4-overlay__time-value">00:00.0</strong></p>
      <p class="v4-overlay__dilation"></p>
      <form class="v4-overlay__save">
        <div class="v4-overlay__save-row">
          <label class="sr-only" for="v4-nick">Znak na tablicy wyników</label>
          <input class="v4-overlay__nick" id="v4-nick" name="nick" type="text" maxlength="16" placeholder="Twój znak (max 16)" autocomplete="off" aria-describedby="v4-nick-hint" />
          <button type="submit" class="v4-overlay__button">Zapisz wynik</button>
        </div>
        <p class="v4-overlay__nick-hint" id="v4-nick-hint">Maksymalnie 16 znaków — ranking lokalny na tym urządzeniu.</p>
      </form>
      <div class="v4-overlay__board">
        <div class="v4-overlay__board-label">Najszybsi odkrywcy</div>
        <table class="v4-overlay__table">
          <thead>
            <tr><th>#</th><th>Znak</th><th>Czas</th><th>Data</th></tr>
          </thead>
          <tbody></tbody>
        </table>
        <p class="v4-overlay__note">Ranking lokalny — na tym urządzeniu.</p>
      </div>
      <button type="button" class="v4-overlay__restart">Restart misji <span class="v4-overlay__hint">[R]</span></button>
    </div>
  `
  container.appendChild(root)

  const timeValueEl = root.querySelector<HTMLElement>('.v4-overlay__time-value')!
  const dilationEl = root.querySelector<HTMLElement>('.v4-overlay__dilation')!
  const form = root.querySelector<HTMLFormElement>('.v4-overlay__save')!
  const nickInput = root.querySelector<HTMLInputElement>('.v4-overlay__nick')!
  const saveBtn = root.querySelector<HTMLButtonElement>('.v4-overlay__button')!
  const tbody = root.querySelector<HTMLElement>('tbody')!
  const restartBtn = root.querySelector<HTMLButtonElement>('.v4-overlay__restart')!

  // The nick input must never leak keystrokes into flight controls, which
  // listen on `window` (ship/controls.ts) — stopping propagation here keeps
  // W/A/S/D/Space/R etc. out of the ship while the pilot is typing a name.
  const stopPropagation = (e: KeyboardEvent) => e.stopPropagation()
  nickInput.addEventListener('keydown', stopPropagation)
  nickInput.addEventListener('keyup', stopPropagation)

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (saveBtn.disabled) return
    opts.onSave(nickInput.value)
    saveBtn.disabled = true
    nickInput.disabled = true
    saveBtn.textContent = 'Zapisano'
  })

  restartBtn.addEventListener('click', () => opts.onRestart())

  function renderBoard(entries: LeaderboardEntry[]) {
    tbody.innerHTML = entries
      .slice(0, 10)
      .map(
        (e, i) =>
          `<tr><td>${i + 1}</td><td>${escapeHtml(e.nick)}</td><td>${formatMissionTime(e.ms)}</td><td>${formatShortDate(e.date)}</td></tr>`,
      )
      .join('')
  }

  return {
    show(missionMs, leaderboard) {
      timeValueEl.textContent = formatMissionTime(missionMs)

      // Dilation joke: the comm-panel intro sets the ratio at "1 minute
      // near the horizon = 1 hour (60 min) on Earth" — Earth-minutes =
      // mission-minutes * 60, which algebraically is just the mission time
      // expressed in seconds.
      const earthMinutesTotal = Math.round(missionMs / 1000)
      const h = Math.floor(earthMinutesTotal / 60)
      const m = earthMinutesTotal % 60
      dilationEl.textContent = `Na Ziemi minęło w tym czasie: ${h}h ${m}min`

      nickInput.value = ''
      nickInput.disabled = false
      saveBtn.disabled = false
      saveBtn.textContent = 'Zapisz wynik'

      renderBoard(leaderboard)
      root.setAttribute('role', 'dialog')
      root.setAttribute('aria-labelledby', 'v4-completion-title')
      root.classList.add('is-visible')
      root.setAttribute('aria-hidden', 'false')
      root.inert = false
      nickInput.focus({ preventScroll: true })
    },
    updateBoard(leaderboard) {
      renderBoard(leaderboard)
    },
    reset() {
      root.classList.remove('is-visible')
      root.removeAttribute('role')
      root.setAttribute('aria-hidden', 'true')
      root.inert = true
    },
    dispose() {
      nickInput.removeEventListener('keydown', stopPropagation)
      nickInput.removeEventListener('keyup', stopPropagation)
      root.remove()
    },
  }
}
