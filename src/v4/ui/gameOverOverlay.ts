export type GameOverOverlay = {
  /** Event horizon crossed — quick screen flash (~600ms), then the full
   * overlay fades in. */
  trigger(): void
  /** Run reset — hides the overlay immediately. */
  reset(): void
  dispose(): void
}

const FLASH_MS = 600

/**
 * "PRZEKROCZONO HORYZONT ZDARZEŃ" — the event-horizon game-over screen.
 * Two-phase per spec: a quick CSS contrast/hue/scale flash on the whole
 * viewport, then the full ink overlay with the restart CTA.
 */
export function createGameOverOverlay(
  container: HTMLElement,
  opts: { reducedMotion: boolean; onRestart: () => void },
): GameOverOverlay {
  const flash = document.createElement('div')
  flash.className = 'v4-horizon-flash'
  container.appendChild(flash)

  const root = document.createElement('div')
  root.className = 'v4-overlay v4-overlay--gameover'
  root.setAttribute('aria-hidden', 'true')
  root.inert = true
  root.innerHTML = `
    <div class="v4-overlay__card">
      <p class="v4-overlay__eyebrow">Misja przerwana</p>
      <h1 class="v4-overlay__title" id="v4-gameover-title">Przekroczono horyzont zdarzeń</h1>
      <p class="v4-overlay__lead">Z tej odległości nie ucieka nawet światło. Misja zaczyna się od nowa.</p>
      <button type="button" class="v4-overlay__button">Restart misji <span class="v4-overlay__hint">[R]</span></button>
    </div>
  `
  container.appendChild(root)

  const restartBtn = root.querySelector<HTMLButtonElement>('.v4-overlay__button')!
  restartBtn.addEventListener('click', () => opts.onRestart())

  let showTimer = 0

  function reveal() {
    root.setAttribute('role', 'dialog')
    root.setAttribute('aria-modal', 'true')
    root.setAttribute('aria-labelledby', 'v4-gameover-title')
    root.classList.add('is-visible')
    root.setAttribute('aria-hidden', 'false')
    root.inert = false
    restartBtn.focus({ preventScroll: true })
  }

  function conceal() {
    window.clearTimeout(showTimer)
    root.classList.remove('is-visible')
    root.removeAttribute('role')
    root.removeAttribute('aria-modal')
    root.setAttribute('aria-hidden', 'true')
    root.inert = true
    flash.classList.remove('is-active')
  }

  return {
    trigger() {
      if (opts.reducedMotion) {
        reveal()
        return
      }
      flash.classList.remove('is-active')
      void flash.offsetWidth // restart the CSS animation
      flash.classList.add('is-active')
      window.clearTimeout(showTimer)
      showTimer = window.setTimeout(reveal, FLASH_MS)
    },
    reset() {
      conceal()
    },
    dispose() {
      window.clearTimeout(showTimer)
      root.remove()
      flash.remove()
    },
  }
}
