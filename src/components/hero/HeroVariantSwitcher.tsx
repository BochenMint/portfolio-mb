import { HERO_VARIANT_LABELS, type HeroVariant } from '../../lib/heroVariant'

const ORDER: HeroVariant[] = ['retro', 'type', 'orbit']

type HeroVariantSwitcherProps = {
  variant: HeroVariant
  onChange: (variant: HeroVariant) => void
}

export function HeroVariantSwitcher({ variant, onChange }: HeroVariantSwitcherProps) {
  return (
    <div
      className="hero-variant-switcher pointer-events-auto absolute bottom-6 left-6 z-30 flex items-center gap-1 rounded-full border border-[var(--color-paper)]/15 bg-[var(--color-ink)]/55 p-1 backdrop-blur-md md:bottom-8 md:left-10"
      role="group"
      aria-label="Porównanie wariantów hero"
    >
      {ORDER.map((key) => {
        const active = variant === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={active}
            className={`hero-variant-pill rounded-full px-3 py-1.5 text-[10px] font-medium tracking-[0.14em] uppercase transition-colors duration-200 ${
              active
                ? 'bg-[var(--color-paper)] text-[var(--color-ink)]'
                : 'text-[var(--color-paper)]/55 hover:text-[var(--color-paper)]'
            }`}
          >
            {HERO_VARIANT_LABELS[key]}
          </button>
        )
      })}
    </div>
  )
}
