import { lazy, Suspense, useCallback, useMemo } from 'react'
import { useCoarsePointer } from '../../hooks/useCoarsePointer'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { HeroBackground } from './HeroBackground'

const HeroWebGLCanvas = lazy(() =>
  import('./HeroWebGLCanvas').then((m) => ({ default: m.HeroWebGLCanvas })),
)

/**
 * CSS fallback — "dark moon + crescent glow + starfield" aesthetic.
 * Uses keyframes: hero-particles-star-twinkle, hero-particles-crescent-pulse
 * (defined in hero-variants.css by the main agent).
 */
function ParticlesCssFallback() {
  return (
    <div className="hero-particles-stage hero-particles-stage--css" aria-hidden>
      {/* Dark radial background + amber crescent glow */}
      <div className="hero-particles-moon-glow" />

      {/* Moon disc */}
      <div className="hero-particles-moon" />

      {/* Crescent amber rim */}
      <div className="hero-particles-crescent" />

      {/* CSS star dots */}
      <div className="hero-particles-star hero-particles-star--1" />
      <div className="hero-particles-star hero-particles-star--2" />
      <div className="hero-particles-star hero-particles-star--3" />
      <div className="hero-particles-star hero-particles-star--4" />
      <div className="hero-particles-star hero-particles-star--5" />
      <div className="hero-particles-star hero-particles-star--6" />
      <div className="hero-particles-star hero-particles-star--7" />
      <div className="hero-particles-star hero-particles-star--8" />
    </div>
  )
}

export function HeroParticlesLayer() {
  const reduced = useReducedMotion()
  const coarse = useCoarsePointer()

  const createScene = useCallback(
    (canvas: HTMLCanvasElement) =>
      import('../../webgl/hero/createParticlesHeroScene').then((m) =>
        m.createParticlesHeroScene(canvas, { reducedMotion: reduced, lowPower: coarse }),
      ),
    [reduced, coarse],
  )

  const webglFallback = useMemo(
    () => (
      <Suspense fallback={<ParticlesCssFallback />}>
        <HeroWebGLCanvas
          className="h-full w-full"
          createScene={createScene}
          fallback={<ParticlesCssFallback />}
        />
      </Suspense>
    ),
    [createScene],
  )

  return (
    <HeroBackground
      variant="particles"
      layerClassName="hero-particles-layer pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
      webglFallback={webglFallback}
      cssFallback={<ParticlesCssFallback />}
    />
  )
}
