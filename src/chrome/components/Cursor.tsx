import { useEffect, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'


/** Chrome bead cursor: a tiny mirrored sphere + hairline ring on desktop. */
export function Cursor() {
  const reduced = useReducedMotion()
  const [active] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  )
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    if (!active || reduced) return

    const bead = document.querySelector('[data-cursor-bead]') as HTMLElement | null
    const ring = document.querySelector('[data-cursor-ring]') as HTMLElement | null
    // Only hide the native cursor once there is something to replace it
    // with — otherwise a missing bead leaves the page with no pointer at all.
    if (!bead || !ring) return

    document.body.classList.add('cursor-custom')

    const place = (el: HTMLElement, x: number, y: number) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    // Both marks are written straight from the pointer event. The ring used to
    // be eased toward the pointer inside a requestAnimationFrame loop, which is
    // only as fast as the frame rate — and this page runs a headline shader,
    // four cube renderers and the hero torus, so frames get scarce exactly
    // when the pointer is moving over the hero. The result was a ring sitting
    // hundreds of pixels away from the cursor it was supposed to be. With the
    // native cursor hidden, that is not a flourish, it is a broken pointer.
    const onMove = (e: MouseEvent) => {
      place(bead, e.clientX, e.clientY)
      place(ring, e.clientX, e.clientY)
    }

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement
      setHovering(!!t.closest('a, button, [data-magnetic], summary, label'))
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.body.classList.remove('cursor-custom')
    }
  }, [active, reduced])

  if (!active || reduced) return null

  return (
    <>
      <div
        data-cursor-ring
        aria-hidden
        className={`pointer-events-none fixed top-0 left-0 z-[10001] -ml-5 -mt-5 h-10 w-10 rounded-full border transition-[scale,opacity,border-color] duration-300 ${
          hovering ? 'scale-[1.6] opacity-90' : 'scale-100 opacity-60'
        }`}
        style={{ borderColor: hovering ? 'var(--cursor-ring-strong)' : 'var(--cursor-ring-soft)' }}
      />
      <div
        data-cursor-bead
        aria-hidden
        /* The bead marks the exact click point, so it keeps its size on hover:
           shrinking it to 6px used to leave the trailing ring as the only
           thing to aim with. */
        className="pointer-events-none fixed top-0 left-0 z-[10002] -ml-[5px] -mt-[5px] h-[10px] w-[10px] rounded-full"
        style={{
          background:
            'radial-gradient(circle at 35% 30%, #ffffff 0%, #d8dbe0 25%, #6b6f76 60%, #1a1b1f 100%)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.35), 0 2px 8px rgba(0,0,0,0.6)',
        }}
      />
    </>
  )
}
