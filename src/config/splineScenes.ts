import type { HeroVariant } from '../lib/heroVariant'

/**
 * Po Publish w Spline (Export → Publish) wklej publiczny URL sceny.
 * Pliki .spline NIE działają w przeglądarce — tylko opublikowany link.
 *
 * 1. Otwórz plik w spline.design
 * 2. Export → Publish → skopiuj URL (prod.spline.design/…)
 * 3. Wklej poniżej dla właściwego wariantu
 */
export const SPLINE_SCENE_URLS: Record<HeroVariant, string | undefined> = {
  retro: undefined,
  type: undefined,
  orbit: undefined,
}

export const SPLINE_SOURCE_FILES: Record<HeroVariant, string> = {
  retro: 'retrofuturism_bg_animation.spline',
  type: 'distorting_typography.spline',
  orbit: 'rotating_interactive_hero_section.spline',
}

export function getSplineSceneUrl(variant: HeroVariant): string | undefined {
  const url = SPLINE_SCENE_URLS[variant]?.trim()
  return url && url.startsWith('http') ? url : undefined
}
