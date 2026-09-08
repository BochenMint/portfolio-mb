import { pricingPackages, sections, site } from '../../i18n/live'

export function PricingV3() {
  const ctaHref = site.calendly || '#kontakt'
  const isExternal = Boolean(site.calendly)

  return (
    <section id="cennik" className="mx-auto max-w-6xl px-5 py-24 md:py-32 md:px-8">
      <div className="mb-16">
        <p className="v3-label mb-4">
          {sections.pricing.num} / {sections.pricing.title}
        </p>
        <h2 className="v3-display text-[clamp(2rem,5vw,3.5rem)] text-balance mb-5">
          Widełki przed{' '}
          <em className="v3-serif-accent">rozmową</em>
        </h2>
        <p className="text-muted max-w-2xl text-base leading-relaxed">{sections.pricing.lead}</p>
      </div>

      <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-4">
        {pricingPackages.map((pkg, i) => (
          <article
            key={pkg.name}
            className={[
              'reveal flex flex-col border-[var(--v3-line)] px-0 py-8 md:px-6 md:py-10 xl:px-5',
              i !== 0 ? 'border-t md:border-t-0' : '',
              i % 2 === 1 ? 'md:border-l' : '',
              i >= 2 ? 'md:border-t xl:border-t-0' : '',
              i % 4 !== 0 ? 'xl:border-l' : '',
              pkg.featured
                ? 'md:-mx-px border-accent/55 md:border md:border-accent/55 bg-[color-mix(in_srgb,var(--color-accent)_4%,transparent)] xl:mx-0'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {pkg.featured && (
              <span className="v3-mono mb-5 inline-block text-[10px] uppercase tracking-widest text-accent">
                Najczęstszy start
              </span>
            )}

            <h3 className="font-grotesk text-xl font-semibold text-[var(--color-paper)] leading-snug">
              {pkg.name}
            </h3>

            <p className="v3-metric mt-4 text-[clamp(1.75rem,3.5vw,2.5rem)] leading-none text-accent">
              {pkg.range}
            </p>

            <p className="v3-mono mt-3 text-[11px] leading-relaxed text-muted uppercase tracking-wide">
              {pkg.qualifier}
            </p>

            <p className="text-muted mt-5 text-sm leading-relaxed">{pkg.bestFor}</p>

            <ul className="mt-6 flex flex-1 flex-col gap-2 border-t border-[var(--v3-line)] pt-6">
              {pkg.deliverables.map((item) => (
                <li key={item} className="v3-mono flex gap-2 text-[11.5px] leading-relaxed text-muted">
                  <span className="text-accent shrink-0">–</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 border-t border-[var(--v3-line)] pt-5 text-xs leading-relaxed text-muted">
              {pkg.proof}
            </p>

            {pkg.featured && (
              <a
                href={ctaHref}
                className="btn-accent mt-6 justify-center"
                {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {site.ctaPrimary}
                <span aria-hidden>→</span>
              </a>
            )}
          </article>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4 border-t border-[var(--v3-line)] pt-10 sm:flex-row sm:justify-center">
        <a href="#kontakt" className="btn-soft justify-center">
          Wyślij brief kwalifikacyjny
        </a>
        <a
          href={ctaHref}
          className="btn-accent justify-center"
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {site.ctaPrimary}
          <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  )
}
