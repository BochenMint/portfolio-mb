export type HeroVariant = 'retro' | 'type' | 'orbit' | 'particles' | 'glass'

export const HERO_VARIANT_STORAGE_KEY = 'portfolio-mb-hero-variant'

/** CSS-first premium glass — stable default without noisy WebGL driver warnings. */
export const DEFAULT_HERO_VARIANT: HeroVariant = 'glass'

const VALID: HeroVariant[] = ['retro', 'type', 'orbit', 'particles', 'glass']

export function isHeroVariant(value: string | null | undefined): value is HeroVariant {
  return VALID.includes(value as HeroVariant)
}

export function parseHeroVariantFromQuery(search: string): HeroVariant | null {
  const params = new URLSearchParams(search)
  const raw = params.get('hero')
  return isHeroVariant(raw) ? raw : null
}

export function readStoredHeroVariant(): HeroVariant | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(HERO_VARIANT_STORAGE_KEY)
    return isHeroVariant(raw) ? raw : null
  } catch {
    return null
  }
}

export function persistHeroVariant(variant: HeroVariant) {
  try {
    localStorage.setItem(HERO_VARIANT_STORAGE_KEY, variant)
  } catch {
    /* private mode / quota */
  }
}

export function syncHeroQueryParam(variant: HeroVariant) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  url.searchParams.set('hero', variant)
  window.history.replaceState({}, '', url.toString())
}

export const HERO_VARIANT_LABELS: Record<HeroVariant, string> = {
  retro: 'Retro',
  type: 'Type',
  orbit: 'Orbit',
  particles: 'Particles',
  glass: 'Glass',
}
