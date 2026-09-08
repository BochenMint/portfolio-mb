import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_HERO_VARIANT,
  parseHeroVariantFromQuery,
  persistHeroVariant,
  syncHeroQueryParam,
  type HeroVariant,
} from '../lib/heroVariant'

function resolveInitialVariant(): HeroVariant {
  if (typeof window === 'undefined') return DEFAULT_HERO_VARIANT
  const fromQuery = parseHeroVariantFromQuery(window.location.search)
  if (fromQuery) return fromQuery
  return DEFAULT_HERO_VARIANT
}

export function useHeroVariant() {
  const [variant, setVariantState] = useState<HeroVariant>(resolveInitialVariant)

  useEffect(() => {
    const fromQuery = parseHeroVariantFromQuery(window.location.search)
    if (!fromQuery) return

    const frame = window.requestAnimationFrame(() => {
      setVariantState(fromQuery)
      if (!import.meta.env.PROD) persistHeroVariant(fromQuery)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  const setVariant = useCallback((next: HeroVariant) => {
    setVariantState(next)
    if (!import.meta.env.PROD) persistHeroVariant(next)
    syncHeroQueryParam(next)
  }, [])

  return [variant, setVariant] as const
}

/** Jawny lab tylko przez ?hero= — zwykły dev preview ma wyglądać produkcyjnie. */
export function isHeroLabMode(): boolean {
  if (typeof window === 'undefined') return false
  return parseHeroVariantFromQuery(window.location.search) !== null
}
