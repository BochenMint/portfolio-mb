import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../animation/gsap'

export function useScrollAnimations() {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          reduce: '(prefers-reduced-motion: reduce)',
          desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
          motion: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { reduce, desktop, motion } = context.conditions!

          const showFinal = () => {
            gsap.set(
              '[data-hero-line], [data-hero-word], [data-hero-fade], [data-reveal], [data-project-card], [data-strip-card]',
              { opacity: 1, y: 0, yPercent: 0, scale: 1, clearProps: 'transform' },
            )
          }

          if (reduce) {
            showFinal()
            return
          }

          if (motion) {
            gsap.from('[data-hero-line]', {
              yPercent: 110,
              opacity: 0,
              duration: 0.95,
              stagger: 0.08,
              ease: 'power3.out',
            })

            gsap.from('[data-hero-word]', {
              yPercent: 115,
              opacity: 0,
              duration: 0.6,
              stagger: 0.025,
              ease: 'power3.out',
              delay: 0.1,
            })

            gsap.from('[data-hero-fade]', {
              opacity: 0,
              y: 24,
              duration: 0.7,
              stagger: 0.06,
              ease: 'power3.out',
              delay: 0.18,
            })

            ScrollTrigger.batch('[data-reveal]', {
              start: 'top 88%',
              onEnter: (batch) =>
                gsap.fromTo(
                  batch,
                  { y: 36, opacity: 0 },
                  {
                    y: 0,
                    opacity: 1,
                    duration: 0.75,
                    stagger: 0.06,
                    ease: 'power3.out',
                    overwrite: true,
                  },
                ),
              once: true,
            })

            gsap.utils.toArray<HTMLElement>('[data-project-card]').forEach((card, i) => {
              gsap.from(card, {
                scrollTrigger: { trigger: card, start: 'top 90%', once: true },
                y: 48,
                opacity: 0,
                duration: 0.85,
                delay: i * 0.03,
                ease: 'power3.out',
              })

              const img = card.querySelector('img')
              if (img) {
                gsap.to(img, {
                  scale: 1.06,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.6,
                  },
                })
              }

              card.addEventListener('mouseenter', () => {
                gsap.to(card, { scale: 1.01, duration: 0.35, ease: 'power2.out' })
              })
              card.addEventListener('mouseleave', () => {
                gsap.to(card, { scale: 1, duration: 0.4, ease: 'power2.out' })
              })
            })

            gsap.utils.toArray<HTMLElement>('[data-strip-card]').forEach((card) => {
              card.addEventListener('mouseenter', () => {
                gsap.to(card, { y: -8, scale: 1.02, duration: 0.35, ease: 'power2.out' })
              })
              card.addEventListener('mouseleave', () => {
                gsap.to(card, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out' })
              })
            })
          }

          if (desktop && motion) {
            const workPin = document.querySelector('[data-work-pin]')
            const workTrack = document.querySelector('[data-work-track]') as HTMLElement | null
            if (workPin && workTrack) {
              const getScroll = () => Math.max(0, workTrack.scrollWidth - workPin.clientWidth + 48)
              gsap.to(workTrack, {
                x: () => -getScroll(),
                ease: 'none',
                scrollTrigger: {
                  trigger: workPin,
                  start: 'top 75%',
                  end: () => `+=${Math.max(getScroll(), 320)}`,
                  scrub: 0.8,
                  invalidateOnRefresh: true,
                },
              })
            }
          }
        },
      )

      ScrollTrigger.refresh()
      return () => mm.revert()
    },
    { dependencies: [] },
  )
}
