import { site } from '../data/content'

import { Portrait } from './Portrait'

function HeadlineLine({ line }: { line: string }) {
  const words = line.split(/\s+/).filter(Boolean)

  return (
    <span className="block overflow-hidden py-[0.04em]">
      <span data-hero-line className="block">
        {words.map((word, i) => (
          <span key={`${word}-${i}`} data-hero-word className="inline-block">
            {word}
            {i < words.length - 1 ? '\u00a0' : ''}
          </span>
        ))}
      </span>
    </span>
  )
}

export function Hero() {
  const ctaHref = site.calendly || '#contact'

  return (
    <section
      data-hero
      className="section-stage section-pad relative flex min-h-[92dvh] flex-col justify-center overflow-hidden pt-24 md:pt-28"
    >
      <div
        className="pointer-events-none absolute top-0 right-0 left-0 h-1 bg-accent"
        aria-hidden
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(260px,400px)] lg:gap-20">
        <div className="min-w-0">
          <div data-hero-fade className="hero-accent-bar" aria-hidden />
          <p data-hero-fade className="section-label mt-8">
            {site.role}
          </p>
          <h1 className="font-headline mt-6 text-[clamp(2.5rem,7.5vw,5.75rem)] leading-[0.95]">
            <HeadlineLine line={site.name} />
          </h1>
          <p
            data-hero-fade
            className="text-stage-muted text-balance mt-8 max-w-2xl text-lg leading-relaxed md:text-xl"
          >
            {site.valueProp}
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
          className="relative mx-auto aspect-square w-full max-w-[min(400px,76vw)] shrink-0 overflow-hidden rounded-sm lg:mx-0 lg:max-w-none"
        >
          <div
            className="absolute inset-0 z-10 ring-2 ring-accent/0 transition-[box-shadow,ring-color] duration-500 hover:ring-accent"
            aria-hidden
          />
          <Portrait priority sizes="(min-width: 1024px) 400px, 76vw" className="h-full w-full" />
        </figure>
      </div>
    </section>
  )
}
