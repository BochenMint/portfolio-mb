import { site } from '../data/content'
import { Portrait } from './Portrait'
import { MagneticButton } from './MagneticButton'

export function Hero() {
  const ctaHref = site.calendly || '#contact'

  return (
    <section
      data-hero
      className="relative flex min-h-[100dvh] flex-col justify-end border-b border-[var(--color-paper)]/12 pb-16 pt-28 md:pb-20 md:pt-32"
    >
      <div className="mx-auto grid w-full max-w-[100vw] items-end gap-10 px-6 md:grid-cols-[1fr_minmax(200px,320px)] md:gap-12 md:px-10 lg:px-16">
        <div className="min-w-0">
          <p data-hero-fade className="section-label text-[var(--color-paper)]/55">
            {site.icpBadge}
          </p>
          <p data-hero-fade className="mt-3 text-sm text-[var(--color-paper)]/55">
            {site.role}
          </p>

          <h1 className="font-headline mt-6 text-[clamp(3.25rem,14vw,10rem)] leading-[0.88] tracking-tight">
            {site.headline.map((line) => (
              <span key={line} data-hero-line className="block overflow-hidden">
                <span data-hero-line-inner className="block">
                  {line.split('').map((char, j) => (
                    <span key={`${line}-${j}`} data-hero-word className="inline-block">
                      {char}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h1>

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
          className="relative mx-auto aspect-[3/4] w-full max-w-[min(320px,72vw)] shrink-0 overflow-hidden border border-[var(--color-paper)]/20 bg-[var(--color-paper)]/5 will-change-transform md:mx-0"
        >
          <Portrait priority sizes="(min-width: 768px) 320px, 72vw" className="h-full w-full" />
        </figure>
      </div>
    </section>
  )
}
