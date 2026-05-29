import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../animation/gsap'

export function useScrollAnimations() {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          reduce: '(prefers-reduced-motion: reduce)',
          motion: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { reduce, motion } = context.conditions!

          const showFinal = () => {
            gsap.set('[data-hero-fade], [data-reveal], [data-project-card]', {
              opacity: 1,
              y: 0,
              clearProps: 'transform',
            })
          }

          if (reduce) {
            showFinal()
            return
          }

          if (motion) {
            gsap.from('[data-hero-fade]', {
              opacity: 0,
              y: 20,
              duration: 0.65,
              stagger: 0.06,
              ease: 'power2.out',
            })

            ScrollTrigger.batch('[data-reveal]', {
              start: 'top 90%',
              onEnter: (batch) =>
                gsap.fromTo(
                  batch,
                  { y: 20, opacity: 0 },
                  {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.05,
                    ease: 'power2.out',
                    overwrite: true,
                  },
                ),
              once: true,
            })

            gsap.utils.toArray<HTMLElement>('[data-project-card]').forEach((card) => {
              gsap.from(card, {
                scrollTrigger: { trigger: card, start: 'top 92%', once: true },
                y: 16,
                opacity: 0,
                duration: 0.55,
                ease: 'power2.out',
              })
            })
          }
        },
      )

      ScrollTrigger.refresh()
      return () => mm.revert()
    },
    { dependencies: [] },
  )
}
