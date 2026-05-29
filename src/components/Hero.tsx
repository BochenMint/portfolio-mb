import { site } from '../data/content'
import { Portrait } from './Portrait'

export function Hero() {
  const ctaHref = site.calendly || '#contact'

  return (
    <section
      data-hero
      className="section-pad relative flex min-h-[88dvh] flex-col justify-center border-b border-rule pt-24 md:pt-28"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(260px,380px)] lg:gap-16">
        <div className="min-w-0">
          <p data-hero-fade className="section-label">
            {site.role}
          </p>
          <h1
            data-hero-fade
            className="font-headline mt-6 text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.08]"
          >
            {site.name}
          </h1>
          <p
            data-hero-fade
            className="text-balance mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl"
          >
            {site.valueProp}
          </p>
          <p data-hero-fade className="text-muted mt-4 text-sm">
            {site.responseTime} · {site.location}
          </p>
          <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={ctaHref}
              className="btn-fill"
              {...(site.calendly ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {site.ctaPrimary}
              <span aria-hidden>→</span>
            </a>
            <a href="#work" className="btn-soft">
              {site.ctaSecondary}
            </a>
          </div>
        </div>

        <figure
          data-hero-fade
          className="relative mx-auto aspect-square w-full max-w-[min(380px,80vw)] shrink-0 overflow-hidden border border-rule bg-surface lg:mx-0"
        >
          <Portrait priority sizes="(min-width: 1024px) 380px, 80vw" className="h-full w-full" />
        </figure>
      </div>
    </section>
  )
}
