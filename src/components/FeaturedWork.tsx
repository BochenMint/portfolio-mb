import type { CSSProperties } from 'react'
import { projects, sections } from '../data/content'
import type { Project } from '../data/content'
import { textureCoverForProject } from '../lib/featuredMediaFill'
import { ProjectImageInteractive } from './ProjectImageInteractive'
import { ProjectMarquee } from './ProjectMarquee'
import { SectionIntro } from './SectionIntro'

function padIndex(n: number) {
  return String(n).padStart(2, '0')
}

export function FeaturedWork() {
  return (
    <section
      id="work"
      data-section
      className="w-full overflow-visible border-t border-[var(--color-paper)]/15 bg-[linear-gradient(180deg,rgba(236,234,228,0.018),rgba(8,8,7,0))]"
    >
      <div className="section-pad mx-auto max-w-6xl">
        <SectionIntro
          num={sections.work.num}
          title={sections.work.title}
          lead={sections.work.lead}
        />
      </div>

      <ProjectMarquee />

      <div className="space-y-0">
        {projects.map((project, index) => (
          <FeaturedProject key={project.id} project={project} index={index + 1} />
        ))}
      </div>
    </section>
  )
}

function FeaturedProject({ project, index }: { project: Project; index: number }) {
  const hasLiveSite = project.url.startsWith('http')
  const heroFill = textureCoverForProject(project, 'hero')
  const heroFillStyle = {
    ['--featured-texture-center-y' as string]: `${(1 - heroFill.centerY) * 100}%`,
    ...(heroFill.zoom > 1
      ? { ['--featured-texture-zoom' as string]: heroFill.zoom }
      : {}),
  } as CSSProperties

  return (
    <article
      id={`project-${project.id}`}
      data-featured-project
      className="scroll-mt-28 border-t border-[var(--color-paper)]/12 md:scroll-mt-32"
    >
      {/* Media block — keeps WebGL/displacement logic intact */}
      <a
        href={hasLiveSite ? project.url : '#contact'}
        target={hasLiveSite ? '_blank' : undefined}
        rel={hasLiveSite ? 'noopener noreferrer' : undefined}
        className="group block max-w-none"
        tabIndex={-1}
        aria-hidden
      >
        <div
          data-featured-visual
          data-hero-media-fill={heroFill.zoom > 1 ? '' : undefined}
          style={heroFillStyle}
          className="bleed-full project-card-media relative aspect-[16/9] overflow-hidden border-y border-[var(--color-paper)]/12 bg-[var(--color-paper)]/5 md:aspect-auto md:min-h-[70vh] lg:min-h-[72vh]"
        >
          <ProjectImageInteractive
            project={project}
            variant="hero"
            priority={index === 1}
            interaction={project.flagship ? 'hero' : 'strong'}
            className="absolute inset-0 h-full w-full"
          />
          {/* Index badge */}
          <span className="pointer-events-none absolute top-4 left-4 z-10 rounded-full border border-[var(--color-paper)]/30 bg-[var(--color-ink)]/80 px-3 py-1 font-mono text-[11px] tracking-widest text-[var(--color-paper)] uppercase backdrop-blur-sm md:top-6 md:left-6">
            {padIndex(index)}
          </span>
          {/* Flagship badge */}
          {project.flagship ? (
            <span className="pointer-events-none absolute top-4 right-4 z-10 rounded-full bg-accent px-3 py-1 font-mono text-[10px] font-semibold tracking-widest text-[var(--color-ink)] uppercase md:top-6 md:right-6">
              Flagship
            </span>
          ) : null}
          {/* Live-site pill on media */}
          {hasLiveSite ? (
            <span className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-ink)]/70 px-3 py-1 font-mono text-[10px] tracking-widest text-accent backdrop-blur-sm md:bottom-6 md:left-6">
              LIVE ↗
            </span>
          ) : (
            <span className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-full border border-[var(--color-paper)]/20 bg-[var(--color-ink)]/70 px-3 py-1 font-mono text-[10px] tracking-widest text-[var(--color-paper)]/50 backdrop-blur-sm md:bottom-6 md:left-6">
              system wewnętrzny
            </span>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/3 bg-gradient-to-t from-[var(--color-ink)]/80 to-transparent" aria-hidden />
        </div>
      </a>

      {/* Case-study copy block */}
      <div className="section-pad mx-auto max-w-6xl">
        <div className="rounded-[1.8rem] border border-[var(--color-paper)]/12 bg-[var(--color-paper)]/[0.025] p-5 md:p-8">
        {/* Header row: title + live link */}
        <div data-reveal className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-accent uppercase">
              {project.tagline}
            </p>
            <h3 className="font-headline mt-2 text-[clamp(1.75rem,4vw,3rem)] leading-tight">
              {project.title}
            </h3>
            <p className="text-muted mt-1 text-xs tracking-[0.12em] uppercase">{project.domain}</p>
          </div>
          {hasLiveSite ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/livelink mt-1 inline-flex shrink-0 items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/16 hover:text-accent-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            >
              Zobacz na żywo
              <span aria-hidden className="inline-block transition-transform duration-200 group-hover/livelink:translate-x-0.5">↗</span>
            </a>
          ) : null}
        </div>

        {/* Pain → Outcome */}
        <div data-reveal className="mt-8 grid gap-3 md:grid-cols-2">
          <div className="rounded-[1.35rem] border border-[var(--color-paper)]/10 bg-[var(--color-ink)]/40 p-5">
            <p className="font-mono text-[10px] tracking-[0.14em] text-[var(--color-paper)]/40 uppercase">
              Problem
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-paper)]/70">
              {project.pain}
            </p>
          </div>
          <div className="rounded-[1.35rem] border border-accent/18 bg-accent/[0.045] p-5">
            <p className="font-mono text-[10px] tracking-[0.14em] text-[var(--color-paper)]/40 uppercase">
              Efekt
            </p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--color-paper)]/90">
              {project.outcome}
            </p>
          </div>
        </div>

        {/* Decisions list */}
        <div data-reveal className="mt-8 rounded-[1.35rem] border border-[var(--color-paper)]/10 bg-[var(--color-ink)]/30 p-5">
          <p className="font-mono text-[10px] tracking-[0.14em] text-[var(--color-paper)]/40 uppercase">
            Kluczowe decyzje
          </p>
          <ul className="mt-3 space-y-2">
            {project.decisions.map((decision) => (
              <li key={decision} className="flex items-start gap-3 text-sm leading-relaxed">
                <span className="mt-px shrink-0 font-mono text-accent" aria-hidden>
                  —
                </span>
                <span className="text-[var(--color-paper)]/80">{decision}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tags + CTA row */}
        <div data-reveal className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--color-paper)]/15 px-2.5 py-1 text-[10px] font-mono tracking-[0.1em] text-[var(--color-paper)]/50 uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
          {hasLiveSite ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fill rounded-full text-xs"
            >
              {project.domain}
              <span aria-hidden>↗</span>
            </a>
          ) : null}
        </div>
        </div>
      </div>
    </article>
  )
}
