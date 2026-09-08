import { proofProducts, results, site } from '../i18n/live'

import { useHeroTypeMotion } from '../hooks/useHeroTypeMotion'

import { isHeroLabMode, useHeroVariant } from '../hooks/useHeroVariant'

import { HeroDefaultHeadline } from './hero/HeroDefaultHeadline'

import { HeroLabBanner } from './hero/HeroLabBanner'

import { HeroOrbitLayer } from './hero/HeroOrbitLayer'

import { HeroParticlesLayer } from './hero/HeroParticlesLayer'

import { HeroGlassLayer } from './hero/HeroGlassLayer'

import { HeroRetroLayer } from './hero/HeroRetroLayer'

import { HeroTypeHeadline } from './hero/HeroTypeHeadline'

import { HeroTypeLayer } from './hero/HeroTypeLayer'

import { HeroVariantSwitcher } from './hero/HeroVariantSwitcher'

import { MagneticButton } from './MagneticButton'

import { Portrait } from './Portrait'



type HeroProps = {

  /** When false, TYPE skew waits for intro curtain (matches useScrollAnimations). */

  animationsReady?: boolean

}



export function Hero({ animationsReady = true }: HeroProps) {

  const [variant, setVariant] = useHeroVariant()

  const ctaHref = site.calendly || '#contact'
  const labMode = isHeroLabMode()
  const liveProducts = proofProducts.filter((product) => product.live).slice(0, 3)
  const heroMetrics = results.slice(0, 3)



  useHeroTypeMotion(variant === 'type', animationsReady)



  const isOrbit = variant === 'orbit'

  const isType = variant === 'type'



  return (

    <section

      data-hero

      data-hero-variant={variant}

      className="premium-hero relative flex min-h-[100dvh] flex-col justify-end overflow-hidden border-b border-[var(--color-paper)]/12 pb-8 pt-24 md:pb-10 md:pt-28"

    >

      {variant === 'retro' ? <HeroRetroLayer /> : null}

      {variant === 'type' ? <HeroTypeLayer /> : null}

      {variant === 'orbit' ? <HeroOrbitLayer /> : null}

      {variant === 'particles' ? <HeroParticlesLayer /> : null}

      {variant === 'glass' ? <HeroGlassLayer /> : null}



      <div className="hero-content-scrim pointer-events-none absolute inset-0 z-[1]" aria-hidden />
      <div className="hero-premium-grid pointer-events-none absolute inset-0 z-[2]" aria-hidden />
      <div className="hero-premium-spotlight pointer-events-none absolute inset-0 z-[2]" aria-hidden />
      {labMode ? <HeroLabBanner variant={variant} /> : null}
      {labMode ? <HeroVariantSwitcher variant={variant} onChange={setVariant} /> : null}



      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] items-end gap-10 px-5 md:px-10 lg:grid-cols-[minmax(0,1.06fr)_minmax(360px,0.94fr)] lg:gap-12 lg:px-16">

        <div className="hero-content min-w-0">

          <div

            data-hero-fade

            className={`inline-flex max-w-full items-center gap-2 rounded-full border border-accent/25 bg-accent/[0.08] px-3 py-2 font-mono text-[10px] font-semibold tracking-[0.16em] text-[var(--color-accent)] uppercase shadow-[0_0_34px_rgba(245,165,36,0.12)] backdrop-blur-md md:text-xs ${isOrbit ? 'hero-orbit-kicker' : ''}`}

          >

            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_16px_rgba(245,165,36,0.8)]" aria-hidden />
            <span>{site.icpBadge}</span>

          </div>

          <p

            data-hero-fade

            className={`hero-text-muted mt-5 max-w-2xl text-xs font-medium tracking-[0.08em] uppercase md:text-sm ${isOrbit ? 'hero-orbit-role' : ''}`}

          >

            {site.role}

          </p>



          {isType ? (

            <HeroTypeHeadline lines={site.headline} />

          ) : (

            <HeroDefaultHeadline

              lines={site.headline}

              className={`hero-text-display max-w-[10ch] ${isOrbit ? 'hero-orbit-display tracking-[0.02em]' : ''}`}

            />

          )}



          <p

            data-hero-fade

            className="hero-text-body text-balance mt-7 max-w-2xl text-lg leading-relaxed md:mt-9 md:text-[1.35rem] md:leading-relaxed"

          >

            {site.subhead}

          </p>



          <p

            data-hero-fade

            className="hero-text-muted text-balance mt-4 max-w-2xl text-sm leading-relaxed md:text-base"

          >

            {site.valueProp}

          </p>



          <p data-hero-fade className="hero-text-faint mt-5 font-mono text-[11px] tracking-[0.12em] uppercase">

            {site.responseTime} · {site.location}

          </p>



          <div data-hero-fade className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:mt-11">

            <MagneticButton

              href={ctaHref}

              className="btn-accent premium-cta justify-center"

              external={Boolean(site.calendly)}

            >

              {site.ctaPrimary}

              <span aria-hidden>→</span>

            </MagneticButton>

            <a href="#work" className="btn-soft premium-secondary-cta justify-center border-[var(--color-paper)]/25 text-[var(--color-paper)]">

              {site.ctaSecondary}
              <span aria-hidden>↘</span>

            </a>

          </div>

          <div data-hero-fade className="mt-8 grid max-w-2xl gap-2 sm:grid-cols-3">
            {heroMetrics.map((metric) => (
              <div key={metric.value} className="hero-metric-card">
                <p className="font-headline text-2xl leading-none text-[var(--color-paper)] md:text-3xl">
                  {metric.value}
                </p>
                <p className="mt-2 text-[11px] leading-snug text-[var(--color-paper)]/58">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>

        </div>



        <aside

          data-hero-portrait

          className="hero-system-panel relative z-10 mx-auto w-full max-w-[560px] overflow-hidden border border-[var(--color-paper)]/14 bg-[rgba(12,11,9,0.72)] p-3 shadow-[0_30px_120px_rgba(0,0,0,0.48)] backdrop-blur-2xl will-change-transform lg:mx-0"

          aria-label="Dowody wdrożeń i profil operatora"

        >

          <div className="grid gap-3 sm:grid-cols-[0.92fr_1.08fr]">
            <figure className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem] border border-[var(--color-paper)]/18 bg-[var(--color-paper)]/8">
              <Portrait priority sizes="(min-width: 1024px) 230px, (min-width: 640px) 42vw, 82vw" className="h-full w-full rounded-none" />
              <figcaption className="absolute inset-x-3 bottom-3 rounded-2xl border border-[var(--color-paper)]/14 bg-[var(--color-ink)]/70 px-3 py-2 backdrop-blur-md">
                <span className="block font-mono text-[9px] tracking-[0.16em] text-accent uppercase">
                  Founder-led delivery
                </span>
                <span className="mt-1 block text-xs leading-snug text-[var(--color-paper)]/72">
                  Strategia, kod i wdrożenie bez rozmytej odpowiedzialności.
                </span>
              </figcaption>
            </figure>

            <div className="grid gap-3">
              <div className="hero-console-card">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-paper)]/42 uppercase">
                    Operator stack
                  </p>
                  <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-1 font-mono text-[9px] tracking-[0.14em] text-accent uppercase">
                    live
                  </span>
                </div>
                <div className="mt-5 space-y-3">
                  {liveProducts.map((product) => (
                    <a
                      key={product.name}
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-paper)]/10 bg-[var(--color-paper)]/[0.035] px-3 py-3 transition duration-300 hover:border-accent/35 hover:bg-accent/[0.07]"
                    >
                      <span>
                        <span className="block text-sm font-semibold text-[var(--color-paper)]">{product.name}</span>
                        <span className="mt-1 block font-mono text-[9px] tracking-[0.12em] text-[var(--color-paper)]/38 uppercase">
                          produkcja
                        </span>
                      </span>
                      <span className="text-sm text-accent transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden>
                        ↗
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="hero-console-card hero-console-card--accent">
                <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-paper)]/44 uppercase">
                  Kwalifikacja
                </p>
                <p className="mt-3 font-headline text-2xl leading-none text-[var(--color-paper)]">
                  Najpierw ROI, potem zakres.
                </p>
                <p className="mt-3 text-xs leading-relaxed text-[var(--color-paper)]/58">
                  Jeśli projekt nie odzyskuje czasu, marży albo kontroli operacyjnej, tnę zakres zamiast sprzedawać większy pakiet.
                </p>
              </div>
            </div>
          </div>

        </aside>

      </div>

      {/* Scroll cue */}
      <div
        className="hero-scroll-cue pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 md:bottom-8"
        aria-hidden
      >
        <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--color-paper)]/35 uppercase">
          przewiń ↓
        </span>
      </div>

    </section>

  )

}
