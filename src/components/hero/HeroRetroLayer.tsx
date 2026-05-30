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
      <div className="hero-retro-gradient absolute inset-0" />
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
          className="absolute inset-0"
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
