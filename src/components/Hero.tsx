import { site } from '../data/content'

function HeadlineLine({ line }: { line: string }) {
  const words = line.split(/\s+/).filter(Boolean)
  return (
    <span className="block overflow-hidden py-[0.05em]">
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
      className="section-pad flex min-h-[88dvh] flex-col justify-center pt-24 md:pt-28"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p data-hero-fade className="section-label">
          {site.role}
        </p>
        <h1 className="font-display mt-6 text-[clamp(2.75rem,8vw,5.5rem)] leading-[1.02] tracking-tight">
          <HeadlineLine line={site.name} />
        </h1>
        <p
          data-hero-fade
          className="text-balance mt-8 max-w-2xl text-lg leading-relaxed md:text-xl"
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
    </section>
  )
}
