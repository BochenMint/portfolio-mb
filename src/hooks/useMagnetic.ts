import { useEffect, useRef } from 'react'
import { gsap } from '../animation/gsap'

/**
 * Magnetic hover drift. `strength` scales the pointer offset from the element
 * centre; `maxOffset` (px) clamps the travel so a large button never slides
 * further than a real physical give would (Marcin 2026-09: keep the effect,
 * make it realistic and small).
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35, maxOffset = Infinity) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced || strength === 0) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power2.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power2.out' })

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      const clamp = (v: number) => Math.max(-maxOffset, Math.min(maxOffset, v))
      xTo(clamp(dx * strength))
      yTo(clamp(dy * strength))
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
  }, [strength, maxOffset])

  return ref
}
