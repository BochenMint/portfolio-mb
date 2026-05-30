import { useGSAP } from '@gsap/react'
import { useEffect } from 'react'
import { gsap } from '../animation/gsap'
import { useCoarsePointer } from './useCoarsePointer'
import { useReducedMotion } from './useReducedMotion'

/** Extra glass skew for TYPE variant — desktop only; respects intro timing via parent ready. */
export function useHeroTypeMotion(active: boolean, ready: boolean) {
  const reduced = useReducedMotion()
  const coarse = useCoarsePointer()

  useGSAP(
    () => {
      if (!active || !ready || reduced || coarse) return

      const chars = gsap.utils.toArray<HTMLElement>('[data-hero-type-char]')
      if (!chars.length) return

      gsap.from(chars, {
        yPercent: 140,
        rotateX: -42,
        opacity: 0,
        duration: 1.1,
        stagger: 0.028,
        ease: 'power4.out',
        delay: 0.35,
      })

      const title = document.querySelector('.hero-type-title')
      if (!title) return

      const onMove = (e: MouseEvent) => {
        const rect = title.getBoundingClientRect()
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
        gsap.to('.hero-type-line-inner', {
          rotateY: nx * 5,
          rotateX: -ny * 4,
          x: nx * 6,
          y: ny * 3,
          duration: 0.65,
          ease: 'power2.out',
          transformPerspective: 900,
        })
        gsap.to('.hero-type-aberration--cyan', {
          x: nx * 10 + 2,
          y: ny * 4,
          duration: 0.5,
          ease: 'power2.out',
        })
        gsap.to('.hero-type-aberration--magenta', {
          x: nx * -10 - 2,
          y: ny * -3,
          duration: 0.5,
          ease: 'power2.out',
        })
      }

      window.addEventListener('mousemove', onMove, { passive: true })
      return () => window.removeEventListener('mousemove', onMove)
    },
    { dependencies: [active, ready, reduced, coarse] },
  )

  useEffect(() => {
    if (!active || reduced || coarse) {
      gsap.set('.hero-type-line-inner, .hero-type-aberration', { clearProps: 'all' })
    }
  }, [active, reduced, coarse])
}
