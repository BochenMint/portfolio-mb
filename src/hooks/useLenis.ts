import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../animation/gsap'

export function useLenis() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const mobile = window.matchMedia('(max-width: 767px)').matches

    const lenis = new Lenis({
      duration: mobile ? 0.85 : 1.12,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !mobile,
      lerp: mobile ? 1 : undefined,
      // Anchor clicks go through Lenis instead of the browser's own smooth
      // scroll, so the two never fight over the target. Lenis honours the
      // section's scroll-margin-top, which keeps the fixed nav off headings.
      anchors: true,
    })

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value?: number) {
        if (arguments.length && typeof value === 'number') {
          lenis.scrollTo(value, { immediate: true })
        }
        return lenis.scroll
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
    })

    lenis.on('scroll', ScrollTrigger.update)

    // Overlaye (case study) muszą móc zatrzymać smooth scroll strony pod spodem.
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.addEventListener('refresh', onRefresh)
    ScrollTrigger.refresh()

    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    function onRefresh() {
      lenis.resize()
    }

    return () => {
      window.removeEventListener('load', onLoad)
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      gsap.ticker.remove(tick)
      delete (window as unknown as { __lenis?: Lenis }).__lenis
      lenis.destroy()
      ScrollTrigger.scrollerProxy(document.documentElement, {})
    }
  }, [])
}
