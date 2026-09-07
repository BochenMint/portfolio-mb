import type { Project } from '../../data/content'
import { facesFor } from '../../data/faces'
import { headlineFactsFor } from '../../data/facts'
import { useLocale } from '../i18n/context'
import { FactsStrip } from './FactsStrip'
import { ProjectCube } from './ProjectCube'
import { Arrow, LinkButton, SectionHeader } from './primitives'

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag} className="rounded-full border border-line px-3 py-1 text-[11px] text-silver-2">
          {tag}
        </li>
      ))}
    </ul>
  )
}

function ProjectRow({ project, reverse }: { project: Project; reverse: boolean }) {
  const { locale, t: c } = useLocale()
  const faces = facesFor(project.id)
  const hasFacts = headlineFactsFor(project.id).length > 0
  if (faces.length === 0) return null

  return (
    <article
      data-card
      className={`grid items-center gap-10 py-16 first:pt-0 last:pb-0 lg:grid-cols-2 lg:gap-16 ${
        reverse ? 'lg:[&>*:first-child]:order-2' : ''
      }`}
    >
      <div data-reveal>
        <ProjectCube
          projectId={project.id}
          title={project.title}
          faces={faces}
          locale={locale}
          eagerFront={Boolean(project.flagship)}
        />
      </div>

      <div className="flex flex-col gap-6">
        <div data-reveal>
          <p className="eyebrow">
            {project.domain}
            {project.flagship ? ` · ${c.work.flagshipBadge}` : ''}
          </p>
          <h3 className="chrome-text-soft mt-3 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
            {project.title}
          </h3>
          <p className="mt-2 text-sm text-silver-2 md:text-base">{project.tagline}</p>
          <p className="mt-4 line-clamp-3 max-w-lg text-sm leading-relaxed text-muted">
            {project.description}
          </p>
        </div>

        <div data-reveal>
          <Tags tags={project.tags} />
        </div>

        <div data-reveal className="hairline" />

        <div data-reveal>
          {hasFacts ? (
            <FactsStrip projectId={project.id} />
          ) : (
            <div>
              <p className="chrome-text font-display text-3xl font-semibold tracking-[-0.03em]">
                {project.stat.value}
              </p>
              <p className="mt-1 text-[13px] text-muted">{project.stat.label}</p>
            </div>
          )}
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-silver-2">
            {project.metrics.map((metric) => (
              <li key={metric}>{metric}</li>
            ))}
          </ul>
        </div>

        {project.url !== '#' && (
          <div data-reveal>
            <LinkButton href={project.url} target="_blank" rel="noopener noreferrer" size="sm">
              {c.work.openDomainLabel} {project.domain}
              <Arrow />
            </LinkButton>
          </div>
        )}
      </div>
    </article>
  )
}

export function Work() {
  const { t: c, content } = useLocale()
  const projects = content.projects
  const flagship = projects.find((p) => p.flagship) ?? projects[0]
  const ordered = [flagship, ...projects.filter((p) => p !== flagship)]

  return (
    <section id="realizacje" className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow={c.work.eyebrow} title={c.work.title} lead={c.work.lead} />

        <div className="mt-8 divide-y divide-line">
          {ordered.map((project, i) => (
            <ProjectRow key={project.id} project={project} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
