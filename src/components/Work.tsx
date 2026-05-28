import { projects } from '../data/content'
import type { Project } from '../data/content'
import { ProjectImage } from './ProjectImage'
import { VisitSiteButton } from './VisitSiteButton'

export function Work() {
  return (
    <section id="realizacje" data-section className="relative">
      <div className="section-pad pb-10 md:pb-14">
        <div className="mx-auto max-w-[1400px]">
          <p data-reveal className="section-label">
            03 — Realizacje
          </p>
          <h2 data-reveal className="font-display mt-4 text-4xl leading-tight md:text-6xl">
            Wybrane produkty
          </h2>
          <p data-reveal className="text-muted mt-6 max-w-xl text-sm leading-relaxed md:text-base">
            Cztery ekosystemy — od faktur po agentów AI. Każdy zaprojektowany pod konkretny model
            biznesowy, nie pod szablon z ThemeForest.
          </p>
        </div>
      </div>

      <div
        data-work-pin
        className="relative hidden min-h-[100dvh] overflow-hidden lg:block"
        aria-label="Galeria realizacji — przewiń w dół, aby przesunąć karty w poziomie"
      >
        <div
          data-work-chrome
          className="pointer-events-none absolute inset-x-0 top-8 z-20 flex items-center justify-between px-[max(1.5rem,calc((100vw-1400px)/2+1.5rem))]"
          aria-hidden
        >
          <p className="section-label text-[10px]">Przewiń · galeria</p>
          <div className="flex min-w-[9rem] flex-col items-end gap-2">
            <span data-work-progress-label className="font-display text-sm tabular-nums">
              01 / {String(projects.length).padStart(2, '0')}
            </span>
            <div className="h-px w-full origin-left bg-rule">
              <div
                data-work-progress-bar
                className="bg-accent h-full w-full origin-left"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
          </div>
        </div>
        <div
          data-work-track
          className="flex h-[100dvh] items-center gap-8 px-[max(1.5rem,calc((100vw-1400px)/2+1.5rem))] will-change-transform"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} variant="horizontal" />
          ))}
        </div>
      </div>

      <div className="section-pad space-y-10 pt-0 lg:hidden">
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
  project: Project
  variant: 'horizontal' | 'stack'
}) {
  const hasLiveSite = project.url !== '#'
  const liveCta = hasLiveSite && (project.id === 'mint' || project.id === 'plumm')

  return (
    <article
      data-project-card
      className={
        variant === 'horizontal'
          ? 'border-rule flex h-[min(78vh,720px)] w-[min(78vw,880px)] shrink-0 flex-col overflow-hidden border bg-paper'
          : 'border-rule flex flex-col overflow-hidden border bg-paper'
      }
    >
      <div
        className={
          variant === 'horizontal'
            ? 'grid min-h-0 flex-1 grid-rows-[1fr_auto]'
            : 'flex flex-col'
        }
      >
        <div className={variant === 'horizontal' ? 'min-h-0 flex-1 p-3 md:p-4' : 'aspect-[16/10] p-3'}>
          <ProjectImage
            project={project}
            variant={project.flagship ? 'hero' : 'card'}
            priority={project.flagship}
            className="rounded-none"
          />
        </div>

        <div className="editorial-rule border-t p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-muted text-xs tracking-widest uppercase">{project.domain}</p>
              <h3 className="font-display mt-1 text-2xl md:text-3xl">{project.title}</h3>
              <p className="text-accent mt-1 text-sm">{project.tagline}</p>
            </div>
            {liveCta && <VisitSiteButton project={project} variant="prominent" className="shrink-0" />}
          </div>

          <p className="text-muted mt-4 line-clamp-3 text-sm leading-relaxed md:text-base">
            {project.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="border-rule border px-3 py-1 text-[11px] text-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="editorial-rule mt-5 flex flex-wrap items-end justify-between gap-4 border-t pt-5">
            <div>
              <p className="font-display text-2xl text-accent">{project.stat.value}</p>
              <p className="text-muted text-[10px] uppercase">{project.stat.label}</p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {project.metrics.map((m) => (
                <li key={m} className="border-rule border px-2.5 py-1 text-[10px] text-muted">
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
