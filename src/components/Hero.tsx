import { site } from '../data/content'

import { Portrait } from './Portrait'

function HeadlineLine({ line }: { line: string }) {
  const words = line.split(/\s+/).filter(Boolean)

  return (
    <span className="block overflow-hidden py-[0.05em]">
      <span data-hero-line className="block font-semibold tracking-[-0.03em]">
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
      className="section-stage section-pad flex min-h-[92dvh] flex-col justify-center pt-28 md:pt-32"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(260px,380px)] lg:gap-16">
        <div className="min-w-0">
          <div data-hero-fade className="hero-accent-bar" aria-hidden />
          <p data-hero-fade className="section-label">
            {site.role}
          </p>
          <h1 className="font-display mt-4 text-[clamp(2.85rem,8.5vw,5.75rem)] leading-[0.98] tracking-tight">
            <HeadlineLine line={site.name} />
          </h1>
          <p
            data-hero-fade
            className="text-balance mt-8 max-w-2xl text-lg leading-relaxed text-[color-mix(in_srgb,var(--color-stage-ink)_88%,transparent)] md:text-xl"
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
          className="relative mx-auto aspect-square w-full max-w-[min(380px,72vw)] shrink-0 overflow-hidden rounded-2xl ring-2 ring-[color-mix(in_srgb,var(--color-accent)_55%,transparent)] md:rounded-3xl lg:mx-0 lg:max-w-none"
        >
          <Portrait priority sizes="(min-width: 1024px) 380px, 72vw" className="h-full w-full" />
        </figure>
      </div>
    </section>
  )
}
