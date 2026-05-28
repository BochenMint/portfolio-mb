import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../animation/gsap'

export function useLenis() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 767px)').matches
    if (reduced) return

    const lenis = new Lenis({
      duration: mobile ? 0.8 : 1.12,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !mobile,
      lerp: mobile ? 1 : undefined,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    return () => {
      window.removeEventListener('load', onLoad)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}
