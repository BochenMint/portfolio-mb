import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger } from '../../animation/gsap'

const REVEAL_SEL = '[data-reveal], [data-card]'

function outermost(selector: string) {
  return gsap.utils.toArray<HTMLElement>(selector).filter((el) => {
    const parent = el.parentElement
    if (!parent) return true
    return !parent.closest('[data-reveal], [data-card]')
  })
}

function markRevealed(els: HTMLElement[]) {
  for (const el of els) el.setAttribute('data-revealed', '')
}

/**
 * Entrance + scroll reveals for the Chrome edition.
 *
 * `fromTo(..., { y, opacity: 0 })` on enter was the flash: modules sat at
 * opacity 1 below the fold, then the trigger slammed them to 0 / +y and
 * tweened back. Nested `[data-reveal]` inside `[data-card]` compounded that
 * jump. Outermost targets start hidden, play once via `to()`, and ignore a
 * second onEnter (Lenis + pin refresh).
 */
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
            document.querySelectorAll(REVEAL_SEL).forEach((el) => el.setAttribute('data-revealed', ''))
            return
          }

          gsap.from('[data-hero-line]', {
            y: 36,
            opacity: 0,
            duration: 1.1,
            stagger: 0.14,
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
          // Touch: opacity only. Translate/scale on an overflow-visible host
          // walked the car ~11px into the lead during the 1.4s intro.
          const coarse = window.matchMedia('(pointer: coarse)').matches
          gsap.from(
            '[data-hero-object]',
            coarse
              ? {
                  opacity: 0,
                  duration: 0.8,
                  ease: 'power3.out',
                  delay: 0.2,
                  clearProps: 'opacity',
                }
              : {
                  opacity: 0,
                  scale: 0.92,
                  y: 30,
                  duration: 1.4,
                  ease: 'power3.out',
                  delay: 0.2,
                  clearProps: 'transform,opacity',
                },
          )
          gsap.from('[data-stat]', {
            scrollTrigger: { trigger: '[data-stats]', start: 'top 85%' },
            y: 24,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
          })

          const reveals = outermost('[data-reveal]')
          const cards = outermost('[data-card]')
          gsap.set(reveals, { y: 28, opacity: 0 })
          gsap.set(cards, { y: 48, opacity: 0 })

          const play = (batch: Element[], duration: number) => {
            const els = (batch as HTMLElement[]).filter((el) => !el.hasAttribute('data-revealed'))
            if (!els.length) return
            markRevealed(els)
            const passed = els.filter((el) => el.getBoundingClientRect().bottom <= 0)
            const onscreen = els.filter((el) => el.getBoundingClientRect().bottom > 0)
            if (passed.length) {
              gsap.set(passed, { opacity: 1, y: 0, clearProps: 'transform,willChange' })
            }
            if (!onscreen.length) return
            gsap.to(onscreen, {
              y: 0,
              opacity: 1,
              duration,
              stagger: 0.07,
              ease: 'power3.out',
              overwrite: true,
              onComplete() {
                gsap.set(onscreen, { clearProps: 'transform,willChange' })
              },
            })
          }

          ScrollTrigger.batch(reveals, {
            start: 'top 90%',
            onEnter: (batch) => play(batch, 0.8),
            once: true,
          })

          ScrollTrigger.batch(cards, {
            start: 'top 88%',
            onEnter: (batch) => play(batch, 0.9),
            once: true,
          })

          const catchup = () => {
            const line = window.innerHeight * 0.9
            play(
              reveals.filter((el) => !el.hasAttribute('data-revealed') && el.getBoundingClientRect().top < line),
              0.8,
            )
            play(
              cards.filter((el) => !el.hasAttribute('data-revealed') && el.getBoundingClientRect().top < line),
              0.9,
            )
          }
          ScrollTrigger.addEventListener('update', catchup)
          window.addEventListener('scroll', catchup, { passive: true })
          catchup()

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

          const safety = window.setTimeout(catchup, 2500)

          return () => {
            window.clearTimeout(safety)
            window.removeEventListener('scroll', catchup)
            ScrollTrigger.removeEventListener('update', catchup)
          }
        },
      )
    })

    return () => ctx.revert()
  }, [ready])
}
