import { useEffect, useRef } from 'react'
import { gsap } from '../animation/gsap'
import { site } from '../data/content'
import { useReducedMotion } from '../hooks/useReducedMotion'

const MAX_MS = 1200

type IntroCurtainProps = {
  onComplete: () => void
}

export function IntroCurtain({ onComplete }: IntroCurtainProps) {
  const curtainRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const curtain = curtainRef.current
    const line = lineRef.current
    if (!curtain || !line) {
      onComplete()
      return
    }

    if (reduced) {
      curtain.remove()
      onComplete()
      return
    }

    const tl = gsap.timeline({
      onComplete: () => {
        curtain.remove()
        onComplete()
      },
    })

    tl.fromTo(line, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' })
    tl.to(line, { opacity: 0, duration: 0.35, ease: 'power2.in' }, '+=0.25')
    tl.to(curtain, { opacity: 0, duration: 0.4, ease: 'power2.inOut' }, '-=0.1')

    const failSafe = window.setTimeout(() => {
      if (document.body.contains(curtain)) {
        tl.kill()
        curtain.remove()
        onComplete()
      }
    }, MAX_MS)

    return () => window.clearTimeout(failSafe)
  }, [onComplete, reduced])

  if (reduced) return null

  return (
    <div
      ref={curtainRef}
      data-intro-curtain
      className="intro-curtain fixed inset-0 z-[200] flex items-center justify-center bg-[var(--color-ink)]"
      aria-hidden
    >
      <p
        ref={lineRef}
        className="font-headline text-[clamp(1.5rem,4vw,2.75rem)] tracking-tight text-[var(--color-paper)]"
      >
        {site.name}
      </p>
    </div>
  )
}
