import { useEffect } from 'react'

/**
 * Global "light source" = cursor. Every element with [data-chrome] gets
 * --mx / --my (cursor position relative to the element, in %), --angle
 * (direction from element centre to cursor) and --near (0..1 proximity),
 * so the CSS specular streak in `.chrome-card::before` tracks the cursor
 * sharply — even when the pointer is outside the card, like a real
 * chrome surface reflecting a moving light.
 *
 * One listener, one rAF, no React re-renders.
 */
export function useChromeReflection() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    let mx = window.innerWidth / 2
    let my = window.innerHeight * 0.3
    let raf = 0
    let dirty = true
    let elements: HTMLElement[] = []

    const collect = () => {
      elements = Array.from(document.querySelectorAll<HTMLElement>('[data-chrome]'))
    }
    collect()
    const mo = new MutationObserver(() => {
      collect()
      dirty = true
    })
    mo.observe(document.body, { childList: true, subtree: true })

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      dirty = true
    }
    const onScroll = () => {
      dirty = true
    }

    const vh = () => window.innerHeight

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!dirty) return
      dirty = false
      const h = vh()
      for (const el of elements) {
        const r = el.getBoundingClientRect()
        // Skip work for elements far outside the viewport.
        if (r.bottom < -h || r.top > h * 2) continue
        const px = ((mx - r.left) / r.width) * 100
        const py = ((my - r.top) / r.height) * 100
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const angle = (Math.atan2(my - cy, mx - cx) * 180) / Math.PI + 90
        const dx = Math.max(0, Math.abs(mx - cx) - r.width / 2)
        const dy = Math.max(0, Math.abs(my - cy) - r.height / 2)
        const dist = Math.hypot(dx, dy)
        const near = Math.max(0, 1 - dist / 420)
        el.style.setProperty('--mx', `${px.toFixed(2)}%`)
        el.style.setProperty('--my', `${py.toFixed(2)}%`)
        el.style.setProperty('--angle', `${angle.toFixed(1)}deg`)
        el.style.setProperty('--near', near.toFixed(3))
      }
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      cancelAnimationFrame(raf)
      mo.disconnect()
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
}
