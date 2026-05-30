import { site } from '../data/content'

import { useHeroTypeMotion } from '../hooks/useHeroTypeMotion'

import { useHeroVariant } from '../hooks/useHeroVariant'

import { HeroDefaultHeadline } from './hero/HeroDefaultHeadline'

import { HeroOrbitLayer } from './hero/HeroOrbitLayer'

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



  useHeroTypeMotion(variant === 'type', animationsReady)



  const isOrbit = variant === 'orbit'

  const isType = variant === 'type'



  return (

    <section

      data-hero

      data-hero-variant={variant}

      className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden border-b border-[var(--color-paper)]/12 pb-24 pt-28 md:pb-28 md:pt-32"

    >

      {variant === 'retro' ? <HeroRetroLayer /> : null}

      {variant === 'type' ? <HeroTypeLayer /> : null}

      {variant === 'orbit' ? <HeroOrbitLayer /> : null}



      <HeroVariantSwitcher variant={variant} onChange={setVariant} />



      <div className="relative z-10 mx-auto grid w-full max-w-[100vw] items-end gap-10 px-6 md:grid-cols-[1fr_minmax(200px,320px)] md:gap-12 md:px-10 lg:px-16">

        <div className="min-w-0">

          <p

            data-hero-fade

            className={`section-label text-[var(--color-paper)]/55 ${isOrbit ? 'hero-orbit-kicker' : ''}`}

          >

            {site.icpBadge}

          </p>

          <p

            data-hero-fade

            className={`mt-3 text-sm text-[var(--color-paper)]/55 ${isOrbit ? 'hero-orbit-role' : ''}`}

          >

            {site.role}

          </p>



          {isType ? (

            <HeroTypeHeadline lines={site.headline} />

          ) : (

            <HeroDefaultHeadline

              lines={site.headline}

              className={isOrbit ? 'hero-orbit-display tracking-[0.02em]' : ''}

            />

          )}



          <p

            data-hero-fade

            className="text-balance mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-paper)]/72 md:mt-10 md:text-xl md:leading-relaxed"

          >

            {site.subhead}

          </p>



          <p

            data-hero-fade

            className="text-balance mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-paper)]/55"

          >

            {site.valueProp}

          </p>



          <p data-hero-fade className="mt-4 text-sm text-[var(--color-paper)]/45">

            {site.responseTime} · {site.location}

          </p>



          <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-4 md:mt-12">

            <MagneticButton

              href={ctaHref}

              className="btn-fill border border-[var(--color-paper)] bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-transparent hover:text-[var(--color-paper)]"

              external={Boolean(site.calendly)}

            >

              {site.ctaPrimary}

              <span aria-hidden>→</span>

            </MagneticButton>

            <a href="#work" className="btn-soft border-[var(--color-paper)]/25 text-[var(--color-paper)]">

              {site.ctaSecondary}

            </a>

          </div>

        </div>



        <figure

          data-hero-portrait

          className="relative z-10 mx-auto aspect-[3/4] w-full max-w-[min(320px,72vw)] shrink-0 overflow-hidden border border-[var(--color-paper)]/20 bg-[var(--color-paper)]/5 will-change-transform md:mx-0"

        >

          <Portrait priority sizes="(min-width: 768px) 320px, 72vw" className="h-full w-full" />

        </figure>

      </div>

    </section>

  )

}


