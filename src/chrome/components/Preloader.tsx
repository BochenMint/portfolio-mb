import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { chromeCopy as c } from '../copy'

type Props = { onComplete: () => void }

/** Minimal chrome preloader: monogram + hairline that fills like a light sweep. */
export function Preloader({ onComplete }: Props) {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      onComplete()
      return
    }
    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true)
        onComplete()
      },
    })
    tl.fromTo('[data-pre-line]', { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power3.inOut' })
      .fromTo('[data-pre-mark]', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 0.2)
      .to('[data-pre-wrap]', { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, '+=0.15')
    return () => {
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
