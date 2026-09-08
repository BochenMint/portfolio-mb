import { useLocale } from '../i18n/context'
import { ChromeCard, LinkButton, SectionHeader } from './primitives'

export function Pricing() {
  const { t: c, content } = useLocale()
  const { pricing, site } = content
  const ctaHref = site.calendly || '#kontakt'

  return (
    <section id="inwestycja" className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow={c.pricing.eyebrow} title={c.pricing.title} lead={c.pricing.lead} />

        <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:items-start">
          {pricing.map((tier) => {
            const isLight = !!tier.highlight
            return (
              <ChromeCard
                key={tier.name}
                as="article"
                data-card
                tone={isLight ? 'light' : 'dark'}
                className={`flex flex-col p-8 md:p-10 ${isLight ? 'lg:-translate-y-3' : ''}`}
              >
                <p className={`eyebrow ${isLight ? '!text-ink/60' : ''}`}>{tier.name}</p>
                <p
                  className={`mt-5 font-display text-3xl font-semibold tracking-[-0.02em] ${
                    isLight ? 'text-ink' : 'chrome-text'
                  }`}
                >
                  {tier.from}
                </p>
                <p className={`mt-4 text-sm leading-relaxed ${isLight ? 'text-ink/70' : 'text-silver-2'}`}>
                  {tier.description}
                </p>

                {isLight ? <div aria-hidden className="mt-8 border-t border-ink/15" /> : <div aria-hidden className="hairline mt-8" />}
                <div className="flex-1 pt-6">
                  <ul className="space-y-3">
                    {tier.includes.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span
                          className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br ${
                            isLight ? 'from-ink to-ink/50' : 'from-white to-silver-2'
                          }`}
                        />
                        <span className={`text-sm leading-relaxed ${isLight ? 'text-ink/80' : 'text-silver'}`}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-10">
                  {isLight ? (
                    <a
                      href={ctaHref}
                      {...(site.calendly ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="ghost-btn w-full border-ink/30 px-6 py-3 text-sm !text-ink hover:bg-ink/5"
                    >
                      {c.pricing.cta}
                    </a>
                  ) : (
                    <LinkButton
                      href={ctaHref}
                      external={!!site.calendly}
                      variant="ghost"
                      className="w-full"
                    >
                      {c.pricing.cta}
                    </LinkButton>
                  )}
                </div>
              </ChromeCard>
            )
          })}
        </div>

        <p className="mt-10 text-xs text-muted">{c.pricing.note}</p>
      </div>
    </section>
  )
}
