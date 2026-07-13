import { liveProof, sections, trustPoints } from '../data/content'
import { SectionIntro } from './SectionIntro'

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      data-section
      className="section-pad border-t border-[var(--color-paper)]/15 bg-[var(--color-paper)]/[0.02]"
    >
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          num={sections.testimonials.num}
          title={sections.testimonials.title}
          lead={sections.testimonials.lead}
        />

        {/* Live proof — 3 clickable cards */}
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {liveProof.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
              className="group flex flex-col border border-[var(--color-paper)]/15 bg-[var(--color-surface)] p-6 transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-accent)_20%,transparent)] md:p-7"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-headline text-xl leading-tight">{item.name}</h3>
                <span
                  className="shrink-0 font-mono text-sm text-accent transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                >
                  ↗
                </span>
              </div>
              <span className="font-mono mt-3 inline-block border border-accent/30 bg-accent/5 px-2 py-0.5 text-[10px] tracking-[0.12em] text-accent uppercase">
                {item.tag}
              </span>
              <p className="text-muted mt-4 flex-1 text-sm leading-relaxed">{item.result}</p>
              <span className="mt-5 text-xs font-medium text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Zobacz wdrożenie ↗
              </span>
            </a>
          ))}
        </div>

        {/* Trust points — 3 principles */}
        <div className="mt-14 grid gap-8 border-t border-[var(--color-paper)]/12 pt-14 md:grid-cols-3 md:gap-10">
          {trustPoints.map((point, i) => (
            <div key={point.title} data-reveal className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sunset text-sm font-semibold" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="accent-hairline flex-1" />
              </div>
              <h4 className="font-headline text-lg leading-snug">{point.title}</h4>
              <p className="text-muted text-sm leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
