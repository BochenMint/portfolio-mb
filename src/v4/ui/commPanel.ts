import { getLeaderboard } from '../engine/leaderboard'
import { escapeHtml, formatMissionTime } from '../engine/format'

export type CommPanel = {
  /** First thrust of a run — collapses the panel if it's still open. */
  dismiss(): void
  /** Start of a fresh run (after a restart) — re-types the intro from
   * scratch and re-expands if it was collapsed. */
  restart(): void
  dispose(): void
}

const LINES = [
  'Kapitanie — misja: znajdź nowoczesną stronę dla swojego biznesu. Cztery światy na orbicie czarnej dziury.',
  'Nie trać czasu — minuta tak blisko horyzontu to godzina na Ziemi.',
  'Ten statek… przypomina Ci coś? Zbieg okoliczności.',
]
const LINE_DELAY_MS = 5000
const TYPE_SPEED_MS = 25

function typeText(el: HTMLElement, text: string, reducedMotion: boolean): () => void {
  if (reducedMotion) {
    el.textContent = text
    return () => {}
  }
  el.textContent = ''
  let i = 0
  let timer = 0
  const step = () => {
    i += 1
    el.textContent = text.slice(0, i)
    if (i < text.length) timer = window.setTimeout(step, TYPE_SPEED_MS)
  }
  timer = window.setTimeout(step, TYPE_SPEED_MS)
  return () => window.clearTimeout(timer)
}

/**
 * Bottom-left holo comm panel — the start-of-run mission briefing. No fake
 * human photo: a stylized frame with a thin amber border and a small
 * canvas-drawn animated waveform standing in for a voice signal.
 */
export function createCommPanel(container: HTMLElement, opts: { reducedMotion: boolean }): CommPanel {
  const root = document.createElement('div')
  root.className = 'v4-comm'
  root.innerHTML = `
    <div class="v4-comm__panel">
      <button type="button" class="v4-comm__collapse" aria-label="Zwiń łączność">&times;</button>
      <div class="v4-comm__header">
        <canvas class="v4-comm__wave" width="56" height="22"></canvas>
        <span class="v4-comm__label">ŁĄCZNOŚĆ · ZAŁOGA</span>
      </div>
      <div class="v4-comm__lines">
        <p class="v4-comm__line"></p>
        <p class="v4-comm__line"></p>
        <p class="v4-comm__line"></p>
      </div>
      <div class="v4-comm__board" hidden>
        <div class="v4-comm__board-label">NAJSZYBSI ODKRYWCY</div>
        <ol class="v4-comm__board-list"></ol>
      </div>
    </div>
    <button type="button" class="v4-comm__icon" aria-label="Rozwiń łączność" hidden>&#9679;</button>
  `
  container.appendChild(root)

  const panelEl = root.querySelector<HTMLElement>('.v4-comm__panel')!
  const iconEl = root.querySelector<HTMLElement>('.v4-comm__icon')!
  const collapseBtn = root.querySelector<HTMLElement>('.v4-comm__collapse')!
  const lineEls = Array.from(root.querySelectorAll<HTMLElement>('.v4-comm__line'))
  const boardEl = root.querySelector<HTMLElement>('.v4-comm__board')!
  const boardListEl = root.querySelector<HTMLElement>('.v4-comm__board-list')!
  const waveCanvas = root.querySelector<HTMLCanvasElement>('.v4-comm__wave')!

  let dismissed = false
  let lineTimers: number[] = []
  let lineCancels: (() => void)[] = []
  let waveRaf = 0

  function clearLineSchedule() {
    for (const t of lineTimers) window.clearTimeout(t)
    for (const c of lineCancels) c()
    lineTimers = []
    lineCancels = []
  }

  function scheduleLines() {
    LINES.forEach((text, idx) => {
      const t = window.setTimeout(() => {
        lineCancels.push(typeText(lineEls[idx], text, opts.reducedMotion))
      }, idx * LINE_DELAY_MS)
      lineTimers.push(t)
    })
  }

  function renderBoard() {
    const top3 = getLeaderboard().slice(0, 3)
    if (top3.length === 0) {
      boardEl.hidden = true
      return
    }
    boardEl.hidden = false
    boardListEl.innerHTML = top3
      .map(
        (e, i) =>
          `<li><span>${i + 1}.</span><span>${escapeHtml(e.nick)}</span><span>${formatMissionTime(e.ms)}</span></li>`,
      )
      .join('')
  }

  function drawWave(t: number) {
    const ctx = waveCanvas.getContext('2d')
    if (!ctx) return
    const bars = 8
    const bw = waveCanvas.width / bars
    ctx.clearRect(0, 0, waveCanvas.width, waveCanvas.height)
    ctx.fillStyle = '#f5a524'
    for (let i = 0; i < bars; i++) {
      const h = waveCanvas.height * (0.22 + 0.58 * Math.abs(Math.sin(t + i * 0.7)))
      ctx.fillRect(i * bw + 1, waveCanvas.height - h, bw - 2, h)
    }
  }

  function startWave() {
    if (opts.reducedMotion) {
      drawWave(0.6)
      return
    }
    let t = 0
    const loop = () => {
      t += 0.12
      drawWave(t)
      waveRaf = requestAnimationFrame(loop)
    }
    loop()
  }

  function expand() {
    dismissed = false
    panelEl.classList.remove('is-collapsed')
    iconEl.hidden = true
  }

  function collapse() {
    dismissed = true
    panelEl.classList.add('is-collapsed')
    iconEl.hidden = false
  }

  panelEl.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('.v4-comm__collapse')) return
    collapse()
  })
  collapseBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    collapse()
  })
  iconEl.addEventListener('click', expand)

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Enter' && !dismissed) collapse()
  }
  window.addEventListener('keydown', onKeyDown)

  renderBoard()
  scheduleLines()
  startWave()

  return {
    dismiss() {
      if (!dismissed) collapse()
    },
    restart() {
      clearLineSchedule()
      for (const el of lineEls) el.textContent = ''
      expand()
      renderBoard()
      scheduleLines()
    },
    dispose() {
      clearLineSchedule()
      cancelAnimationFrame(waveRaf)
      window.removeEventListener('keydown', onKeyDown)
      root.remove()
    },
  }
}
