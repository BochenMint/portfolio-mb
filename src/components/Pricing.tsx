import { pricing, site } from '../data/content'
import { MagneticButton } from './MagneticButton'

export function Pricing() {
  const ctaHref = site.calendly || '#kontakt'

  return (
    <section id="inwestycja" data-section className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <p data-reveal className="text-mint text-xs font-semibold tracking-[0.3em] uppercase">
          Inwestycja
        </p>
        <h2 data-reveal className="font-display mt-4 text-4xl font-bold md:text-5xl">
          Transparentne zakresy.{' '}
          <span className="text-muted font-normal">Bez stawki godzinowej na pierwszym ekranie.</span>
        </h2>
        <p data-reveal className="text-muted mt-4 max-w-2xl">
          Projekty poniżej <strong className="text-cream">{site.minBudget}</strong> nie przyjmuję —
          chroni to jakość i Twój ROI.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pricing.map((tier) => (
            <article
              key={tier.name}
              data-reveal
              className={`flex flex-col rounded-3xl p-8 ${
                tier.highlight
                  ? 'relative border-2 border-mint/50 bg-gradient-to-b from-mint/10 to-transparent'
                  : 'glass'
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-6 rounded-full bg-mint px-3 py-0.5 text-[10px] font-bold text-ink uppercase">
                  Najczęściej wybierany
                </span>
              )}
              <h3 className="font-display text-2xl font-bold">{tier.name}</h3>
              <p className="text-mint mt-2 font-semibold">{tier.from}</p>
              <p className="text-muted mt-3 text-sm">{tier.description}</p>
              <ul className="mt-6 flex-1 space-y-2">
                {tier.includes.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-cream/80">
                    <span className="text-mint">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div data-reveal className="mt-10 text-center">
          <MagneticButton
            href={ctaHref}
            external={!!site.calendly}
            className="inline-flex rounded-full bg-cream px-8 py-3.5 text-sm font-bold text-ink"
          >
            Sprawdź dopasowanie na audycie →
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
