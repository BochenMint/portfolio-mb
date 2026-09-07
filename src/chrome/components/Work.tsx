import { ProjectImage } from '../../components/ProjectImage'
import { useLocale } from '../i18n/context'
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
  const { t: c, content } = useLocale()
  const projects = content.projects
  const flagship = projects.find((p) => p.flagship) ?? projects[0]
  const rest = projects.filter((p) => p !== flagship)

  return (
    <section id="realizacje" className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow={c.work.eyebrow} title={c.work.title} lead={c.work.lead} />

        {/* Flagship: full-width horizontal mirror card */}
        <ChromeCard
          as="article"
          data-card
          tone="light"
          className="mt-14 grid gap-6 p-4 md:p-6 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-10"
        >
          <div className="bezel">
            <ProjectImage project={flagship} variant="hero" priority className="aspect-[16/10]" />
          </div>
          <div className="flex flex-col gap-6 p-2 md:p-4 lg:pr-6">
            <div>
              <p className="font-mono text-[11px] tracking-[0.18em] text-ink/50 uppercase">
                {flagship.domain} · {c.work.flagshipBadge}
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-ink md:text-4xl">
                {flagship.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/70 md:text-base">
                {flagship.description}
              </p>
            </div>
            <Tags tags={flagship.tags} light />
            <div className="border-t border-ink/15" />
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-display text-4xl font-semibold tracking-[-0.04em] text-ink">
                  {flagship.stat.value}
                </p>
                <p className="mt-1 text-[13px] text-ink/60">{flagship.stat.label}</p>
              </div>
              {flagship.url !== '#' && (
                <a
                  href={flagship.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ghost-btn border-ink/20 px-5 py-2.5 text-[13px] text-ink hover:border-ink/50 hover:bg-ink/5"
                >
                  {c.work.openDomainLabel} {flagship.domain}
                  <Arrow />
                </a>
              )}
            </div>
          </div>
        </ChromeCard>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
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
                    {c.work.openLabel}
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
