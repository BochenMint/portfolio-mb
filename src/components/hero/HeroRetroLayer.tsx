import { lazy, Suspense, useCallback, useMemo } from 'react'
import { useCoarsePointer } from '../../hooks/useCoarsePointer'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { HeroBackground } from './HeroBackground'

const HeroWebGLCanvas = lazy(() =>
  import('./HeroWebGLCanvas').then((m) => ({ default: m.HeroWebGLCanvas })),
)

function RetroCssFallback() {
  return (
    <>
      {/* Sky gradient: indigo → magenta → amber */}
      <div className="hero-retro-gradient absolute inset-0" />
      {/* Synthwave sun: radial gradient disc with horizontal scan slits */}
      <div className="hero-retro-sun absolute" aria-hidden />
      {/* Perspective grid floor */}
      <div className="hero-retro-grid absolute inset-x-0 bottom-0" aria-hidden />
      {/* Chromatic aberration leaks (existing) */}
      <div className="hero-retro-chroma hero-retro-chroma--l absolute inset-0" />
      <div className="hero-retro-chroma hero-retro-chroma--r absolute inset-0" />
      <div className="hero-retro-grain-fallback absolute inset-0" />
    </>
  )
}

export function HeroRetroLayer() {
  const reduced = useReducedMotion()
  const coarse = useCoarsePointer()

  const createScene = useCallback(
    (canvas: HTMLCanvasElement) =>
      import('../../webgl/hero/createRetroHeroScene').then((m) =>
        m.createRetroHeroScene(canvas, { reducedMotion: reduced, lowPower: coarse }),
      ),
    [reduced, coarse],
  )

  const webglFallback = useMemo(
    () => (
      <Suspense fallback={<RetroCssFallback />}>
        <HeroWebGLCanvas
          className="h-full w-full"
          createScene={createScene}
          fallback={<RetroCssFallback />}
        />
      </Suspense>
    ),
    [createScene],
  )

  return (
    <>
      <HeroBackground
        variant="retro"
        layerClassName="hero-retro-layer pointer-events-none absolute inset-0 z-0 overflow-hidden"
        webglFallback={webglFallback}
        cssFallback={<RetroCssFallback />}
      />
      <div
        className="hero-retro-vignette pointer-events-none absolute inset-0 z-[1] mix-blend-multiply"
        aria-hidden
      />
    </>
  )
}
