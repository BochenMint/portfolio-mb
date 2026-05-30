import { DEFAULT_HERO_VARIANT, HERO_VARIANT_LABELS, type HeroVariant } from '../../lib/heroVariant'

type HeroLabBannerProps = {
  variant: HeroVariant
}

export function HeroLabBanner({ variant }: HeroLabBannerProps) {
  if (!import.meta.env.DEV || variant === DEFAULT_HERO_VARIANT) return null

  return (
    <div
      className="hero-lab-banner pointer-events-none absolute top-28 right-6 z-30 max-w-[14rem] rounded-lg border border-amber-400/35 bg-amber-950/75 px-3 py-2 text-[10px] leading-snug tracking-wide text-amber-100/90 uppercase md:top-32 md:right-10"
      role="status"
    >
      Podgląd: {HERO_VARIANT_LABELS[variant]} — nie do wdrożenia
    </div>
  )
}
