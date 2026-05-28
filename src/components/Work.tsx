import { projects } from '../data/content'
import { ProjectImage } from './ProjectImage'

export function Work() {
  return (
    <section id="realizacje" data-section className="px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-reveal className="text-mint text-xs font-semibold tracking-[0.3em] uppercase">
              Wybrane produkty
            </p>
            <h2 data-reveal className="font-display mt-4 text-4xl font-bold md:text-6xl">
              Realizacje
            </h2>
          </div>
          <p data-reveal className="text-muted max-w-md text-sm md:text-base">
            Cztery ekosystemy — od faktur po agentów AI. Każdy zaprojektowany pod konkretny model
            biznesowy, nie pod szablon z ThemeForest.
          </p>
        </div>
      </div>

      {/* Desktop: horizontal scroll pin */}
      <div
        data-work-pin
        className="relative hidden h-[85vh] overflow-hidden lg:block"
      >
        <div data-work-track className="flex h-full w-max gap-8 px-10">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} variant="horizontal" />
          ))}
        </div>
      </div>

      {/* Mobile / tablet: vertical stack */}
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:hidden">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} variant="stack" />
        ))}
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  variant,
}: {
  project: (typeof projects)[0]
  variant: 'horizontal' | 'stack'
}) {
  const isLink = project.url !== '#'

  return (
    <article
      data-project-card
      className={
        variant === 'horizontal'
          ? 'glass flex h-[min(72vh,680px)] w-[min(72vw,920px)] shrink-0 flex-col overflow-hidden rounded-3xl'
          : 'glass flex flex-col overflow-hidden rounded-3xl'
      }
    >
      <div
        className={
          variant === 'horizontal' ? 'grid h-full grid-rows-[1fr_auto]' : 'flex flex-col'
        }
      >
        <div className={variant === 'horizontal' ? 'min-h-0 flex-1 p-4' : 'aspect-[16/10] p-3'}>
          <ProjectImage
            project={project}
            variant={project.flagship ? 'hero' : 'card'}
            priority={project.flagship}
          />
        </div>

        <div className="border-line border-t p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-muted text-xs tracking-widest uppercase">{project.domain}</p>
              <h3 className="font-display mt-1 text-2xl font-bold md:text-3xl">{project.title}</h3>
              <p className="text-mint mt-1 text-sm">{project.tagline}</p>
            </div>
            {isLink && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-line px-4 py-2 text-xs font-medium transition-colors hover:border-mint hover:text-mint"
              >
                Otwórz →
              </a>
            )}
          </div>

          <p className="text-cream/70 mt-4 line-clamp-3 text-sm leading-relaxed md:text-base">
            {project.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-cream/80"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5">
            <div>
              <p className="font-display text-2xl font-bold" style={{ color: project.accent }}>
                {project.stat.value}
              </p>
              <p className="text-muted text-[10px] uppercase">{project.stat.label}</p>
            </div>
            <ul className="flex flex-wrap gap-3">
              {project.metrics.map((m) => (
                <li key={m} className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-cream/80">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  )
}
