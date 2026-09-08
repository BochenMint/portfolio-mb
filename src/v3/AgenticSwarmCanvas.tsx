import { lazy, Suspense, useCallback, type ImgHTMLAttributes } from 'react'
import { useCoarsePointer } from '../hooks/useCoarsePointer'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useWebGLCapable } from '../hooks/useWebGLCapable'

const HeroWebGLCanvas = lazy(() =>
  import('../components/hero/HeroWebGLCanvas').then((m) => ({ default: m.HeroWebGLCanvas })),
)

type AgenticSwarmCanvasProps = {
  className?: string
  imgProps: ImgHTMLAttributes<HTMLImageElement>
}

/**
 * Live replacement for the Agentic OS static hero image — a real-time
 * curl-noise particle swarm (see agenticSwarmScene.ts) that reuses the exact
 * look of the offline pre-rendered art. Falls back to the static <img> on
 * reduced motion, coarse/touch pointers, or if WebGL init fails.
 */
export function AgenticSwarmCanvas({ className = '', imgProps }: AgenticSwarmCanvasProps) {
  const reduced = useReducedMotion()
  const coarse = useCoarsePointer()
  const { capable } = useWebGLCapable()

  const createScene = useCallback(
    (canvas: HTMLCanvasElement) =>
      import('./agenticSwarmScene').then((m) =>
        m.createAgenticSwarmScene(canvas, { reducedMotion: reduced, lowPower: coarse }),
      ),
    [reduced, coarse],
  )

  const fallbackImg = <img alt="" {...imgProps} />

  if (!capable) {
    return fallbackImg
  }

  return (
    <Suspense fallback={fallbackImg}>
      <HeroWebGLCanvas
        className={className}
        createScene={createScene}
        fallback={fallbackImg}
        pauseWhenOffscreen
      />
    </Suspense>
  )
}
