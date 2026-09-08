import { useEffect, useState } from 'react'

/** True on touch-first / narrow viewports — simplify hero motion. */
export function useCoarsePointer() {
  const [coarse, setCoarse] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
      : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    const onChange = () => {
      setCoarse(mq.matches || window.innerWidth < 768)
    }
    mq.addEventListener('change', onChange)
    window.addEventListener('resize', onChange)
    return () => {
      mq.removeEventListener('change', onChange)
      window.removeEventListener('resize', onChange)
    }
  }, [])

  return coarse
}
