import { useEffect, useState } from 'react'
import gsap from 'gsap'

type Props = {
  onComplete: () => void
}

export function Preloader({ onComplete }: Props) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      onComplete()
      return
    }

    const obj = { value: 0 }
    const tween = gsap.to(obj, {
      value: 100,
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate: () => setProgress(Math.round(obj.value)),
      onComplete: () => {
        gsap.to('.preloader-panel', {
          yPercent: -100,
          duration: 0.9,
          ease: 'power4.inOut',
          stagger: 0.06,
        })
        gsap.to('.preloader-wrap', {
          opacity: 0,
          duration: 0.4,
          delay: 0.75,
          onComplete,
        })
      },
    })

    return () => {
      tween.kill()
    }
  }, [onComplete])

  return (
    <div
      className="preloader-wrap fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-ink"
      aria-hidden={progress >= 100}
    >
      <div className="preloader-panel absolute inset-0 bg-surface" />
      <div className="preloader-panel absolute inset-0 bg-surface-2" style={{ clipPath: 'inset(0 0 50% 0)' }} />
      <p className="relative z-10 font-display text-sm font-semibold tracking-[0.35em] text-mint uppercase">
        Portfolio
      </p>
      <p className="relative z-10 mt-6 font-display text-5xl font-bold tabular-nums md:text-7xl">
        {progress}
        <span className="text-muted text-2xl md:text-3xl">%</span>
      </p>
    </div>
  )
}
