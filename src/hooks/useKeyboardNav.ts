import { useEffect } from 'react'
import { navLinks } from '../data/content'

const SECTION_IDS = navLinks.map((l) => l.href.replace('#', ''))

export function useKeyboardNav() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      if (!e.altKey) return

      const current = SECTION_IDS.findIndex((id) => {
        const el = document.getElementById(id)
        if (!el) return false
        const rect = el.getBoundingClientRect()
        return rect.top <= 120 && rect.bottom > 120
      })

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault()
        const next = SECTION_IDS[Math.min(current + 1, SECTION_IDS.length - 1)]
        document.getElementById(next)?.scrollIntoView({ behavior: 'smooth' })
      }
      if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault()
        const prev = SECTION_IDS[Math.max(current - 1, 0)]
        document.getElementById(prev)?.scrollIntoView({ behavior: 'smooth' })
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
