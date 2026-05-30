import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_HERO_VARIANT,
  parseHeroVariantFromQuery,
  persistHeroVariant,
  readStoredHeroVariant,
  syncHeroQueryParam,
  type HeroVariant,
} from '../lib/heroVariant'

function resolveInitialVariant(): HeroVariant {
  if (typeof window === 'undefined') return DEFAULT_HERO_VARIANT
  return (
    parseHeroVariantFromQuery(window.location.search) ??
    readStoredHeroVariant() ??
    DEFAULT_HERO_VARIANT
  )
}

export function useHeroVariant() {
  const [variant, setVariantState] = useState<HeroVariant>(resolveInitialVariant)

  useEffect(() => {
    const fromQuery = parseHeroVariantFromQuery(window.location.search)
    if (fromQuery) {
      setVariantState(fromQuery)
      persistHeroVariant(fromQuery)
    }
  }, [])

  const setVariant = useCallback((next: HeroVariant) => {
    setVariantState(next)
    persistHeroVariant(next)
    syncHeroQueryParam(next)
  }, [])

  return [variant, setVariant] as const
}
