import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { useLocale } from '../i18n/context'

type Props = { onComplete: () => void }

/** Hard ceiling on how long the overlay may hold the page, in ms. */
const MAX_HOLD_MS = 1400

/** Minimal chrome preloader: monogram + hairline that fills like a light sweep. */
export function Preloader({ onComplete }: Props) {
  const { t: c } = useLocale()
  const [done, setDone] = useState(false)


  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      onComplete()
      return
    }

    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      setDone(true)
      onComplete()
    }

    const tl = gsap.timeline({ onComplete: finish })
    // Shortened deliberately. This overlay is opaque and covers the headline,
    // which is the page's LCP element, so every millisecond it runs is added
    // to LCP directly.
    tl.fromTo('[data-pre-line]', { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: 'power3.inOut' })
      .fromTo('[data-pre-mark]', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 }, 0.1)
      .to('[data-pre-wrap]', { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, '+=0.05')

    // GSAP runs on requestAnimationFrame, which a browser throttles or stops
    // outright for a background tab. Without this the timeline's onComplete
    // may never fire and the visitor is left looking at an opaque overlay for
    // as long as they leave the tab alone.
    const safety = window.setTimeout(finish, MAX_HOLD_MS)

    return () => {
      window.clearTimeout(safety)
      tl.kill()
    }
  }, [onComplete])

  if (done) return null

  return (
    <div
      data-pre-wrap
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-ink"
      aria-hidden
    >
      <p data-pre-mark className="chrome-text font-display text-3xl font-bold tracking-[-0.05em]">
        {c.mark}
      </p>
      <div className="mt-6 h-px w-40 overflow-hidden bg-white/10">
        <div data-pre-line className="hairline h-full w-full origin-left" />
      </div>
    </div>
  )
}
