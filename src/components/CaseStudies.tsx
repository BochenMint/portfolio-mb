import { projects } from '../data/content'
import { ProjectImage } from './ProjectImage'
import { VisitSiteButton } from './VisitSiteButton'

export function CaseStudies() {
  const flagship = projects.find((p) => p.flagship)!
  const rest = projects.filter((p) => !p.flagship)

  return (
    <section id="case-studies" data-section className="section-pad editorial-rule editorial-panel border-t">
      <div className="mx-auto max-w-[1400px]">
        <p data-reveal className="section-label">
          04 — Case studies
        </p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 data-reveal className="font-display max-w-3xl text-4xl leading-tight md:text-5xl">
            Problem → podejście →{' '}
            <span className="text-accent italic">wynik biznesowy</span>
          </h2>
          <p
            data-reveal
            className="text-muted max-w-xs text-xs leading-relaxed tracking-wide uppercase lg:text-right"
          >
            Mint i Plumm — produkcja, nie mockupy
          </p>
        </div>

        <article
          data-case-flagship
          data-reveal
          className="border-rule mt-12 grid overflow-hidden border bg-paper lg:grid-cols-2"
        >
          <div data-case-image className="min-h-[280px] overflow-hidden lg:min-h-[400px]">
            <div data-case-image-inner className="h-full w-full will-change-transform">
              <ProjectImage project={flagship} variant="hero" priority className="rounded-none" />
            </div>
          </div>
          <div
            data-case-copy
            className="flex flex-col justify-center border-t border-rule p-8 lg:border-t-0 lg:border-l"
          >
            <span className="section-label">Flagship · {flagship.client}</span>
            <h3 className="font-display mt-3 text-3xl">{flagship.title}</h3>
            <p className="text-muted mt-1">{flagship.tagline}</p>

            <dl className="mt-8 space-y-4 text-sm">
              <div>
                <dt className="section-label text-[10px]">Ból</dt>
                <dd className="mt-2 leading-relaxed">{flagship.pain}</dd>
              </div>
              <div>
                <dt className="section-label text-[10px]">Podejście</dt>
                <dd className="mt-2 leading-relaxed">{flagship.approach}</dd>
              </div>
              <div>
                <dt className="section-label text-[10px]">Wynik</dt>
                <dd className="text-accent mt-2 font-medium">{flagship.result}</dd>
              </div>
            </dl>

            <blockquote className="border-rule mt-8 border-l-2 py-1 pl-5">
              <p className="font-hand text-accent text-xl leading-snug md:text-2xl">{flagship.pullQuote}</p>
            </blockquote>

            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-display text-4xl text-accent">{flagship.stat.value}</p>
                <p className="text-muted text-xs uppercase">{flagship.stat.label}</p>
              </div>
              <VisitSiteButton project={flagship} variant="prominent" />
            </div>
          </div>
        </article>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {rest.map((p) => (
            <article
              key={p.id}
              data-reveal
              className="border-rule flex flex-col overflow-hidden border bg-paper"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <ProjectImage project={p} variant="card" className="rounded-none" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="section-label text-[10px]">{p.client}</p>
                <h3 className="font-display mt-2 text-xl">{p.title}</h3>
                <p className="text-muted mt-3 line-clamp-3 flex-1 text-sm leading-relaxed">{p.pain}</p>
                <p className="text-accent mt-4 text-sm font-medium">{p.result}</p>
                <VisitSiteButton
                  project={p}
                  variant={p.id === 'plumm' ? 'prominent' : 'compact'}
                  className={p.id === 'plumm' ? 'mt-6' : ''}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
