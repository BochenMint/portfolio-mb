import { ProjectImage } from '../../components/ProjectImage'
import { projects } from '../../data/content'
import { chromeCopy as c } from '../copy'
import { Arrow, ChromeCard, SectionHeader } from './primitives'

function Tags({ tags, light }: { tags: string[]; light?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className={`rounded-full border px-3 py-1 text-[11px] ${
            light ? 'border-ink/15 text-ink/60' : 'border-line text-silver-2'
          }`}
        >
          {tag}
        </li>
      ))}
    </ul>
  )
}

export function Work() {
  const flagship = projects.find((p) => p.flagship) ?? projects[0]
  const rest = projects.filter((p) => p !== flagship)

  return (
    <section id="realizacje" className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow={c.work.eyebrow} title={c.work.title} lead={c.work.lead} />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          <ChromeCard
            as="article"
            data-card
            tone="light"
            className="flex flex-col gap-6 p-6 md:p-8 lg:col-span-2"
          >
            <div className="bezel">
              <ProjectImage project={flagship} variant="hero" priority className="aspect-[16/10]" />
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-[11px] tracking-[0.18em] text-ink/50 uppercase">
                  {flagship.domain}
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-ink md:text-3xl">
                  {flagship.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/70 md:text-base">
                  {flagship.tagline}
                </p>
              </div>
              <div className="shrink-0 text-left md:text-right">
                <p className="font-display text-3xl font-semibold tracking-[-0.03em] text-ink">
                  {flagship.stat.value}
                </p>
                <p className="mt-1 text-[13px] text-ink/60">{flagship.stat.label}</p>
              </div>
            </div>
            <Tags tags={flagship.tags} light />
            {flagship.url !== '#' && (
              <a
                href={flagship.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ghost-btn w-fit border-ink/15 px-5 py-2.5 text-[13px] text-ink"
              >
                Otwórz
                <Arrow />
              </a>
            )}
          </ChromeCard>

          {rest.map((project) => (
            <ChromeCard
              key={project.id}
              as="article"
              data-card
              tone="dark"
              className="flex flex-col gap-5 p-6"
            >
              <div className="bezel">
                <ProjectImage project={project} variant="card" className="aspect-[16/10]" />
              </div>
              <div>
                <p className="font-mono text-[11px] tracking-[0.18em] text-silver-2 uppercase">
                  {project.domain}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-white">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-silver-2">{project.tagline}</p>
              </div>
              <Tags tags={project.tags} />
              <div className="hairline" />
              <div className="flex items-end justify-between">
                <div>
                  <p className="chrome-text font-display text-3xl font-semibold tracking-[-0.03em]">
                    {project.stat.value}
                  </p>
                  <p className="mt-1 text-[13px] text-muted">{project.stat.label}</p>
                </div>
                {project.url !== '#' && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ghost-btn px-4 py-2 text-[13px]"
                  >
                    Otwórz
                    <Arrow />
                  </a>
                )}
              </div>
            </ChromeCard>
          ))}
        </div>
      </div>
    </section>
  )
}
