import { useLocale } from '../i18n/context'
import { HeroObject } from './HeroObject'
import { LiquidChrome } from './LiquidChrome'
import { Arrow, Em, LinkButton } from './primitives'

export function Hero() {
  const { t: c, content } = useLocale()
  const site = content.site
  const ctaHref = site.calendly || '#kontakt'
  const meta = [site.responseTime, site.location, c.hero.projectsFromLabel(site.minBudget)]

  return (
    <section className="studio-bg relative overflow-hidden px-5 pt-32 pb-16 md:px-10 md:pt-40 md:pb-24">
      {/* Horizon hairline behind the object */}
      <div aria-hidden className="hairline absolute top-[58%] right-0 left-0 opacity-40" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <div className="relative z-10">
          <p data-hero-fade className="eyebrow">
            {c.hero.eyebrow}
          </p>

          {/* 15ch, not 14: the closing line measures 641px against a 636px
              box at 14ch, so it used to break onto a fourth line by 5px. */}
          <h1 className="mt-6 max-w-[15ch] text-[clamp(2.5rem,5.2vw,4.75rem)] leading-[1.02] font-semibold">
            <LiquidChrome>
              <span data-hero-line className="chrome-text inline-block">
                {c.hero.h1a} {c.hero.h1b}
              </span>{' '}
              <span data-hero-line className="inline-block text-silver-2">
                {c.hero.h1cPrefix} <Em>{c.hero.h1cEm}</Em>
              </span>
            </LiquidChrome>
          </h1>

          <p
            data-hero-fade
            className="mt-8 max-w-xl text-base leading-relaxed text-silver-2 md:text-lg"
          >
            {c.hero.lead}
          </p>

          <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-3">
            <LinkButton href={ctaHref} external={!!site.calendly} size="lg">
              {c.hero.ctaPrimary}
              <Arrow />
            </LinkButton>
            <LinkButton href="#realizacje" variant="ghost" size="lg">
              {c.hero.ctaSecondary}
            </LinkButton>
          </div>

          <ul data-hero-fade className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {meta.map((m) => (
              <li key={m} className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
                {m}
              </li>
            ))}
          </ul>
        </div>

        {/* Chrome object */}
        <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[-20%] rounded-full opacity-60 blur-3xl"
            style={{
              background:
                'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.14), rgba(255,255,255,0.03) 40%, transparent 65%)',
            }}
          />
          <HeroObject />
        </div>
      </div>

      {/* Stats */}
      <div data-stats className="relative mx-auto mt-16 max-w-7xl md:mt-24">
        <div className="hairline" />
        <ul className="grid grid-cols-2 gap-x-6 gap-y-8 py-8 md:grid-cols-4">
          {c.hero.stats.map((s) => (
            <li key={s.label} data-stat>
              <p className="chrome-text font-display text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                {s.value}
              </p>
              <p className="mt-2 text-[13px] text-muted">{s.label}</p>
            </li>
          ))}
        </ul>
        <div className="hairline" />
      </div>
    </section>
  )
}
