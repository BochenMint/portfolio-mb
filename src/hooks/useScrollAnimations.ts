import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../animation/gsap'

const FINAL_SELECTORS = [
  '[data-hero-fade]',
  '[data-hero-line]',
  '[data-hero-line-inner]',
  '[data-hero-word]',
  '[data-hero-portrait]',
  '[data-reveal]',
  '[data-project-card]',
  '[data-case-line]',
  '[data-case-image]',
  '[data-about-portrait]',
  '[data-pull-quote]',
  '[data-form-field]',
  '[data-section-wipe]',
].join(', ')

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
            gsap.set(FINAL_SELECTORS, {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              clipPath: 'inset(0% 0% 0% 0%)',
              clearProps: 'transform,opacity,clipPath',
            })
            gsap.set('[data-progress-bar]', { scaleX: 1 })
          }

          if (reduce) {
            showFinal()
            return
          }

          if (!motion) return

          // —— Hero load ——
          gsap.from('[data-hero-line-inner]', {
            yPercent: 110,
            opacity: 0,
            duration: 1.05,
            stagger: 0.12,
            ease: 'power4.out',
            delay: 0.08,
          })

          gsap.from('[data-hero-word]', {
            yPercent: 120,
            opacity: 0,
            duration: 0.72,
            stagger: 0.035,
            ease: 'power3.out',
            delay: 0.28,
          })

          gsap.from('[data-hero-fade]', {
            opacity: 0,
            y: 24,
            duration: 0.85,
            stagger: 0.07,
            ease: 'power3.out',
            delay: 0.45,
          })

          const portrait = document.querySelector('[data-hero-portrait]')
          if (portrait) {
            gsap.from(portrait, {
              scale: 0.92,
              opacity: 0,
              duration: 1.1,
              ease: 'power3.out',
              delay: 0.35,
            })

            gsap.to(portrait, {
              y: -48,
              scale: 0.96,
              ease: 'none',
              scrollTrigger: {
                trigger: '[data-hero]',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.2,
              },
            })
          }

          // —— Section clip-path wipes (key boundaries) ——
          gsap.utils.toArray<HTMLElement>('[data-section-wipe]').forEach((wipe) => {
            gsap.fromTo(
              wipe,
              { clipPath: 'inset(0% 100% 0% 0%)', opacity: 0.6 },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                opacity: 1,
                ease: 'power3.inOut',
                scrollTrigger: {
                  trigger: wipe,
                  start: 'top 92%',
                  end: 'top 55%',
                  scrub: 0.6,
                },
              },
            )
          })

          // —— Global reveals ——
          ScrollTrigger.batch('[data-reveal]', {
            start: 'top 88%',
            onEnter: (batch) =>
              gsap.fromTo(
                batch,
                { y: 36, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.8,
                  stagger: 0.06,
                  ease: 'power3.out',
                  overwrite: true,
                },
              ),
            once: true,
          })

          // —— Work grid stagger 01–04 ——
          ScrollTrigger.batch('[data-project-card]', {
            start: 'top 90%',
            onEnter: (batch) =>
              gsap.fromTo(
                batch,
                { y: 72, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.95,
                  stagger: 0.12,
                  ease: 'power3.out',
                  overwrite: true,
                },
              ),
            once: true,
          })

          // —— Desktop horizontal work strip (pinned scrub) ——
          if (desktop) {
            const workPin = document.querySelector('[data-work-pin]')
            const workTrack = document.querySelector('[data-work-track]') as HTMLElement | null
            if (workPin && workTrack) {
              const getScroll = () => Math.max(0, workTrack.scrollWidth - window.innerWidth + 96)
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

          // —— Case studies: parallax + line stagger ——
          gsap.utils.toArray<HTMLElement>('[data-case-study]').forEach((article, i) => {
            const img = article.querySelector('[data-case-image]')
            if (img) {
              gsap.fromTo(
                img,
                { yPercent: -8 },
                {
                  yPercent: 8,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: article,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5,
                  },
                },
              )
            }

            const lines = article.querySelectorAll('[data-case-line]')
            if (lines.length) {
              gsap.from(lines, {
                y: 28,
                opacity: 0,
                duration: 0.7,
                stagger: 0.08,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: article,
                  start: 'top 78%',
                  once: true,
                },
              })
            }

            const next = article.querySelector('[data-case-next]')
            if (next && i < gsap.utils.toArray('[data-case-study]').length - 1) {
              gsap.from(next, {
                x: -40,
                opacity: 0,
                duration: 0.75,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: next,
                  start: 'top 92%',
                  once: true,
                },
              })
            }
          })

          // —— About: portrait from side + pull quote ——
          const aboutPortrait = document.querySelector('[data-about-portrait]')
          if (aboutPortrait) {
            gsap.from(aboutPortrait, {
              x: -56,
              opacity: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: aboutPortrait,
                start: 'top 85%',
                once: true,
              },
            })
          }

          const pullQuote = document.querySelector('[data-pull-quote]')
          if (pullQuote) {
            gsap.from(pullQuote, {
              opacity: 0,
              y: 20,
              duration: 1.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: pullQuote,
                start: 'top 88%',
                once: true,
              },
            })
          }

          // —— Contact form fields stagger ——
          ScrollTrigger.batch('[data-form-field]', {
            start: 'top 92%',
            onEnter: (batch) =>
              gsap.fromTo(
                batch,
                { y: 24, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.65,
                  stagger: 0.09,
                  ease: 'power2.out',
                  overwrite: true,
                },
              ),
            once: true,
          })

          // —— Scroll progress bar ——
          gsap.fromTo(
            '[data-progress-bar]',
            { scaleX: 0, transformOrigin: 'left center' },
            {
              scaleX: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: document.documentElement,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.25,
              },
            },
          )
        },
      )

      ScrollTrigger.refresh()
      return () => mm.revert()
    },
    { dependencies: [] },
  )
}
