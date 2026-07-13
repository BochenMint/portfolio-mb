import { lazy, Suspense, useCallback, useMemo } from 'react'
import { useCoarsePointer } from '../../hooks/useCoarsePointer'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { HeroBackground } from './HeroBackground'

const HeroWebGLCanvas = lazy(() =>
  import('./HeroWebGLCanvas').then((m) => ({ default: m.HeroWebGLCanvas })),
)

/**
 * CSS fallback — "warm glass + sun" aesthetic.
 * Uses keyframes: hero-orbit-sun-pulse, hero-orbit-shard-float-1/2/3
 * (defined in hero-variants.css by the main agent).
 */
function OrbitCssFallback() {
  return (
    <div className="hero-orbit-stage hero-orbit-stage--css" aria-hidden>
      {/* Warm radial sun glow from upper-right */}
      <div className="hero-orbit-sun-glow" />

      {/* Floating glass shards */}
      <div className="hero-orbit-shard hero-orbit-shard--1" />
      <div className="hero-orbit-shard hero-orbit-shard--2" />
      <div className="hero-orbit-shard hero-orbit-shard--3" />
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
