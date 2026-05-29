import { projects } from '../data/content'
import type { Project } from '../data/content'
import { ProjectImage } from './ProjectImage'
import { WorkStrip } from './WorkStrip'

function padIndex(n: number) {
  return String(n).padStart(2, '0')
}

export function Work() {
  return (
    <section id="work" data-section className="section-pad bg-paper-bright border-t border-rule">
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="section-label">
          Selected work
        </p>
        <h2 data-reveal className="font-headline mt-3 text-4xl leading-[0.95] md:text-6xl">
          Recent work
        </h2>

        <WorkStrip />

        <ul className="mt-14 grid gap-6 md:gap-8">
          {projects.map((project, index) => (
            <li key={project.id}>
              <ProjectCard project={project} index={index + 1} />
              {index < projects.length - 1 ? (
                <div data-reveal className="flex justify-end border-b border-rule py-6 md:py-8">
                  <a
                    href={`#work-${projects[index + 1].id}`}
                    className="project-next"
                  >
                    Next project
                    <span className="text-accent text-lg leading-none" aria-hidden>
                      →
                    </span>
                  </a>
                </div>
              ) : null}
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
      className="group border-rule scroll-mt-28 overflow-hidden border bg-surface md:scroll-mt-32"
    >
      <div className="relative aspect-[16/9] overflow-hidden md:aspect-[21/9]">
        <ProjectImage
          project={project}
          variant="card"
          priority={index === 1}
          className="rounded-none transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="project-index absolute top-5 left-5 px-2.5 py-1 md:top-8 md:left-8">
          {padIndex(index)}
        </span>
      </div>

      <div className="flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between md:p-10">
        <div>
          <p className="text-muted text-xs font-semibold tracking-[0.14em] uppercase">
            {project.domain}
          </p>
          <h3 className="font-headline mt-2 text-2xl normal-case md:text-4xl">{project.title}</h3>
          <p className="text-muted mt-3 max-w-xl text-sm leading-relaxed md:text-base">
            {project.tagline}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="border-rule border px-2.5 py-0.5 text-[11px] font-medium text-muted transition-colors group-hover:border-accent/50 group-hover:text-ink"
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
