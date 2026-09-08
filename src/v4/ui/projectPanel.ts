import type { Project } from '../../i18n/live'
import type { PanelImage } from '../engine/panelImages'
import { trimToSentences, isExternalLiveUrl } from '../engine/format'

const PORTFOLIO_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PORTFOLIO_URL) ||
  'https://marcinbochenek.com'

const CASE_STUDIES_URL = `${PORTFOLIO_URL.replace(/\/$/, '')}/#realizacje`


export type ProjectPanel = {
  show(project: Project, images: PanelImage[]): void
  hide(): void
  dispose(): void
}

/**
 * Glass discovery panel — slides in from the right whenever the ship enters
 * 2.5x a planet's radius (every approach, whether or not it's already been
 * discovered). Auto-hides past 3.5x radius; also closable manually via the
 * × button. The panel never blocks flight input: pointer-events are enabled
 * only on the panel box itself, not the fixed wrapper.
 */
export function createProjectPanel(container: HTMLElement): ProjectPanel {
  const root = document.createElement('div')
  root.className = 'v4-project-panel'
  root.setAttribute('aria-hidden', 'true')
  root.inert = true
  root.innerHTML = `
    <button type="button" class="v4-project-panel__close" aria-label="Zamknij panel projektu">&times;</button>
    <p class="v4-project-panel__eyebrow"></p>
    <h2 class="v4-project-panel__title"></h2>
    <p class="v4-project-panel__desc"></p>
    <div class="v4-project-panel__shots"></div>
    <div class="v4-project-panel__stack"></div>
    <div class="v4-project-panel__links">
      <a class="v4-project-panel__live" href="#" target="_blank" rel="noopener" hidden>Strona na żywo &rarr;</a>
      <span class="v4-project-panel__status" hidden></span>
      <a class="v4-project-panel__case" href="${CASE_STUDIES_URL}" target="_blank" rel="noopener">Case study &rarr;</a>
    </div>
  `
  container.appendChild(root)

  const closeBtn = root.querySelector<HTMLElement>('.v4-project-panel__close')!
  const eyebrowEl = root.querySelector<HTMLElement>('.v4-project-panel__eyebrow')!
  const titleEl = root.querySelector<HTMLElement>('.v4-project-panel__title')!
  const descEl = root.querySelector<HTMLElement>('.v4-project-panel__desc')!
  const shotsEl = root.querySelector<HTMLElement>('.v4-project-panel__shots')!
  const stackEl = root.querySelector<HTMLElement>('.v4-project-panel__stack')!
  const liveEl = root.querySelector<HTMLAnchorElement>('.v4-project-panel__live')!
  const statusEl = root.querySelector<HTMLElement>('.v4-project-panel__status')!

  function hide() {
    root.classList.remove('is-open')
    root.setAttribute('aria-hidden', 'true')
    root.inert = true
    document.documentElement.classList.remove('v4-panel-open')
  }

  closeBtn.addEventListener('click', hide)

  return {
    show(project, images) {
      eyebrowEl.textContent = project.tagline
      titleEl.textContent = project.title
      descEl.textContent = trimToSentences(project.description, 3)

      shotsEl.innerHTML = ''
      for (const img of images) {
        const el = document.createElement('img')
        el.className = 'v4-project-panel__shot'
        el.src = img.src
        el.alt = img.alt
        el.loading = 'lazy'
        shotsEl.appendChild(el)
      }

      stackEl.innerHTML = ''
      for (const tech of project.stack ?? []) {
        const chip = document.createElement('span')
        chip.className = 'v4-project-panel__chip'
        chip.textContent = tech
        stackEl.appendChild(chip)
      }

      if (isExternalLiveUrl(project.url) && project.id !== 'idrive' && project.id !== 'agentic') {
        liveEl.href = project.url
        liveEl.hidden = false
        statusEl.hidden = true
      } else {
        liveEl.hidden = true
        liveEl.removeAttribute('href')
        statusEl.hidden = false
        statusEl.textContent = project.domain
      }

      root.classList.add('is-open')
      root.setAttribute('aria-hidden', 'false')
      root.inert = false
      // The top-right "MISJA" HUD blurb (ui/hud.ts) sits in the same corner
      // and would otherwise collide with this panel's header — the panel
      // already gives far richer context, so hide the generic one-liner
      // while it's open (v4.css: `.v4-panel-open .v4-hud__mission`).
      document.documentElement.classList.add('v4-panel-open')
    },
    hide,
    dispose() {
      root.remove()
    },
  }
}
