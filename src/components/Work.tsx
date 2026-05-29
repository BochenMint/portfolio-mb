import { projects } from '../data/content'
import type { Project } from '../data/content'
import { ProjectImage } from './ProjectImage'
import { WorkStrip } from './WorkStrip'

function padIndex(n: number) {
  return String(n).padStart(2, '0')
}

export function Work() {
  return (
    <section id="work" data-section className="section-pad border-t border-rule">
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="section-label">
          Selected work
        </p>
        <h2 data-reveal className="font-display mt-3 text-4xl leading-tight md:text-5xl">
          My recent work
        </h2>

        <WorkStrip />

        <ul className="mt-12 grid gap-10 md:gap-12">
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
      data-project-card
      data-reveal
      className="group border-rule overflow-hidden border bg-surface"
    >
      <div className="relative aspect-[16/9] overflow-hidden md:aspect-[2/1]">
        <ProjectImage
          project={project}
          variant="card"
          priority={index === 1}
          className="rounded-none transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <span className="project-index absolute top-4 left-4 bg-paper/90 px-2 py-1 md:top-6 md:left-6">
          {padIndex(index)}
        </span>
      </div>

      <div className="flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between md:p-8">
        <div>
          <p className="text-muted text-xs tracking-wide uppercase">{project.domain}</p>
          <h3 className="font-display mt-1 text-2xl md:text-3xl">{project.title}</h3>
          <p className="text-muted mt-2 max-w-xl text-sm leading-relaxed">{project.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="border-rule border px-2.5 py-0.5 text-[11px] text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3 md:justify-end">
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
