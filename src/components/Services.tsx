import { sections, services } from '../i18n/live'
import { SectionIntro } from './SectionIntro'

export function Services() {
  return (
    <section
      id="services"
      data-section
      className="section-pad border-t border-[var(--color-paper)]/12"
    >
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          num={sections.services.num}
          title={sections.services.title}
          lead={sections.services.lead}
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {services.map((service, index) => (
            <article
              key={service.num}
              data-service-block
              className={`group relative flex min-h-[430px] flex-col overflow-hidden rounded-[1.8rem] border p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/40 md:p-7 ${
                index === 0
                  ? 'border-accent/28 bg-[radial-gradient(circle_at_20%_0%,rgba(245,165,36,0.16),transparent_18rem),rgba(245,165,36,0.055)] lg:col-span-2'
                  : 'border-[var(--color-paper)]/12 bg-[var(--color-paper)]/[0.035]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <p
                  aria-hidden
                  className="font-mono text-[clamp(2.5rem,7vw,4.5rem)] leading-none tabular-nums text-[var(--color-paper)]/10 transition-colors duration-300 group-hover:text-accent/28 select-none"
                >
                  {service.num}
                </p>
                <span className="rounded-full border border-[var(--color-paper)]/12 bg-[var(--color-paper)]/[0.035] px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-[var(--color-paper)]/45 uppercase">
                  {service.timeline}
                </span>
              </div>

              <div className="mt-auto min-w-0 pt-12">
                {/* outcome — the strong lead */}
                <p
                  data-reveal
                  className="mb-4 font-mono text-[11px] leading-relaxed tracking-[0.14em] text-accent uppercase"
                >
                  {service.outcome}
                </p>

                <h3
                  data-reveal
                  className="mb-5 font-headline text-[clamp(2rem,4vw,3.35rem)] leading-[0.95] tracking-tight"
                >
                  {service.title}
                </h3>

                <p
                  data-reveal
                  className="text-muted max-w-prose text-base leading-relaxed md:text-[1.0625rem]"
                >
                  {service.description}
                </p>

                {/* meta: timeline · from */}
                <p
                  data-reveal
                  className="mt-6 font-mono text-[11px] tracking-[0.12em] text-[var(--color-paper)]/42"
                >
                  {service.from}
                </p>

                {/* tags as mono chips */}
                <ul
                  data-reveal
                  className="mt-6 flex flex-wrap gap-x-2 gap-y-2"
                >
                  {service.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-[var(--color-paper)]/15 px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] text-[var(--color-paper)]/50 uppercase transition-colors duration-200 hover:border-accent/50 hover:text-accent/80"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              {/* hover: subtle bottom accent line */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                style={{
                  background:
                    'linear-gradient(90deg, var(--color-accent), var(--color-coral) 80%, transparent)',
                }}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
