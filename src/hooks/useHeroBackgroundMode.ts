import { useCoarsePointer } from './useCoarsePointer'
import { useWebGLCapable } from './useWebGLCapable'

export type HeroBackgroundMode = 'spline' | 'webgl' | 'poster' | 'css'

/**
 * Spline tylko na desktop z URL; mobile → poster; brak WebGL → CSS w warstwie.
 */
export function useHeroBackgroundMode(hasSplineUrl: boolean): HeroBackgroundMode {
  const coarse = useCoarsePointer()
  const { capable } = useWebGLCapable()

  if (hasSplineUrl && !coarse) return 'spline'
  if (coarse) return 'poster'
  if (capable) return 'webgl'
  return 'css'
}
