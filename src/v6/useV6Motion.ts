import { useEffect } from 'react'
import { gsap } from '../animation/gsap'
import { prefersReducedMotion } from './utils'

const STEP_EASE = 'steps(8)'
const STEP_FAST = 'steps(4)'

export function useV6Motion() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-v6-split]').forEach((el) => {
        const text = el.textContent ?? ''
        el.textContent = ''
        const words = text.split(/\s+/).filter(Boolean)
        words.forEach((word, i) => {
          const wrap = document.createElement('span')
          wrap.className = 'v6-split-word'
          wrap.style.display = 'inline-block'
          wrap.style.overflow = 'hidden'
          if (i < words.length - 1) wrap.style.marginRight = '0.32em'

          const inner = document.createElement('span')
          inner.textContent = word
          inner.style.display = 'inline-block'
          wrap.appendChild(inner)
          el.appendChild(wrap)

          gsap.fromTo(
            inner,
            { yPercent: 100, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.48,
              ease: STEP_EASE,
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none reverse',
              },
              delay: i * 0.04,
            },
          )
        })
      })

      gsap.utils.toArray<HTMLElement>('.v6-rule-reveal').forEach((rule) => {
        gsap.fromTo(
          rule,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 0.64,
            ease: STEP_FAST,
            scrollTrigger: {
              trigger: rule,
              start: 'top 92%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      const heroRule = document.querySelector<HTMLElement>('.v6-hero-rule')
      if (heroRule) {
        gsap.fromTo(
          heroRule,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.72, ease: STEP_FAST, delay: 0.15 },
        )
      }

      gsap.utils.toArray<HTMLElement>('.v6-section-body').forEach((body) => {
        if (body.closest('.v6-work')) return
        gsap.fromTo(
          body,
          {
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
            opacity: 0.4,
          },
          {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            opacity: 1,
            duration: 0.72,
            ease: STEP_EASE,
            scrollTrigger: {
              trigger: body.closest('.v6-section') ?? body,
              start: 'top 86%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      gsap.utils.toArray<HTMLElement>('.v6-work-frame').forEach((frame) => {
        gsap.fromTo(
          frame,
          {
            clipPath: 'inset(0 100% 0 0)',
            opacity: 0.6,
          },
          {
            clipPath: 'inset(0 0% 0 0)',
            opacity: 1,
            duration: 0.8,
            ease: STEP_EASE,
            scrollTrigger: {
              trigger: frame,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      gsap.utils.toArray<HTMLElement>('.v6-proof-cell').forEach((cell, i) => {
        gsap.fromTo(
          cell,
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: STEP_FAST,
            scrollTrigger: {
              trigger: cell,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            delay: i * 0.06,
          },
        )
      })
    })

    return () => ctx.revert()
  }, [])
}
