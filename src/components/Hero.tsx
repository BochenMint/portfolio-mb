import { projects, site } from '../data/content'
import { ProjectImage } from './ProjectImage'

const flagship = projects.find((p) => p.flagship)!

function HeadlineLine({ line }: { line: string }) {
  const words = line.split(/\s+/).filter(Boolean)
  return (
    <span className="block overflow-hidden py-[0.06em]">
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
  const ctaHref = site.calendly || '#kontakt'

  return (
    <section
      data-hero
      className="section-pad relative flex min-h-[100dvh] flex-col justify-end pt-28 md:pt-32"
    >
      <div className="mx-auto grid w-full max-w-[1400px] flex-1 gap-10 lg:grid-cols-[1fr_minmax(280px,42%)] lg:items-end lg:gap-16">
        <div className="flex flex-col justify-center">
          <p data-hero-fade className="section-label">
            Portfolio · {site.role}
          </p>
          <h1 className="font-display mt-6 text-[clamp(2.75rem,7.5vw,5.5rem)] leading-[1.02] tracking-tight">
            {site.headline.map((line) => (
              <HeadlineLine key={line} line={line} />
            ))}
          </h1>
          <p
            data-hero-fade
            className="text-balance mt-8 max-w-xl text-base leading-relaxed md:text-lg"
          >
            {site.subhead}
          </p>
          <p data-hero-fade className="text-muted mt-4 text-sm">
            {site.responseTime} · {site.location} · {site.minBudget}
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
            <a href="#realizacje" className="btn-soft">
              {site.ctaSecondary}
            </a>
          </div>
        </div>

        <figure data-hero-fade className="relative lg:-mb-8">
          <span className="font-hand text-accent absolute -top-4 -left-2 z-10 text-2xl md:text-3xl">
            Mint · live
          </span>
          <div
            data-hero-media
            className="border-rule relative aspect-[4/5] overflow-hidden border md:aspect-[3/4] lg:translate-x-6"
          >
            <div data-hero-parallax className="h-[115%] w-full will-change-transform">
              <ProjectImage project={flagship} variant="hero" priority className="rounded-none" />
            </div>
          </div>
          <figcaption className="text-muted mt-3 max-w-xs text-xs leading-relaxed">
            Zrzut produkcyjny — {flagship.domain}
          </figcaption>
        </figure>
      </div>

      <div data-hero-fade className="editorial-rule mx-auto mt-16 max-w-[1400px] md:mt-20" />
      <p
        data-hero-fade
        className="text-muted mx-auto mt-6 max-w-[1400px] pb-4 text-center text-[11px] tracking-[0.2em] uppercase"
      >
        Mint · Plumm · iDrive · Agentic OS
      </p>
    </section>
  )
}
