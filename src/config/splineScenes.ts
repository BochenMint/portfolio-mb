import type { HeroVariant } from '../lib/heroVariant'

/**
 * Publiczne URL po Publish w Spline (Export → Publish).
 * Wklej w `.env` — bez edycji kodu:
 *
 *   VITE_SPLINE_RETRO_URL=https://prod.spline.design/...
 *   VITE_SPLINE_TYPE_URL=https://prod.spline.design/...
 *   VITE_SPLINE_ORBIT_URL=https://prod.spline.design/...
 *
 * Pliki `.spline` NIE działają w przeglądarce.
 */
const env = import.meta.env

export const SPLINE_SCENE_URLS: Record<HeroVariant, string | undefined> = {
  retro: normalizeSplineUrl(env.VITE_SPLINE_RETRO_URL),
  type: normalizeSplineUrl(env.VITE_SPLINE_TYPE_URL),
  orbit: normalizeSplineUrl(env.VITE_SPLINE_ORBIT_URL),
}

export const SPLINE_SOURCE_FILES: Record<HeroVariant, string> = {
  retro: 'retrofuturism_bg_animation.spline',
  type: 'distorting_typography.spline',
  orbit: 'rotating_interactive_hero_section.spline',
}

function normalizeSplineUrl(raw: string | undefined): string | undefined {
  const url = raw?.trim()
  return url && url.startsWith('http') ? url : undefined
}

export function getSplineSceneUrl(variant: HeroVariant): string | undefined {
  return SPLINE_SCENE_URLS[variant]
}
