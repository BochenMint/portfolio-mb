import { useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'
import { warnWebGL } from '../webgl/warnWebGL'

function queryFinePointer() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

export function useWebGLCapable() {
  const reduced = useReducedMotion()
  const [fine, setFine] = useState(queryFinePointer)
  const capable = fine && !reduced

  useEffect(() => {
    if (import.meta.env.DEV && !capable) {
      if (reduced) warnWebGL('useWebGLCapable', 'prefers-reduced-motion — CSS fallback only')
      else if (!fine) warnWebGL('useWebGLCapable', 'no fine pointer / hover — CSS fallback only')
    }
  }, [capable, reduced, fine])

  useEffect(() => {
    const pointerMq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const onChange = () => setFine(pointerMq.matches)
    pointerMq.addEventListener('change', onChange)
    return () => pointerMq.removeEventListener('change', onChange)
  }, [])

  return { capable, reduced }
}
