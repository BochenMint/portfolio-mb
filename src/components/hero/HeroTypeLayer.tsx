import { lazy, Suspense, useCallback, useMemo } from 'react'
import { site } from '../../data/content'
import { getSplineSceneUrl } from '../../config/splineScenes'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { SplineEmbed } from '../SplineEmbed'

const HeroWebGLCanvas = lazy(() =>
  import('./HeroWebGLCanvas').then((m) => ({ default: m.HeroWebGLCanvas })),
)

function TypeCssFallback() {
  return <div className="hero-type-ambient absolute inset-0" aria-hidden />
}

export function HeroTypeLayer() {
  const reduced = useReducedMotion()
  const sceneUrl = getSplineSceneUrl('type')
  const lines = site.headline

  const createScene = useCallback(
    (canvas: HTMLCanvasElement) =>
      import('../../webgl/hero/createTypeHeroScene').then((m) =>
        m.createTypeHeroScene(canvas, lines, { reducedMotion: reduced }),
      ),
    [lines, reduced],
  )

  const webglFallback = useMemo(
    () => (
      <Suspense fallback={<TypeCssFallback />}>
        <HeroWebGLCanvas
          className="hero-type-webgl absolute inset-0"
          createScene={createScene}
          fallback={<TypeCssFallback />}
        />
      </Suspense>
    ),
    [createScene, reduced],
  )

  return (
    <div className="hero-type-layer pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <SplineEmbed sceneUrl={sceneUrl} className="absolute inset-0" fallback={webglFallback} />
    </div>
  )
}
