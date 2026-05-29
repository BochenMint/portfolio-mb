import { projects } from '../data/content'
import type { Project } from '../data/content'
import { ProjectImage } from './ProjectImage'
import { WorkStrip } from './WorkStrip'

export function Work() {
  return (
    <section id="work" data-section className="section-pad border-t border-rule">
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="section-label">
          Realizacje
        </p>
        <h2
          data-reveal
          className="font-headline mt-4 text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.95]"
        >
          Cztery produkty w produkcji
        </h2>
        <p data-reveal className="text-muted mt-6 max-w-2xl text-base leading-relaxed md:text-lg">
          Hospitality, FinTech, media motoryzacyjne i orkiestracja agentów — każdy pod konkretny model
          biznesowy.
        </p>

        <WorkStrip />
      </div>

      <ul className="mt-16 flex flex-col gap-0">
        {projects.map((project, index) => (
          <li key={project.id} className="border-t border-rule first:border-t-0">
            <ProjectCard project={project} index={index + 1} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const hasLiveSite = project.url.startsWith('http')
  const detailHref = `#project-${project.id}`

  return (
    <article
      id={`work-${project.id}`}
      data-project-card
      className="project-card group scroll-mt-28 overflow-hidden bg-[var(--color-surface)] md:scroll-mt-32"
    >
      <div className="bleed-full project-card-media relative aspect-[16/9] overflow-hidden md:aspect-[21/9]">
        <ProjectImage
          project={project}
          variant="card"
          priority={index === 1}
          className="project-card-img rounded-none"
        />
        <span className="project-index absolute top-6 left-6 z-10 px-3 py-1.5 md:left-10 lg:left-16">
          {String(index).padStart(2, '0')}
        </span>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-end md:justify-between md:px-10 md:py-12 lg:px-16">
        <div className="min-w-0">
          <p className="section-label">{project.domain}</p>
          <h3 className="font-headline mt-3 text-[clamp(1.75rem,4vw,3rem)] leading-tight">
            {project.title}
          </h3>
          <p className="text-muted mt-3 max-w-xl text-sm leading-relaxed md:text-base">
            {project.tagline}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="border border-[var(--color-rule)] px-2.5 py-0.5 text-[11px] text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <a href={detailHref} className="btn-soft text-xs">
            Case study
          </a>
          {hasLiveSite ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fill text-xs"
            >
              {project.domain}
              <span aria-hidden>↗</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}
