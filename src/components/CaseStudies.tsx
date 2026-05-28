import { projects } from '../data/content'
import { ProjectMock } from './ProjectMock'
import { MagneticButton } from './MagneticButton'

export function CaseStudies() {
  const flagship = projects.find((p) => p.flagship)!
  const rest = projects.filter((p) => !p.flagship)

  return (
    <section id="case-studies" data-section className="border-line border-t bg-ink px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <p data-reveal className="text-mint text-xs font-semibold tracking-[0.3em] uppercase">
          Case studies · PSR
        </p>
        <h2 data-reveal className="font-display mt-4 max-w-3xl text-4xl font-bold md:text-5xl">
          Problem → podejście →{' '}
          <span className="text-gold">wynik biznesowy</span>
        </h2>

        {/* Flagship bento */}
        <article
          data-reveal
          className="glass mt-12 grid overflow-hidden rounded-3xl lg:grid-cols-2"
        >
          <div className="min-h-[280px] p-4 lg:min-h-[360px]">
            <ProjectMock project={flagship} />
          </div>
          <div className="flex flex-col justify-center border-t border-line p-8 lg:border-t-0 lg:border-l">
            <span className="text-mint text-xs font-semibold tracking-widest uppercase">
              Flagship · {flagship.client}
            </span>
            <h3 className="font-display mt-2 text-3xl font-bold">{flagship.title}</h3>
            <p className="text-muted mt-1">{flagship.tagline}</p>

            <dl className="mt-8 space-y-4 text-sm">
              <div>
                <dt className="text-muted text-xs uppercase">Ból</dt>
                <dd className="mt-1 text-cream/90">{flagship.pain}</dd>
              </div>
              <div>
                <dt className="text-muted text-xs uppercase">Podejście</dt>
                <dd className="mt-1 text-cream/90">{flagship.approach}</dd>
              </div>
              <div>
                <dt className="text-muted text-xs uppercase">Wynik</dt>
                <dd className="mt-1 font-medium text-mint">{flagship.result}</dd>
              </div>
            </dl>

            <div className="mt-8 flex items-end justify-between gap-4">
              <div>
                <p className="font-display text-4xl font-bold" style={{ color: flagship.accent }}>
                  {flagship.stat.value}
                </p>
                <p className="text-muted text-xs uppercase">{flagship.stat.label}</p>
              </div>
              <MagneticButton
                href={flagship.url}
                external
                className="rounded-full border border-line px-5 py-2.5 text-xs font-medium hover:border-mint"
              >
                mintapartments.pl →
              </MagneticButton>
            </div>
          </div>
        </article>

        {/* Grid 3 */}
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {rest.map((p) => (
            <article key={p.id} data-reveal className="glass flex flex-col overflow-hidden rounded-3xl">
              <div className="aspect-[16/10] p-3">
                <ProjectMock project={p} />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-muted text-[10px] tracking-widest uppercase">{p.client}</p>
                <h3 className="font-display mt-1 text-xl font-bold">{p.title}</h3>
                <p className="text-muted mt-3 line-clamp-3 flex-1 text-sm leading-relaxed">{p.pain}</p>
                <p className="mt-4 text-sm font-medium" style={{ color: p.accent }}>
                  {p.result}
                </p>
                {p.url !== '#' && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted mt-4 text-xs hover:text-mint"
                  >
                    Zobacz produkt →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
