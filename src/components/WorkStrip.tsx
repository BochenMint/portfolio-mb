import { projects } from '../data/content'
import { ProjectImage } from './ProjectImage'

const stripProjects = projects.filter((p) => p.url.startsWith('http'))

export function WorkStrip() {
  if (stripProjects.length === 0) return null

  return (
    <div
      data-reveal
      className="work-strip mt-10 hidden gap-4 overflow-x-auto pb-2 lg:flex"
      aria-label="Szybki podgląd projektów"
    >
      {stripProjects.map((project) => (
        <a
          key={project.id}
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="border-rule group w-[280px] shrink-0 overflow-hidden border bg-surface transition-transform hover:-translate-y-1"
        >
          <div className="aspect-[16/10] overflow-hidden">
            <ProjectImage
              project={project}
              variant="card"
              className="rounded-none transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <p className="p-3 text-xs font-medium tracking-wide uppercase">
            {project.domain}
            <span className="text-accent ml-1" aria-hidden>
              ↗
            </span>
          </p>
        </a>
      ))}
    </div>
  )
}
