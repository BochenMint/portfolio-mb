export type DiscoveryToast = {
  show(title: string): void
  dispose(): void
}

const VISIBLE_MS = 2500

/** Plain-DOM toast — "ODKRYTO: {TITLE}" — mono/amber, fades in/out over the
 * full 2.5s window per spec. First-time-only discovery feedback; the glass
 * project panel (ui/projectPanel.ts) is the one that shows on every
 * approach, discovered or not. */
export function createDiscoveryToast(container: HTMLElement): DiscoveryToast {
  const root = document.createElement('div')
  root.className = 'v4-toast'
  container.appendChild(root)

  let hideTimer = 0

  return {
    show(title) {
      root.textContent = `ODKRYTO: ${title.toUpperCase()}`
      root.classList.remove('is-visible')
      // Force reflow so re-triggering the animation on rapid re-discovery
      // (shouldn't normally happen, but is possible via ?debug=1 teleports)
      // restarts the transition instead of no-opping.
      void root.offsetWidth
      root.classList.add('is-visible')
      window.clearTimeout(hideTimer)
      hideTimer = window.setTimeout(() => {
        root.classList.remove('is-visible')
      }, VISIBLE_MS)
    },
    dispose() {
      window.clearTimeout(hideTimer)
      root.remove()
    },
  }
}
