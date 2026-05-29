import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../animation/gsap'

const FINAL_SELECTORS = [
  '[data-hero-fade]',
  '[data-hero-line]',
  '[data-hero-line-inner]',
  '[data-hero-word]',
  '[data-hero-portrait]',
  '[data-reveal]',
  '[data-service-block]',
  '[data-featured-visual]',
  '[data-featured-project]',
  '[data-about-portrait]',
  '[data-pull-quote]',
  '[data-form-field]',
  '[data-section-wipe]',
  '[data-footer-line-inner]',
  '[data-marquee-track]',
].join(', ')

function revealAllFinal() {
  gsap.set(FINAL_SELECTORS, {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    clearProps: 'transform,opacity,clipPath',
  })
  gsap.set('[data-progress-bar]', { scaleX: 1 })
  gsap.set('[data-marquee-track]', { x: 0 })
}

const FROM_OPTS = { immediateRender: false } as const

export function useScrollAnimations(ready = true) {
  useGSAP(
    () => {
      if (!ready) return

      const revealSafety = window.setTimeout(revealAllFinal, 2500)

      const mm = gsap.matchMedia()

      mm.add(
        {
          reduce: '(prefers-reduced-motion: reduce)',
          motion: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { reduce, motion } = context.conditions!

          const showFinal = () => {
            revealAllFinal()
          }

          if (reduce) {
            showFinal()
            return
          }

          if (!motion) {
            showFinal()
            return
          }

          // —— Hero load ——
          gsap.from('[data-hero-line-inner]', {
            yPercent: 110,
            opacity: 0,
            duration: 1.05,
            stagger: 0.14,
            ease: 'power4.out',
            delay: 0.08,
            ...FROM_OPTS,
          })

          gsap.from('[data-hero-word]', {
            yPercent: 120,
            opacity: 0,
            duration: 0.72,
            stagger: 0.035,
            ease: 'power3.out',
            delay: 0.28,
            ...FROM_OPTS,
          })

          gsap.from('[data-hero-fade]', {
            opacity: 0,
            y: 24,
            duration: 0.85,
            stagger: 0.07,
            ease: 'power3.out',
            delay: 0.45,
            ...FROM_OPTS,
          })

          const portrait = document.querySelector('[data-hero-portrait]')
          if (portrait) {
            gsap.from(portrait, {
              scale: 0.94,
              opacity: 0,
              duration: 1.1,
              ease: 'power3.out',
              delay: 0.35,
              ...FROM_OPTS,
            })

            gsap.to(portrait, {
              y: -40,
              ease: 'none',
              scrollTrigger: {
                trigger: '[data-hero]',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.2,
              },
            })
          }

          // —— Project name marquee ——
          const marquee = document.querySelector('[data-marquee-track]')
          if (marquee) {
            gsap.to(marquee, {
              xPercent: -50,
              ease: 'none',
              duration: 32,
              repeat: -1,
            })
          }

          // —— Section wipes ——
          gsap.utils.toArray<HTMLElement>('[data-section-wipe]').forEach((wipe) => {
            gsap.fromTo(
              wipe,
              { scaleX: 0, opacity: 0.4, transformOrigin: 'left center' },
              {
                scaleX: 1,
                opacity: 1,
                ease: 'power3.inOut',
                scrollTrigger: {
                  trigger: wipe,
                  start: 'top 92%',
                  end: 'top 60%',
                  scrub: 0.5,
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
                { y: 40, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.85,
                  stagger: 0.07,
                  ease: 'power3.out',
                  overwrite: true,
                },
              ),
            once: true,
          })

          // —— Service blocks ——
          gsap.utils.toArray<HTMLElement>('[data-service-block]').forEach((block) => {
            gsap.from(block.querySelectorAll('h3, p, ul'), {
              y: 32,
              opacity: 0,
              duration: 0.8,
              stagger: 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: block,
                start: 'top 82%',
                once: true,
              },
            })
          })

          // —— Featured work visuals ——
          gsap.utils.toArray<HTMLElement>('[data-featured-visual]').forEach((visual) => {
            const stillImg = visual.querySelector('.project-interactive__still img')
            if (!stillImg) return
            gsap.fromTo(
              stillImg,
              { scale: 1.12, opacity: 0.5 },
              {
                scale: 1,
                opacity: 1,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: visual,
                  start: 'top 88%',
                  once: true,
                },
              },
            )
          })

          // —— About portrait + quote ——
          const aboutPortrait = document.querySelector('[data-about-portrait]')
          if (aboutPortrait) {
            gsap.from(aboutPortrait, {
              y: 48,
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
              x: -24,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: pullQuote,
                start: 'top 88%',
                once: true,
              },
            })
          }

          // —— Footer CTA lines ——
          gsap.utils.toArray<HTMLElement>('[data-footer-line-inner]').forEach((line, i) => {
            gsap.from(line, {
              yPercent: 110,
              opacity: 0,
              duration: 0.9,
              delay: i * 0.06,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: '[data-footer-cta]',
                start: 'top 85%',
                once: true,
              },
            })
          })

          // —— Contact form ——
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

          // —— Scroll progress ——
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
      return () => {
        window.clearTimeout(revealSafety)
        mm.revert()
        revealAllFinal()
      }
    },
    { dependencies: [ready] },
  )
}
