import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function CustomCursor() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine || reduced) return

    setActive(true)
    document.body.classList.add('cursor-custom')

    const dot = document.querySelector('[data-cursor-dot]') as HTMLElement
    const ring = document.querySelector('[data-cursor-ring]') as HTMLElement
    if (!dot || !ring) return

    let mx = 0
    let my = 0
    let rx = 0
    let ry = 0
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate(${mx}px, ${my}px)`
    }

    const loop = () => {
      rx += (mx - rx) * 0.15
      ry += (my - ry) * 0.15
      ring.style.transform = `translate(${rx}px, ${ry}px)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement
      if (t.closest('a, button, [data-magnetic]')) setHovering(true)
    }
    const onOut = () => setHovering(false)

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.body.classList.remove('cursor-custom')
    }
  }, [reduced])

  if (!active || reduced) return null

  return (
    <>
      <div
        data-cursor-ring
        aria-hidden
        className={`pointer-events-none fixed top-0 left-0 z-[10001] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ${
          hovering ? 'border-mint scale-150 opacity-90' : 'border-cream/30 scale-100 opacity-50'
        }`}
      />
      <div
        data-cursor-dot
        aria-hidden
        className={`pointer-events-none fixed top-0 left-0 z-[10002] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-200 ${
          hovering ? 'bg-mint scale-[2]' : 'bg-cream'
        }`}
      />
    </>
  )
}
