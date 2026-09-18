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
    <section className="studio-bg chrome-hero relative overflow-hidden">
      {/* CSS-only graphite dusk. Dark theme only — see chrome.css. */}
      <div aria-hidden className="chrome-hero-ambient">
        <div className="chrome-hero-ambient__shift" />
      </div>

      {/* Horizon hairline behind the object */}
      <div aria-hidden className="hairline chrome-hero-horizon absolute right-0 left-0 opacity-40" />

      <div className="chrome-hero-stage relative mx-auto w-full max-w-7xl">
        <div className="chrome-hero-intro relative z-10">
          <p data-hero-fade className="eyebrow">
            {c.hero.eyebrow}
          </p>

          {/* 15ch, not 14: the closing line measures 641px against a 636px
              box at 14ch, so it used to break onto a fourth line by 5px. */}
          <h1 className="mt-5 max-w-[15ch] text-[clamp(2.5rem,5.2vw,4.75rem)] leading-[1.02] font-bold tracking-[-0.035em] md:mt-6">
            <LiquidChrome>
              <span data-hero-line className="chrome-text inline-block">
                {c.hero.h1a} {c.hero.h1b}
              </span>{' '}
              <span data-hero-line className="inline-block text-silver-2">
                {c.hero.h1cPrefix} <Em>{c.hero.h1cEm}</Em>
              </span>
            </LiquidChrome>
          </h1>
        </div>

        {/* Chrome object. On desktop it reaches back over the gap and out past
            the grid on the right, so the car spans the whole column rather
            than the 0.85fr the text layout wants. On mobile it sits between
            the headline and the lead so the signature is in the first screen,
            not under the fold. */}
        <div className="chrome-hero-object relative mx-auto w-full max-w-[560px] lg:-mt-10 lg:mr-[-16%] lg:-ml-56 lg:w-auto lg:max-w-none">
          <div
            aria-hidden
            className="chrome-hero-object__bloom pointer-events-none absolute inset-[-20%] rounded-full opacity-60 blur-3xl"
          />
          <HeroObject />
        </div>

        <div className="chrome-hero-actions relative z-10">
          <p
            data-hero-fade
            className="mt-0 max-w-xl text-base leading-relaxed text-silver-2 md:mt-8 md:text-lg"
          >
            {c.hero.lead}
          </p>

          <div data-hero-fade className="chrome-hero-cta-row flex flex-wrap items-center gap-3">
            <LinkButton
              href={ctaHref}
              external={!!site.calendly}
              size="lg"
              variant="accent"
              data-hero-cta
            >
              {c.hero.ctaPrimary}
              <Arrow />
            </LinkButton>
            <LinkButton href="#realizacje" variant="ghost" size="lg">
              {c.hero.ctaSecondary}
            </LinkButton>
          </div>

          <ul data-hero-fade className="mt-6 flex flex-wrap gap-x-6 gap-y-2 md:mt-8">
            {meta.map((m) => (
              <li key={m} className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Stats */}
      <div data-stats className="relative mx-auto mt-16 max-w-7xl md:mt-24">
        <div className="hairline" />
        <ul className="grid grid-cols-2 gap-x-6 gap-y-8 py-8 md:grid-cols-4">
          {c.hero.stats.map((s) => (
            <li key={s.label} data-stat>
              <p className="chrome-text font-display text-4xl font-bold tracking-[-0.04em] md:text-5xl">
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
