import { useEffect, useRef } from 'react'
import { gsap } from '../animation/gsap'

export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      xTo(dx * strength)
      yTo(dy * strength)
    }

    const reset = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', reset)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', reset)
    }
  }, [strength])

  return ref
}
