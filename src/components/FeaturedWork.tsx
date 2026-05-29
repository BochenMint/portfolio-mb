import { projects } from '../data/content'
import type { Project } from '../data/content'
import { ProjectImageInteractive } from './ProjectImageInteractive'
import { ProjectMarquee } from './ProjectMarquee'
import { SectionIntro } from './SectionIntro'

function padIndex(n: number) {
  return String(n).padStart(2, '0')
}

export function FeaturedWork() {
  return (
    <section id="work" data-section className="border-t border-[var(--color-paper)]/15">
      <div className="section-pad mx-auto max-w-6xl">
        <SectionIntro
          num="03"
          title="Wybrane realizacje"
          lead="Cztery produkty w produkcji — hospitality, FinTech, media i automatyzacja agentów."
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

  return (
    <article
      id={`project-${project.id}`}
      data-featured-project
      className="scroll-mt-28 border-t border-[var(--color-paper)]/12 md:scroll-mt-32"
    >
      <a
        href={hasLiveSite ? project.url : '#contact'}
        target={hasLiveSite ? '_blank' : undefined}
        rel={hasLiveSite ? 'noopener noreferrer' : undefined}
        className="group block"
        data-featured-visual
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-paper)]/5 md:aspect-[21/9]">
          <ProjectImageInteractive
            project={project}
            variant="hero"
            priority={index === 1}
            interaction={project.flagship ? 'hero' : 'strong'}
            className="h-[108%] max-w-none"
          />
          <span className="absolute top-4 left-4 z-10 border border-[var(--color-paper)]/30 bg-[var(--color-ink)]/80 px-3 py-1 font-mono text-[11px] tracking-widest text-[var(--color-paper)] uppercase backdrop-blur-sm md:top-6 md:left-6">
            {padIndex(index)}
          </span>
        </div>
      </a>

      <div className="section-pad mx-auto grid max-w-6xl gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p data-reveal className="text-muted text-xs tracking-[0.14em] uppercase">
            {project.domain}
          </p>
          <h3
            data-reveal
            className="font-headline mt-2 text-[clamp(1.75rem,4vw,3rem)] leading-tight"
          >
            {project.title}
          </h3>
          <p data-reveal className="text-muted mt-3 max-w-xl text-sm leading-relaxed md:text-base">
            {project.tagline}
          </p>
        </div>
        {hasLiveSite ? (
          <div data-reveal>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fill text-xs"
            >
              {project.domain}
              <span aria-hidden>↗</span>
            </a>
          </div>
        ) : null}
      </div>
    </article>
  )
}
