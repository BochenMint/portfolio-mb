import { lazy, Suspense, useCallback, useMemo } from 'react'
import { getSplineSceneUrl } from '../../config/splineScenes'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { SplineEmbed } from '../SplineEmbed'

const HeroWebGLCanvas = lazy(() =>
  import('./HeroWebGLCanvas').then((m) => ({ default: m.HeroWebGLCanvas })),
)

function RetroCssFallback() {
  return (
    <>
      <div className="hero-retro-gradient absolute inset-0" />
      <div className="hero-retro-vignette absolute inset-0" />
      <div className="hero-retro-chroma hero-retro-chroma--l absolute inset-0" />
      <div className="hero-retro-chroma hero-retro-chroma--r absolute inset-0" />
      <div className="hero-retro-grain-fallback absolute inset-0" />
    </>
  )
}

export function HeroRetroLayer() {
  const reduced = useReducedMotion()
  const sceneUrl = getSplineSceneUrl('retro')

  const createScene = useCallback(
    (canvas: HTMLCanvasElement) =>
      import('../../webgl/hero/createRetroHeroScene').then((m) =>
        m.createRetroHeroScene(canvas, { reducedMotion: reduced }),
      ),
    [reduced],
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
    [createScene, reduced],
  )

  return (
    <div className="hero-retro-layer pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <SplineEmbed sceneUrl={sceneUrl} className="absolute inset-0" fallback={webglFallback} />
      <div className="hero-retro-vignette pointer-events-none absolute inset-0 z-[2] mix-blend-multiply" />
    </div>
  )
}
