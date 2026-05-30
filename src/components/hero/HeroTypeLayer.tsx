import { lazy, Suspense, useCallback, useMemo } from 'react'
import { site } from '../../data/content'
import { useCoarsePointer } from '../../hooks/useCoarsePointer'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { HeroBackground } from './HeroBackground'

const HeroWebGLCanvas = lazy(() =>
  import('./HeroWebGLCanvas').then((m) => ({ default: m.HeroWebGLCanvas })),
)

function TypeCssFallback() {
  return <div className="hero-type-ambient absolute inset-0" aria-hidden />
}

export function HeroTypeLayer() {
  const reduced = useReducedMotion()
  const coarse = useCoarsePointer()
  const lines = site.headline

  const createScene = useCallback(
    (canvas: HTMLCanvasElement) =>
      import('../../webgl/hero/createTypeHeroScene').then((m) =>
        m.createTypeHeroScene(canvas, lines, { reducedMotion: reduced, lowPower: coarse }),
      ),
    [lines, reduced, coarse],
  )

  const webglFallback = useMemo(
    () => (
      <Suspense fallback={<TypeCssFallback />}>
        <HeroWebGLCanvas
          className="hero-type-webgl absolute inset-0 max-md:opacity-40"
          createScene={createScene}
          fallback={<TypeCssFallback />}
        />
      </Suspense>
    ),
    [createScene],
  )

  return (
    <HeroBackground
      variant="type"
      layerClassName="hero-type-layer pointer-events-none absolute inset-0 z-0 overflow-hidden"
      webglFallback={webglFallback}
      cssFallback={<TypeCssFallback />}
    />
  )
}
