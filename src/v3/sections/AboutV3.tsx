import { site, sections } from '../../i18n/live'

export function AboutV3() {
  return (
    <section id="o-mnie" className="mx-auto max-w-6xl px-5 py-24 md:py-32 md:px-8">
      <div className="mb-16">
        <p className="v3-label mb-4">
          {sections.about.num} / {sections.about.title}
        </p>
        <h2 className="v3-display text-[clamp(2rem,5vw,3.5rem)] text-balance mb-5">
          Builder, nie{' '}
          <em className="v3-serif-accent">agencja slajdów</em>
        </h2>
        <p className="text-muted max-w-2xl text-base leading-relaxed">{sections.about.lead}</p>
      </div>

      <div className="grid items-start gap-12 md:grid-cols-[minmax(220px,300px)_1fr] md:gap-16 lg:gap-20">
        <figure className="reveal relative mx-auto w-full max-w-[300px] md:mx-0">
          <div className="relative overflow-hidden border border-[var(--v3-line-bright)]">
            <img
              src={site.photo}
              alt={site.photoAlt}
              width={site.photoWidth}
              height={site.photoHeight}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover object-[center_18%]"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, transparent 55%, color-mix(in srgb, var(--v3-surface) 88%, transparent) 100%)',
              }}
              aria-hidden
            />
          </div>
          <figcaption className="v3-mono mt-4 text-[11px] leading-relaxed text-muted">
            {site.location}
            <br />
            {site.responseTime}
          </figcaption>
        </figure>

        <div className="reveal flex min-w-0 flex-col gap-10">
          <blockquote className="relative border-l-2 border-accent pl-6 md:pl-8">
            <p
              className="v3-serif-accent text-[var(--color-paper)]/90 leading-relaxed"
              style={{
                fontFamily: 'var(--font-headline)',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 'clamp(1.35rem, 2.8vw, 2rem)',
              }}
            >
              {site.aboutQuote}
            </p>
          </blockquote>

          <div className="grid gap-6 md:grid-cols-2 md:gap-10">
            <p className="text-base leading-relaxed text-[var(--color-paper)]/88">{site.aboutLead}</p>
            <p className="text-muted text-base leading-relaxed">{site.aboutAside}</p>
          </div>

          <div className="flex flex-col gap-4 border-t border-[var(--v3-line)] pt-8 sm:flex-row sm:items-center sm:justify-between">
            <span className="v3-mono text-[10px] uppercase tracking-widest text-muted">
              {site.icpBadge}
            </span>
            <a
              href={site.mbAiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="v3-mono text-accent text-[11px] tracking-widest uppercase hover:opacity-70 transition-opacity"
            >
              Więcej o automatyzacjach AI →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
