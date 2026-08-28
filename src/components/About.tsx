import { sections, site } from '../i18n/live'
import { Portrait } from './Portrait'
import { SectionIntro } from './SectionIntro'

export function About() {
  return (
    <section id="about" data-section className="section-pad">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          num={sections.about.num}
          title={sections.about.title}
          lead={sections.about.lead}
        />

        <div className="grid items-start gap-12 md:grid-cols-[minmax(200px,280px)_1fr] md:gap-16 lg:gap-20">
          {/* portrait column */}
          <figure
            data-about-portrait
            className="relative mx-auto w-full max-w-[280px] md:mx-0"
          >
            <div className="overflow-hidden border border-[var(--color-paper)]/15 bg-[var(--color-paper)]/5 aspect-[4/5] will-change-transform">
              <Portrait sizes="(min-width: 768px) 280px, 72vw" className="h-full w-full" />
            </div>
            {/* accent hairline below portrait */}
            <div className="accent-hairline mt-4 opacity-60" aria-hidden />
            {/* meta tags below portrait */}
            <p className="font-mono mt-3 text-[10px] tracking-[0.14em] uppercase text-muted leading-relaxed">
              {site.location}
              <br />
              {site.responseTime}
            </p>
          </figure>

          {/* content column */}
          <div className="min-w-0">
            {/* pull-quote with accent left border */}
            <blockquote
              data-pull-quote
              className="relative pl-6 md:pl-8"
            >
              {/* accent vertical rule */}
              <span
                aria-hidden
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
                style={{
                  background:
                    'linear-gradient(180deg, var(--color-accent), var(--color-coral) 80%)',
                }}
              />
              {/* decorative opening quote in accent */}
              <span
                aria-hidden
                className="font-headline block text-[3.5rem] leading-none text-accent/40 mb-1 select-none"
                style={{ marginLeft: '-0.15em' }}
              >
                &ldquo;
              </span>
              <p className="font-headline text-[clamp(1.4rem,3vw,2.1rem)] leading-snug tracking-tight">
                {site.aboutQuote}
              </p>
            </blockquote>

            <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-10">
              <p
                data-reveal
                className="text-base leading-relaxed text-[var(--color-paper)]/85 md:text-[1.0625rem]"
              >
                {site.aboutLead}
              </p>
              <p data-reveal className="text-muted text-base leading-relaxed">
                {site.aboutAside}
              </p>
            </div>

            {/* ICP badge */}
            <div className="mt-8">
              <span className="font-mono inline-block rounded-[2px] border border-accent/30 px-3 py-1.5 text-[10px] tracking-[0.12em] uppercase text-accent/80">
                {site.icpBadge}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
