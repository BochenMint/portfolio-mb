import { useEffect } from 'react'

export function useScrollProgress() {
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>('[data-progress-bar]')
    if (!bar) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      bar.style.transform = 'scaleX(1)'
      return
    }

    let ticking = false
    const update = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      const p = max > 0 ? el.scrollTop / max : 0
      bar.style.transform = `scaleX(${p})`
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
}
