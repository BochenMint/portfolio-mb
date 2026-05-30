import { useEffect, useRef } from 'react'
import { useCoarsePointer } from '../../hooks/useCoarsePointer'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const RING_COUNT = 5

export function HeroOrbitLayer() {
  const layerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const coarse = useCoarsePointer()

  useEffect(() => {
    if (reduced || coarse) return

    const layer = layerRef.current
    if (!layer) return

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let raf = 0

    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      targetX = nx * 14
      targetY = ny * 10
    }

    const tick = () => {
      currentX += (targetX - currentX) * 0.06
      currentY += (targetY - currentY) * 0.06
      layer.style.setProperty('--orbit-parallax-x', `${currentX}px`)
      layer.style.setProperty('--orbit-parallax-y', `${currentY}px`)
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [reduced, coarse])

  return (
    <div
      ref={layerRef}
      className={`hero-orbit-layer pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden ${
        coarse ? 'hero-orbit-layer--mobile' : ''
      }`}
      aria-hidden
    >
      <div className="hero-orbit-stage">
        <svg
          className="hero-orbit-svg"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="hero-orbit-spin">
            {Array.from({ length: 24 }, (_, i) => {
              const angle = (i / 24) * Math.PI * 2
              const x2 = 400 + Math.cos(angle) * 360
              const y2 = 400 + Math.sin(angle) * 360
              return (
                <line
                  key={`rad-${i}`}
                  x1="400"
                  y1="400"
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.35"
                />
              )
            })}
            {Array.from({ length: RING_COUNT }, (_, i) => {
              const r = 120 + i * 72
              return (
                <circle
                  key={`ring-${i}`}
                  cx="400"
                  cy="400"
                  r={r}
                  stroke="currentColor"
                  strokeWidth={i === 0 ? 1.25 : 0.75}
                  opacity={0.22 + i * 0.06}
                />
              )
            })}
          </g>
          <circle className="hero-orbit-glint" cx="400" cy="88" r="5" fill="#FFE800" />
        </svg>
      </div>
    </div>
  )
}
