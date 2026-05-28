import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger } from '../animation/gsap'

export function useIntroAnimations(ready: boolean) {
  useLayoutEffect(() => {
    if (!ready) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          reduce: '(prefers-reduced-motion: reduce)',
          desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
          motion: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { reduce, desktop, motion } = context.conditions!

          if (reduce) {
            gsap.set('[data-reveal], [data-hero-line], [data-hero-word], [data-stat]', {
              opacity: 1,
              y: 0,
              clearProps: 'transform',
            })
            return
          }

          if (motion) {
            gsap.from('[data-hero-line]', {
              yPercent: 110,
              opacity: 0,
              duration: 1.05,
              stagger: 0.1,
              ease: 'power4.out',
              delay: 0.1,
            })

            gsap.from('[data-hero-word]', {
              yPercent: 120,
              opacity: 0,
              duration: 0.75,
              stagger: 0.02,
              ease: 'power3.out',
              delay: 0.35,
            })

            gsap.from('[data-hero-fade]', {
              opacity: 0,
              y: 20,
              duration: 0.8,
              stagger: 0.06,
              ease: 'power3.out',
              delay: 0.5,
            })

            gsap.from('[data-stat]', {
              scrollTrigger: { trigger: '[data-stats]', start: 'top 82%' },
              y: 32,
              opacity: 0,
              duration: 0.7,
              stagger: 0.08,
              ease: 'power3.out',
            })

            ScrollTrigger.batch('[data-reveal]', {
              start: 'top 88%',
              onEnter: (batch) =>
                gsap.fromTo(
                  batch,
                  { y: 40, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: 'power3.out', overwrite: true },
                ),
              once: true,
            })

            gsap.utils.toArray<HTMLElement>('[data-project-card]').forEach((card, i) => {
              gsap.from(card, {
                scrollTrigger: { trigger: card, start: 'top 88%', once: true },
                y: 60,
                opacity: 0,
                duration: 0.9,
                delay: i * 0.04,
                ease: 'power3.out',
              })
            })
          }

          if (desktop && motion) {
            const workPin = document.querySelector('[data-work-pin]')
            const workTrack = document.querySelector('[data-work-track]') as HTMLElement | null
            if (workPin && workTrack) {
              const getScroll = () => Math.max(0, workTrack.scrollWidth - window.innerWidth + 80)
              gsap.to(workTrack, {
                x: () => -getScroll(),
                ease: 'none',
                scrollTrigger: {
                  trigger: workPin,
                  pin: true,
                  scrub: 1,
                  end: () => `+=${getScroll()}`,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                },
              })
            }
          }

          if (motion) {
            gsap.to('[data-progress-bar]', {
              scaleX: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: document.documentElement,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.3,
              },
            })
          }
        },
      )
    })

    return () => ctx.revert()
  }, [ready])
}
