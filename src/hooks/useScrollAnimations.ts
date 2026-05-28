import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../animation/gsap'

const SCRUB = 1
const SCRUB_SOFT = 0.9

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
              '[data-hero-line], [data-hero-word], [data-hero-fade], [data-reveal], [data-stat], [data-project-card], [data-contact-cta], [data-case-copy], [data-case-image-inner]',
              { opacity: 1, y: 0, yPercent: 0, scale: 1, clipPath: 'none', clearProps: 'transform,clipPath' },
            )
          }

          if (reduce) {
            showFinal()
            gsap.set('[data-progress-bar], [data-work-progress-bar]', { scaleX: 1 })
            document.querySelector('[data-curtain]')?.remove()
            return
          }

          // Page curtain
          const curtain = document.querySelector('[data-curtain]')
          if (curtain) {
            gsap.to(curtain, {
              opacity: 0,
              duration: 0.85,
              ease: 'power3.out',
              delay: 0.05,
              onComplete: () => curtain.remove(),
            })
          }

          if (motion) {
            gsap.from('[data-hero-line]', {
              yPercent: 108,
              opacity: 0,
              duration: 1.05,
              stagger: 0.11,
              ease: 'power3.out',
              delay: 0.12,
            })

            gsap.from('[data-hero-word]', {
              yPercent: 115,
              opacity: 0,
              duration: 0.72,
              stagger: 0.028,
              ease: 'power3.out',
              delay: 0.28,
            })

            gsap.from('[data-hero-fade]', {
              opacity: 0,
              y: 28,
              duration: 0.85,
              stagger: 0.07,
              ease: 'power3.out',
              delay: 0.45,
            })

            const heroMedia = document.querySelector('[data-hero-parallax]')
            if (heroMedia) {
              gsap.from(heroMedia, {
                scale: 1.08,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                delay: 0.35,
              })

              gsap.to(heroMedia, {
                yPercent: 14,
                ease: 'none',
                scrollTrigger: {
                  trigger: '[data-hero]',
                  start: 'top top',
                  end: 'bottom top',
                  scrub: SCRUB,
                },
              })
            }

            gsap.to('[data-progress-bar]', {
              scaleX: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: document.documentElement,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.35,
              },
            })

            ScrollTrigger.batch('[data-reveal]', {
              start: 'top 86%',
              onEnter: (batch) =>
                gsap.fromTo(
                  batch,
                  { y: 48, opacity: 0 },
                  {
                    y: 0,
                    opacity: 1,
                    duration: 0.9,
                    stagger: 0.09,
                    ease: 'power3.out',
                    overwrite: true,
                  },
                ),
              once: true,
            })

            const about = document.querySelector('[data-about]')
            if (about) {
              gsap.from(about, {
                clipPath: 'inset(100% 0 0 0)',
                ease: 'none',
                scrollTrigger: {
                  trigger: about,
                  start: 'top 98%',
                  end: 'top 72%',
                  scrub: SCRUB_SOFT,
                },
              })
            }

            gsap.utils.toArray<HTMLElement>('[data-service-row]').forEach((row, i) => {
              gsap.from(row, {
                scrollTrigger: { trigger: row, start: 'top 88%', once: true },
                x: i % 2 === 0 ? -36 : 36,
                opacity: 0,
                duration: 0.85,
                ease: 'power3.out',
              })
            })

            const caseInner = document.querySelector('[data-case-image-inner]')
            const caseFlagship = document.querySelector('[data-case-flagship]')
            if (caseInner && caseFlagship) {
              gsap.fromTo(
                caseInner,
                { scale: 1.14 },
                {
                  scale: 1,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: caseFlagship,
                    start: 'top 85%',
                    end: 'center center',
                    scrub: SCRUB,
                  },
                },
              )

              gsap.from('[data-case-copy] > *', {
                scrollTrigger: { trigger: caseFlagship, start: 'top 75%', once: true },
                y: 32,
                opacity: 0,
                duration: 0.8,
                stagger: 0.08,
                ease: 'power3.out',
              })
            }

            gsap.utils.toArray<HTMLElement>('[data-contact-cta]').forEach((el) => {
              gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 90%', once: true },
                y: 40,
                opacity: 0,
                duration: 0.9,
                ease: 'power3.out',
              })
            })
          }

          if (desktop && motion) {
            const workPin = document.querySelector('[data-work-pin]')
            const workTrack = document.querySelector('[data-work-track]') as HTMLElement | null
            if (workPin && workTrack) {
              const getScroll = () => Math.max(0, workTrack.scrollWidth - window.innerWidth + 48)
              const cards = gsap.utils.toArray<HTMLElement>('[data-work-track] [data-project-card]')
              const progressBar = document.querySelector('[data-work-progress-bar]')
              const progressLabel = document.querySelector('[data-work-progress-label]')

              const workSt = ScrollTrigger.create({
                trigger: workPin,
                pin: true,
                scrub: SCRUB,
                end: () => `+=${getScroll()}`,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate(self) {
                  const total = cards.length || 1
                  const idx = Math.min(total - 1, Math.floor(self.progress * total))
                  if (progressLabel) {
                    progressLabel.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
                  }
                },
              })

              gsap.to(workTrack, {
                x: () => -getScroll(),
                ease: 'none',
                scrollTrigger: workSt,
              })

              if (progressBar) {
                gsap.to(progressBar, {
                  scaleX: 1,
                  ease: 'none',
                  scrollTrigger: workSt,
                })
              }

              cards.forEach((card, i) => {
                gsap.fromTo(
                  card,
                  { scale: 0.94, filter: 'brightness(0.92)' },
                  {
                    scale: 1,
                    filter: 'brightness(1)',
                    ease: 'none',
                    scrollTrigger: {
                      trigger: workPin,
                      start: () => `top top+=${(getScroll() / Math.max(cards.length, 1)) * i}`,
                      end: () => `top top+=${(getScroll() / Math.max(cards.length, 1)) * (i + 0.65)}`,
                      scrub: SCRUB_SOFT,
                    },
                  },
                )
              })
            }
          } else if (motion) {
            gsap.utils.toArray<HTMLElement>('[data-project-card]').forEach((card) => {
              gsap.fromTo(
                card,
                { y: 72, opacity: 0.35, scale: 0.96 },
                {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  ease: 'power3.out',
                  scrollTrigger: {
                    trigger: card,
                    start: 'top 92%',
                    end: 'top 58%',
                    scrub: SCRUB_SOFT,
                  },
                },
              )
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
