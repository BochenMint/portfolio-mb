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
            className="border-rule group w-[min(340px,42vw)] shrink-0 overflow-hidden border bg-surface transition-[transform,border-color,box-shadow] duration-400 hover:-translate-y-2 hover:border-[var(--color-glow)] hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-glow)_40%,transparent),0_16px_48px_-16px_color-mix(in_srgb,var(--color-glow)_25%,transparent)]"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <ProjectImage
                project={project}
                variant="card"
                className="rounded-none transition-transform duration-700 group-hover:scale-[1.08]"
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
