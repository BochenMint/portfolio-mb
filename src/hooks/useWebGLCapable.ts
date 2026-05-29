import { useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'
import { warnWebGL } from '../webgl/warnWebGL'

function queryCapable(reduced: boolean) {
  if (typeof window === 'undefined') return false
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  return fine && !reduced
}

export function useWebGLCapable() {
  const reduced = useReducedMotion()
  const [capable, setCapable] = useState(() => queryCapable(reduced))

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const next = fine && !reduced
    setCapable(next)

    if (import.meta.env.DEV && !next) {
      if (reduced) warnWebGL('useWebGLCapable', 'prefers-reduced-motion — CSS fallback only')
      else if (!fine) warnWebGL('useWebGLCapable', 'no fine pointer / hover — CSS fallback only')
    }

    const pointerMq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setCapable(queryCapable(reducedMq.matches))

    pointerMq.addEventListener('change', sync)
    reducedMq.addEventListener('change', sync)
    return () => {
      pointerMq.removeEventListener('change', sync)
      reducedMq.removeEventListener('change', sync)
    }
  }, [reduced])

  return { capable, reduced }
}
