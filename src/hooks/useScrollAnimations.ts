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
            gsap.set(
              '[data-hero-line], [data-hero-word], [data-hero-fade], [data-reveal], [data-project-card]',
              { opacity: 1, y: 0, yPercent: 0, clearProps: 'transform' },
            )
          }

          if (reduce) {
            showFinal()
            return
          }

          if (motion) {
            gsap.from('[data-hero-line]', {
              yPercent: 100,
              opacity: 0,
              duration: 0.8,
              stagger: 0.06,
              ease: 'power2.out',
            })

            gsap.from('[data-hero-word]', {
              yPercent: 105,
              opacity: 0,
              duration: 0.55,
              stagger: 0.02,
              ease: 'power2.out',
              delay: 0.12,
            })

            gsap.from('[data-hero-fade]', {
              opacity: 0,
              y: 16,
              duration: 0.65,
              stagger: 0.05,
              ease: 'power2.out',
              delay: 0.2,
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
              const img = card.querySelector('img')
              if (!img) return
              gsap.to(img, {
                scale: 1.04,
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.5,
                },
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
