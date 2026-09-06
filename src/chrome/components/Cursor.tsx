import { useEffect, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/** Chrome bead cursor: a tiny mirrored sphere + hairline ring on desktop. */
export function Cursor() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine || reduced) return

    setActive(true)
    document.body.classList.add('cursor-custom')

    const bead = document.querySelector('[data-cursor-bead]') as HTMLElement | null
    const ring = document.querySelector('[data-cursor-ring]') as HTMLElement | null
    if (!bead || !ring) return

    let mx = -100
    let my = -100
    let rx = -100
    let ry = -100
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      bead.style.transform = `translate3d(${mx}px, ${my}px, 0)`
    }
    const loop = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement
      setHovering(!!t.closest('a, button, [data-magnetic], summary, label'))
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.body.classList.remove('cursor-custom')
    }
  }, [reduced])

  if (!active || reduced) return null

  return (
    <>
      <div
        data-cursor-ring
        aria-hidden
        className={`pointer-events-none fixed top-0 left-0 z-[10001] -ml-5 -mt-5 h-10 w-10 rounded-full border transition-[scale,opacity,border-color] duration-300 ${
          hovering ? 'scale-[1.6] border-white/70 opacity-90' : 'scale-100 border-white/25 opacity-60'
        }`}
      />
      <div
        data-cursor-bead
        aria-hidden
        className={`pointer-events-none fixed top-0 left-0 z-[10002] -ml-[5px] -mt-[5px] h-[10px] w-[10px] rounded-full transition-[scale] duration-200 ${
          hovering ? 'scale-[0.6]' : 'scale-100'
        }`}
        style={{
          background:
            'radial-gradient(circle at 35% 30%, #ffffff 0%, #d8dbe0 25%, #6b6f76 60%, #1a1b1f 100%)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.35), 0 2px 8px rgba(0,0,0,0.6)',
        }}
      />
    </>
  )
}
