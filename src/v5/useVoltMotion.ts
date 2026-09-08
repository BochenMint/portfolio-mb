import { useEffect } from 'react'
import type { RefObject } from 'react'
import { gsap, ScrollTrigger } from '../animation/gsap'
import { prefersReducedMotion } from './utils'

export function useVoltMotion() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const bg = document.querySelector<HTMLElement>('.volt-bg-morph')
      if (bg) {
        // Hex values — GSAP cannot reliably tween CSS custom properties for backgroundColor
        const stops = [
          { trigger: '#volt-hero', color: '#f2f5f7' },
          { trigger: '#volt-ledger', color: '#b8f000' },
          { trigger: '#volt-work', color: '#f2f5f7' },
          { trigger: '#volt-offer', color: '#0c6b6b' },
          { trigger: '#volt-packages', color: '#f2f5f7' },
          { trigger: '#volt-proof', color: '#0c6b6b' },
          { trigger: '#kontakt', color: '#ff4d1a' },
        ]

        stops.forEach(({ trigger, color }) => {
          ScrollTrigger.create({
            trigger,
            start: 'top 60%',
            end: 'bottom 40%',
            onEnter: () => gsap.to(bg, { backgroundColor: color, duration: 0.6, ease: 'power2.out' }),
            onEnterBack: () => gsap.to(bg, { backgroundColor: color, duration: 0.6, ease: 'power2.out' }),
          })
        })
      }

      gsap.utils.toArray<HTMLElement>('[data-volt-split]').forEach((el) => {
        const text = el.textContent ?? ''
        el.textContent = ''
        const words = text.split(/\s+/).filter(Boolean)
        words.forEach((word, i) => {
          const span = document.createElement('span')
          span.className = 'volt-split-word'
          span.style.display = 'inline-block'
          span.style.overflow = 'hidden'
          if (i < words.length - 1) span.style.marginRight = '0.28em'
          const inner = document.createElement('span')
          inner.textContent = word
          inner.style.display = 'inline-block'
          span.appendChild(inner)
          el.appendChild(span)

          gsap.fromTo(
            inner,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 82%',
                toggleActions: 'play none none reverse',
              },
              delay: i * 0.04,
            },
          )
        })
      })

      gsap.utils.toArray<HTMLElement>('.volt-slab').forEach((slab) => {
        gsap.fromTo(
          slab,
          { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
          {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            duration: 1.1,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: slab,
              start: 'top 78%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      gsap.utils.toArray<HTMLElement>('.volt-ledger-row').forEach((row, i) => {
        gsap.fromTo(
          row,
          { x: -48, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.65,
            delay: i * 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })
    })

    return () => ctx.revert()
  }, [])
}

export function useMagneticCta(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      gsap.to(el, { x: x * 0.22, y: y * 0.22, duration: 0.35, ease: 'power2.out' })
    }
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [ref])
}
