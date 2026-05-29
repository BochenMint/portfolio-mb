import { projects } from '../data/content'
import { ProjectImage } from './ProjectImage'

const stripProjects = projects.filter((p) => p.url.startsWith('http'))

export function WorkStrip() {
  if (stripProjects.length === 0) return null

  return (
    <div data-work-pin className="mt-12 hidden lg:block">
      <div
        data-work-track
        data-reveal
        className="work-strip flex gap-5 overflow-visible pb-2"
        aria-label="Szybki podgląd projektów"
      >
        {stripProjects.map((project) => (
          <a
            key={project.id}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            data-strip-card
            className="border-rule group w-[320px] shrink-0 overflow-hidden border bg-surface transition-[transform,border-color] duration-400 hover:-translate-y-2 hover:border-accent"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <ProjectImage
                project={project}
                variant="card"
                className="rounded-none transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <p className="p-4 text-xs font-bold tracking-[0.12em] uppercase">
              {project.domain}
              <span className="text-accent ml-2 inline-block transition-transform group-hover:translate-x-1" aria-hidden>
                ↗
              </span>
            </p>
          </a>
        ))}
      </div>
    </div>
  )
}
