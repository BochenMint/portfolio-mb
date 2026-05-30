import { lazy, Suspense, useCallback, useMemo } from 'react'
import { useCoarsePointer } from '../../hooks/useCoarsePointer'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { HeroBackground } from './HeroBackground'

const HeroWebGLCanvas = lazy(() =>
  import('./HeroWebGLCanvas').then((m) => ({ default: m.HeroWebGLCanvas })),
)

function OrbitCssFallback() {
  return (
    <div className="hero-orbit-stage hero-orbit-stage--css">
      <svg className="hero-orbit-svg" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          {Array.from({ length: 5 }, (_, i) => {
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
  )
}

export function HeroOrbitLayer() {
  const reduced = useReducedMotion()
  const coarse = useCoarsePointer()

  const createScene = useCallback(
    (canvas: HTMLCanvasElement) =>
      import('../../webgl/hero/createOrbitHeroScene').then((m) =>
        m.createOrbitHeroScene(canvas, { reducedMotion: reduced, lowPower: coarse }),
      ),
    [reduced, coarse],
  )

  const webglFallback = useMemo(
    () => (
      <Suspense fallback={<OrbitCssFallback />}>
        <div className="hero-orbit-layer hero-orbit-layer--webgl pointer-events-none absolute inset-0 flex items-center justify-center">
          <HeroWebGLCanvas
            className="hero-orbit-stage h-[min(120vmin,900px)] w-[min(120vmin,900px)]"
            createScene={createScene}
            fallback={<OrbitCssFallback />}
          />
        </div>
      </Suspense>
    ),
    [createScene],
  )

  return (
    <HeroBackground
      variant="orbit"
      layerClassName="hero-orbit-layer pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
      webglFallback={webglFallback}
      cssFallback={<OrbitCssFallback />}
    />
  )
}
