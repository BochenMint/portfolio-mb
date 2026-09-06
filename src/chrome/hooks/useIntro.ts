import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger } from '../../animation/gsap'

/** Entrance + scroll reveals for the Chrome edition. Motion-safe by default. */
export function useIntro(ready: boolean) {
  useLayoutEffect(() => {
    if (!ready) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add(
        {
          reduce: '(prefers-reduced-motion: reduce)',
          motion: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { reduce } = context.conditions!
          if (reduce) {
            gsap.set('[data-reveal], [data-hero-line], [data-hero-fade], [data-stat], [data-card]', {
              opacity: 1,
              y: 0,
              yPercent: 0,
              clearProps: 'transform',
            })
            return
          }

          gsap.from('[data-hero-line]', {
            yPercent: 110,
            duration: 1.1,
            stagger: 0.09,
            ease: 'power4.out',
            delay: 0.05,
          })
          gsap.from('[data-hero-fade]', {
            opacity: 0,
            y: 18,
            duration: 0.8,
            stagger: 0.07,
            ease: 'power3.out',
            delay: 0.45,
          })
          gsap.from('[data-hero-object]', {
            opacity: 0,
            scale: 0.92,
            y: 30,
            duration: 1.4,
            ease: 'power3.out',
            delay: 0.2,
            clearProps: 'transform,opacity',
          })
          gsap.from('[data-stat]', {
            scrollTrigger: { trigger: '[data-stats]', start: 'top 85%' },
            y: 24,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
          })

          ScrollTrigger.batch('[data-reveal]', {
            start: 'top 90%',
            onEnter: (batch) =>
              gsap.fromTo(
                batch,
                { y: 28, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.07, ease: 'power3.out', overwrite: true },
              ),
            once: true,
          })

          ScrollTrigger.batch('[data-card]', {
            start: 'top 88%',
            onEnter: (batch) =>
              gsap.fromTo(
                batch,
                { y: 48, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out', overwrite: true },
              ),
            once: true,
          })

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
        },
      )
    })

    return () => ctx.revert()
  }, [ready])
}
