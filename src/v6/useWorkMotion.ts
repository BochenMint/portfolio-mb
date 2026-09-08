import { useEffect, type RefObject } from 'react'
import { gsap, ScrollTrigger } from '../animation/gsap'
import { prefersReducedMotion } from './utils'

export function useWorkMotion(scopeRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const root = scopeRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.v6-work-stage[data-variant="desktop"]').forEach((stage) => {
        gsap.fromTo(
          stage,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.56,
            ease: 'steps(6)',
            scrollTrigger: {
              trigger: stage,
              start: 'top 92%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })
    }, root)

    return () => ctx.revert()
  }, [scopeRef])
}

export function useStageBeatScroll(
  stageRef: RefObject<HTMLElement | null>,
  onBeat: (index: number) => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return
    const el = stageRef.current
    if (!el) return

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 28%',
      end: 'bottom 38%',
      scrub: 0.55,
      onUpdate: (self) => {
        onBeat(Math.min(2, Math.floor(self.progress * 3)))
      },
    })

    return () => {
      st.kill()
    }
  }, [stageRef, onBeat, enabled])
}
