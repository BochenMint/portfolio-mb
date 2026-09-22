import { useLocale } from '../i18n/context'
import { ChromeCard, LinkButton, SectionHeader } from './primitives'

/** Typesets a "from" price so it only ever breaks after the "od" / "from":
 *  the amount and its currency stay together ("od 2 000 / PLN" was what a
 *  narrow card did before), and a recurring period ("/ mies.") becomes a
 *  smaller unit that may drop below the amount as one piece. */
function PriceFrom({ value, muted }: { value: string; muted: string }) {
  const cut = value.lastIndexOf(' / ')
  const main = cut < 0 ? value : value.slice(0, cut)
  const lead = main.indexOf(' ')
  return (
    <>
      {main.slice(0, lead + 1)}
      <span className="whitespace-nowrap">{main.slice(lead + 1)}</span>
      {cut >= 0 && (
        <>
          {' '}
          {/* Own fill: the dark cards set the price in clip-text chrome, which a
              child would otherwise inherit as a transparent fill. */}
          <span
            className={`inline-block whitespace-nowrap text-base leading-none font-medium tracking-normal [-webkit-text-fill-color:currentColor] ${muted}`}
          >
            {value.slice(cut + 1)}
          </span>
        </>
      )}
    </>
  )
}

export function Pricing() {
  const { t: c, content } = useLocale()
  const { pricing, site } = content
  const ctaHref = site.calendly || '#kontakt'

  return (
    <section id="inwestycja" className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow={c.pricing.eyebrow} title={c.pricing.title} lead={c.pricing.lead} />

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {pricing.map((tier) => {
            const isLight = !!tier.highlight
            return (
              <ChromeCard
                key={tier.name}
                as="article"
                data-card
                tone={isLight ? 'light' : 'dark'}
                className={`flex flex-col p-8 md:p-10 ${isLight ? 'xl:-translate-y-3' : ''}`}
              >
                <p className={`eyebrow ${isLight ? '!text-ink/60' : ''}`}>{tier.name}</p>
                <p
                  className={`mt-5 font-display text-3xl font-semibold tracking-[-0.02em] ${
                    isLight ? 'text-ink' : 'chrome-text'
                  }`}
                >
                  <PriceFrom value={tier.from} muted={isLight ? 'text-ink/70' : 'text-silver-2'} />
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
