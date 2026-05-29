import { useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

export function useWebGLCapable() {
  const reduced = useReducedMotion()
  const [capable, setCapable] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    setCapable(fine && !reduced)
  }, [reduced])

  return { capable, reduced }
}
