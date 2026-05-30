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
  const fromQuery = parseHeroVariantFromQuery(window.location.search)
  if (fromQuery) return fromQuery
  if (import.meta.env.PROD) return DEFAULT_HERO_VARIANT
  return readStoredHeroVariant() ?? DEFAULT_HERO_VARIANT
}

export function useHeroVariant() {
  const [variant, setVariantState] = useState<HeroVariant>(resolveInitialVariant)

  useEffect(() => {
    const fromQuery = parseHeroVariantFromQuery(window.location.search)
    if (fromQuery) {
      setVariantState(fromQuery)
      if (!import.meta.env.PROD) persistHeroVariant(fromQuery)
    }
  }, [])

  const setVariant = useCallback((next: HeroVariant) => {
    setVariantState(next)
    if (!import.meta.env.PROD) persistHeroVariant(next)
    syncHeroQueryParam(next)
  }, [])

  return [variant, setVariant] as const
}

/** DEV lub jawny ?hero= — pokazuj przełącznik / banner lab */
export function isHeroLabMode(): boolean {
  if (import.meta.env.DEV) return true
  if (typeof window === 'undefined') return false
  return parseHeroVariantFromQuery(window.location.search) !== null
}
