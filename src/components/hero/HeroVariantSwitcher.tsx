import { HERO_VARIANT_LABELS, type HeroVariant } from '../../lib/heroVariant'

const ORDER: HeroVariant[] = ['orbit', 'glass', 'particles', 'retro', 'type']

type HeroVariantSwitcherProps = {
  variant: HeroVariant
  onChange: (variant: HeroVariant) => void
}

/** Przełącznik scen tylko dla trybu lab: DEV albo jawny parametr ?hero=. */
export function HeroVariantSwitcher({ variant, onChange }: HeroVariantSwitcherProps) {
  return (
    <div
      className="hero-variant-switcher pointer-events-auto absolute bottom-6 left-6 z-30 flex flex-col items-start gap-1.5 md:bottom-8 md:left-10"
      role="group"
      aria-label="Wybierz scenę hero"
    >
      <span className="font-mono text-[9px] tracking-[0.18em] text-[var(--color-paper)]/35 uppercase select-none">
        Scena
      </span>
      <div className="flex max-w-[88vw] flex-wrap items-center gap-1 rounded-2xl border border-[var(--color-paper)]/12 bg-[var(--color-ink)]/65 p-1 backdrop-blur-md">
        {ORDER.map((key) => {
          const active = variant === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              aria-pressed={active}
              className={`hero-variant-pill rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase transition-all duration-200 ${
                active
                  ? 'bg-[var(--color-accent)] text-[var(--color-on-accent,#080807)] shadow-[0_0_12px_rgba(245,165,36,0.35)]'
                  : 'text-[var(--color-paper)]/45 hover:text-[var(--color-paper)]/80'
              }`}
            >
              {HERO_VARIANT_LABELS[key]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
