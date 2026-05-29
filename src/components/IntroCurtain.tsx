import { useEffect, useRef } from 'react'
import { gsap } from '../animation/gsap'
import { site } from '../data/content'
import { useReducedMotion } from '../hooks/useReducedMotion'

const MAX_MS = 1500

type IntroCurtainProps = {
  onComplete: () => void
}

export function IntroCurtain({ onComplete }: IntroCurtainProps) {
  const curtainRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLParagraphElement>(null)
  const finishedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  const reduced = useReducedMotion()

  onCompleteRef.current = onComplete

  useEffect(() => {
    const finish = () => {
      if (finishedRef.current) return
      finishedRef.current = true
      onCompleteRef.current()
    }

    if (reduced) {
      finish()
      return
    }

    const curtain = curtainRef.current
    const line = lineRef.current
    if (!curtain || !line) {
      finish()
      return
    }

    let tl: gsap.core.Timeline | null = null

    const teardown = () => {
      tl?.kill()
      tl = null
      if (curtain.isConnected) {
        gsap.killTweensOf([curtain, line])
        curtain.remove()
      }
    }

    tl = gsap.timeline({
      onComplete: () => {
        teardown()
        finish()
      },
    })

    tl.fromTo(line, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' })
    tl.to(line, { opacity: 0, duration: 0.35, ease: 'power2.in' }, '+=0.25')
    tl.to(
      curtain,
      { opacity: 0, duration: 0.4, ease: 'power2.inOut', pointerEvents: 'none' },
      '-=0.1',
    )

    const failSafe = window.setTimeout(() => {
      teardown()
      finish()
    }, MAX_MS)

    return () => {
      window.clearTimeout(failSafe)
      teardown()
    }
  }, [reduced])

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
