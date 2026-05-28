import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useIntroAnimations(ready: boolean) {
  useLayoutEffect(() => {
    if (!ready) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      gsap.set('[data-reveal]', { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.from('[data-hero-line]', {
        yPercent: 110,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power4.out',
        delay: 0.15,
      })

      gsap.from('[data-hero-fade]', {
        opacity: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.55,
      })

      gsap.from('[data-marquee]', {
        opacity: 0,
        duration: 0.8,
        delay: 0.9,
      })

      gsap.utils.toArray<HTMLElement>('[data-section]').forEach((section) => {
        const targets = section.querySelectorAll('[data-reveal]')
        if (!targets.length) return

        gsap.from(targets, {
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
          y: 48,
          opacity: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-project-card]').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          y: 80,
          opacity: 0,
          rotateX: 8,
          transformPerspective: 900,
          duration: 1,
          delay: i * 0.05,
          ease: 'power3.out',
        })
      })

      const workPin = document.querySelector('[data-work-pin]')
      const workTrack = document.querySelector('[data-work-track]') as HTMLElement | null
      if (workPin && workTrack && window.innerWidth >= 1024) {
        const getScroll = () => workTrack.scrollWidth - window.innerWidth + 80

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
    })

    return () => ctx.revert()
  }, [ready])
}
