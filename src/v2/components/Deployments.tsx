import { sections, projects } from '../../i18n/live'
import { projectImageTextureUrl } from '../../lib/projectImageUrl'

// Concrete metric pulled from each project's copy
const projectMetrics: Record<string, { value: string; context: string }> = {
  mint: { value: '10–15% taniej niż OTA', context: 'dla gościa rezerwującego bezpośrednio na mintapartments.pl' },
  plumm: { value: '12–20 h/mies.', context: 'mniej na fakturach, JPK i papierologii przy regularnym wolumenie' },
  idrive: { value: 'Szybsza publikacja + SEO', context: 'bez WordPressa i wtyczek — artykuł z repo do URL w minuty' },
  agentic: { value: '5–10 h/tydz.', context: 'mniej na raportach, synchronizacjach i powtarzalnych zapytaniach' },
}

export function Deployments() {
  return (
    <section id="deployments" className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
      {/* Section header */}
      <div className="reveal mb-16">
        <p className="v2-label">02 / REALIZACJE</p>
        <h2 className="v2-display mt-4 text-[clamp(2rem,5vw,3.75rem)]">
          {sections.work.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-paper)]/60 md:text-lg">
          {sections.work.lead}
        </p>
      </div>

      {/* Project rows */}
      <div className="flex flex-col gap-10 md:gap-16">
        {projects.map((project, idx) => {
          const isLive = project.url.startsWith('http')
          const isEven = idx % 2 === 0
          const code = `A${String(idx + 1).padStart(3, '0')}`
          const metric = projectMetrics[project.id]

          return (
            <div
              key={project.id}
              id={`project-${project.id}`}
              className="reveal grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
            >
              {/* Image — alternates left/right */}
              <div className={`${isEven ? 'md:order-1' : 'md:order-2'}`}>
                <div className="v2-panel relative overflow-hidden">
                  <img
                    src={projectImageTextureUrl(project, 'hero')}
                    alt={`${project.title} — zrzut ekranu`}
                    className="h-full w-full object-cover object-top transition-transform duration-700 ease-out hover:scale-[1.02]"
                    style={{ minHeight: '280px', maxHeight: '420px' }}
                    loading="lazy"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/60 via-transparent to-transparent pointer-events-none" />

                  {/* Project code — top left */}
                  <span className="v2-mono absolute top-4 left-4 text-[11px] tracking-[0.18em] text-accent">
                    {code}
                  </span>

                  {/* Status pill — top right */}
                  {isLive ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="v2-pill absolute top-4 right-4 hover:border-accent transition-colors"
                    >
                      <span className="v2-dot" />
                      LIVE ↗
                    </a>
                  ) : (
                    <span className="v2-pill absolute top-4 right-4">
                      system wewnętrzny
                    </span>
                  )}

                  {/* Flagship badge */}
                  {project.flagship && (
                    <span className="v2-mono absolute bottom-4 left-4 text-[10px] tracking-[0.14em] text-accent uppercase">
                      flagship
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className={`flex flex-col justify-center ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                {/* Tagline */}
                <p className="v2-mono text-[11px] tracking-[0.18em] text-accent uppercase">
                  {project.tagline}
                </p>

                {/* Title */}
                <h3 className="v2-display mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)]">
                  {project.title}
                </h3>

                {/* Domain */}
                <p className="v2-mono mt-1 text-[11px] tracking-[0.12em] text-[var(--color-paper)]/40">
                  {project.domain}
                </p>

                {/* Metric */}
                {metric && (
                  <div className="mt-5 border-l-2 border-accent pl-4">
                    <p className="v2-metric text-2xl md:text-3xl">{metric.value}</p>
                    <p className="mt-1 text-[12px] leading-snug text-[var(--color-paper)]/50">
                      {metric.context}
                    </p>
                  </div>
                )}

                {/* Pain / Outcome */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="v2-panel p-4">
                    <p className="v2-label mb-2">problem</p>
                    <p className="text-[13px] leading-relaxed text-[var(--color-paper)]/65">
                      {project.pain}
                    </p>
                  </div>
                  <div className="v2-panel p-4">
                    <p className="v2-label mb-2">efekt</p>
                    <p className="text-[13px] leading-relaxed text-[var(--color-paper)]/65">
                      {project.outcome}
                    </p>
                  </div>
                </div>

                {/* Decisions */}
                <ul className="mt-5 space-y-2">
                  {project.decisions.map((d) => (
                    <li key={d} className="flex gap-3 text-[13px] leading-snug text-[var(--color-paper)]/65">
                      <span className="mt-0.5 shrink-0 text-accent font-mono">—</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="v2-mono rounded border border-[var(--v2-line-bright)] px-2 py-0.5 text-[10px] tracking-[0.12em] text-[var(--color-paper)]/45 uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Live link */}
                {isLive && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="v2-mono mt-6 inline-flex items-center gap-2 text-[12px] tracking-[0.14em] text-accent uppercase transition-opacity hover:opacity-70"
                  >
                    Zobacz na żywo ↗
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
