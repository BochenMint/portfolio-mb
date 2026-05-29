import { projects } from '../data/content'
import type { Project } from '../data/content'
import { ProjectImage } from './ProjectImage'

export function Work() {
  return (
    <section id="work" data-section className="section-pad border-t border-rule">
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="section-label">
          Realizacje
        </p>
        <h2 data-reveal className="font-headline mt-3 text-4xl leading-tight md:text-5xl">
          Cztery produkty w produkcji
        </h2>
        <p data-reveal className="text-muted mt-4 max-w-2xl text-base leading-relaxed">
          Hospitality, FinTech, media motoryzacyjne i orkiestracja agentów — każdy pod konkretny model
          biznesowy.
        </p>

        <ul className="mt-12 grid gap-8 md:grid-cols-2">
          {projects.map((project, index) => (
            <li key={project.id}>
              <ProjectCard project={project} index={index + 1} />
            </li>
          ))}
        </ul>
      </div>
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
      data-reveal
      className="group scroll-mt-28 overflow-hidden border border-rule bg-surface md:scroll-mt-32"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <ProjectImage
          project={project}
          variant="card"
          priority={index === 1}
          className="rounded-none"
        />
        <span className="project-index absolute top-4 left-4 px-2.5 py-1">
          {String(index).padStart(2, '0')}
        </span>
      </div>

      <div className="flex flex-col gap-4 p-6">
        <div>
          <p className="text-muted text-xs font-medium tracking-wide uppercase">{project.domain}</p>
          <h3 className="font-headline mt-2 text-2xl">{project.title}</h3>
          <p className="text-muted mt-2 text-sm leading-relaxed">{project.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="border-rule border px-2.5 py-0.5 text-[11px] text-muted">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
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
