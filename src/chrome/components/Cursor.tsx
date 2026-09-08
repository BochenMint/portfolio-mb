import { useEffect, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/** How close the trailing ring gets to the pointer per frame. */
const RING_EASE = 0.32
/** Past this gap the ring teleports instead of gliding: a dropped frame
 *  (WebGL init, GC, tab switch, pointer re-entering the window) otherwise
 *  sends it flying across the screen, which reads as the cursor running off. */
const RING_SNAP_PX = 140

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

    let mx = -100
    let my = -100
    let rx = -100
    let ry = -100
    let raf = 0
    // While the pointer is over something clickable the ring is the shape the
    // eye aims with, so it has to sit exactly on the pointer — a trailing ring
    // makes small targets (the 36px theme toggle) miss.
    let onTarget = false

    const place = (el: HTMLElement, x: number, y: number) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      place(bead, mx, my)
    }
    const loop = () => {
      const ease = onTarget || Math.hypot(mx - rx, my - ry) > RING_SNAP_PX ? 1 : RING_EASE
      rx += (mx - rx) * ease
      ry += (my - ry) * ease
      place(ring, rx, ry)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement
      onTarget = !!t.closest('a, button, [data-magnetic], summary, label')
      setHovering(onTarget)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)

    return () => {
      cancelAnimationFrame(raf)
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
