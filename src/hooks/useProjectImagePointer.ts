import { useEffect, useRef } from 'react'
import { gsap } from '../animation/gsap'
import { useReducedMotion } from './useReducedMotion'

export type ImageInteractionLevel = 'hero' | 'subtle'

const TILT: Record<ImageInteractionLevel, number> = {
  hero: 7,
  subtle: 3.5,
}

const PARALLAX: Record<ImageInteractionLevel, number> = {
  hero: 16,
  subtle: 8,
}

const SCALE: Record<ImageInteractionLevel, number> = {
  hero: 1.04,
  subtle: 1.02,
}

export function useProjectImagePointer(level: ImageInteractionLevel, enabled = true) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    if (!root || reduced || !enabled) return

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return

    const tiltEl = root.querySelector<HTMLElement>('[data-tilt]')
    const mediaEl = root.querySelector<HTMLElement>('[data-parallax]')
    const shineEl = root.querySelector<HTMLElement>('[data-shine]')
    if (!tiltEl) return

    const tiltMax = TILT[level]
    const parallaxMax = PARALLAX[level]
    const scaleMax = SCALE[level]
    const duration = level === 'hero' ? 0.72 : 0.55

    gsap.set(tiltEl, {
      '--tilt-x': '0deg',
      '--tilt-y': '0deg',
      '--tilt-scale': 1,
    })
    if (mediaEl) gsap.set(mediaEl, { '--px': 0, '--py': 0 })
    if (shineEl) gsap.set(shineEl, { '--shine-x': 0, '--shine-y': 0, opacity: 0 })

    const tiltXTo = gsap.quickTo(tiltEl, '--tilt-x', {
      duration,
      ease: 'power3.out',
      unit: 'deg',
    })
    const tiltYTo = gsap.quickTo(tiltEl, '--tilt-y', {
      duration,
      ease: 'power3.out',
      unit: 'deg',
    })
    const scaleTo = gsap.quickTo(tiltEl, '--tilt-scale', {
      duration: duration + 0.15,
      ease: 'power3.out',
    })
    const pxTo = mediaEl
      ? gsap.quickTo(mediaEl, '--px', { duration, ease: 'power3.out', unit: 'px' })
      : null
    const pyTo = mediaEl
      ? gsap.quickTo(mediaEl, '--py', { duration, ease: 'power3.out', unit: 'px' })
      : null
    const shineXTo = shineEl
      ? gsap.quickTo(shineEl, '--shine-x', { duration: 0.4, ease: 'power2.out' })
      : null
    const shineYTo = shineEl
      ? gsap.quickTo(shineEl, '--shine-y', { duration: 0.4, ease: 'power2.out' })
      : null
    const shineOpacityTo = shineEl
      ? gsap.quickTo(shineEl, 'opacity', { duration: 0.35, ease: 'power2.out' })
      : null

    const onMove = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1

      tiltYTo(nx * tiltMax)
      tiltXTo(-ny * tiltMax)
      scaleTo(scaleMax)
      pxTo?.(nx * parallaxMax)
      pyTo?.(ny * parallaxMax)
      shineXTo?.(nx)
      shineYTo?.(ny)
      shineOpacityTo?.(level === 'hero' ? 1 : 0.55)
    }

    const reset = () => {
      tiltXTo(0)
      tiltYTo(0)
      scaleTo(1)
      pxTo?.(0)
      pyTo?.(0)
      shineXTo?.(0)
      shineYTo?.(0)
      shineOpacityTo?.(0)
    }

    root.addEventListener('mousemove', onMove)
    root.addEventListener('mouseleave', reset)

    return () => {
      root.removeEventListener('mousemove', onMove)
      root.removeEventListener('mouseleave', reset)
    }
  }, [level, reduced, enabled])

  return { rootRef, interactive: enabled && !reduced }
}
