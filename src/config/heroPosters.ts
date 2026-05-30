import type { HeroVariant } from '../lib/heroVariant'

/** Statyczne postery (po `npm run capture:hero-variants` → public/hero/posters). */
export const HERO_POSTER_URLS: Record<HeroVariant, string> = {
  retro: '/hero/posters/hero-retro-1440.webp',
  type: '/hero/posters/hero-type-1440.webp',
  orbit: '/hero/posters/hero-orbit-1440.webp',
}

export function getHeroPosterUrl(variant: HeroVariant): string {
  return HERO_POSTER_URLS[variant]
}
