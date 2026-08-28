import { useRef, useState } from 'react'
import { projects, sections } from '../../i18n/live'
import { gsap, useGSAP } from '../../animation/gsap'
import { CaseStudyOverlay } from '../CaseStudyOverlay'
import { ProjectShowcaseMedia } from './ProjectShowcaseMedia'

// ─── Parallax + deal-in hook ───────────────────────────────────────────────

function useShowcaseParallax(containerRef: React.RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      // Respect reduced motion
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) return

      const ctx = gsap.context(() => {
        // 1. Card deal-in: y 40→0, opacity 0→1
        const cards = gsap.utils.toArray<HTMLElement>('.v3-stack-card-anim')
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            },
          )
        })

        // 2. Image parallax — primary vs secondary layers at different depths
        const images = gsap.utils.toArray<HTMLElement>('.v3-parallax-img')
        images.forEach((img) => {
          const card = img.closest('.v3-stack-card-anim')
          const isSecondary = img.classList.contains('v3-parallax-img--secondary')
          const range = isSecondary ? 14 : 7
          gsap.fromTo(
            img,
            { yPercent: -range },
            {
              yPercent: range,
              ease: 'none',
              scrollTrigger: {
                trigger: card ?? img,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        })
      }, containerRef)

      return () => ctx.revert()
    },
    { scope: containerRef, dependencies: [] },
  )
}

// ─── Component ─────────────────────────────────────────────────────────────

export function Showcase() {
  const sectionRef = useRef<HTMLElement>(null)
  useShowcaseParallax(sectionRef)

  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([])
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null)

  const openCaseStudy = (i: number) => {
    activeTriggerRef.current = triggerRefs.current[i]
    setOpenIndex(i)
  }

  return (
    <section
      ref={sectionRef}
      id="realizacje"
      className="mx-auto max-w-6xl px-5 py-24 md:py-32 md:px-8"
    >
      {/* Section header */}
      <div className="mb-16 md:mb-20">
        <p className="v3-label mb-4">01 / Realizacje</p>
        <h2 className="v3-display text-[clamp(2rem,5vw,3.5rem)] text-balance mb-5">
          Systemy w{' '}
          <em className="v3-serif-accent">produkcji</em>
        </h2>
        <p className="text-muted max-w-2xl text-base leading-relaxed">
          {sections.work.lead}
        </p>
      </div>

      {/* Sticky-stack deck */}
      <div className="relative">
        {projects.map((project, i) => {
          const isLive = project.url.startsWith('http')
          const statusLabel =
            isLive
              ? null
              : project.id === 'idrive'
                ? 'Przed publicznym startem'
                : 'System wewnętrzny'
          const isLast = i === projects.length - 1
          const metric = projectMetrics[project.id]

          return (
            <div
              key={project.id}
              className={['v3-stack-card v3-stack-card-anim', isLast ? 'mb-0' : 'mb-10'].join(' ')}
              style={{
                top: `calc(11vh + ${i * 26}px)`,
                minHeight: '74vh',
                zIndex: 10 + i,
                // Start invisible; GSAP will animate in (CSS reveal class removed)
                opacity: 0,
              }}
            >
              {/* Card grid: content left, media right */}
              <div className="grid md:grid-cols-[1.05fr_1.3fr] h-full">
                {/* Mobile: multi-shot strip */}
                <div className="relative block md:hidden px-5 pt-5 pb-2">
                  <ProjectShowcaseMedia project={project} />
                </div>

                {/* Left: content */}
                <div className="flex flex-col justify-between p-8 md:p-12">
                  <div>
                    {/* Top row: index label + badges */}
                    <div className="flex items-center gap-3 mb-5">
                      <span className="v3-label">A00{i + 1}</span>
                      {project.flagship && (
                        <span className="v3-pill bg-accent text-[var(--color-ink)] border-accent text-[10px] py-0.5 px-3">
                          FLAGSHIP
                        </span>
                      )}
                      {isLive ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="v3-pill text-[10px] py-0.5 px-3 hover:border-accent transition-colors"
                        >
                          <span className="v3-pill-dot" aria-hidden />
                          LIVE ↗
                        </a>
                      ) : (
                        <span className="v3-pill text-[10px] py-0.5 px-3 opacity-50">
                          {statusLabel}
                        </span>
                      )}
                      <button
                        ref={(el) => {
                          triggerRefs.current[i] = el
                        }}
                        type="button"
                        onClick={() => openCaseStudy(i)}
                        className="v3-cs-trigger ml-auto"
                      >
                        Case study +
                      </button>
                    </div>

                    {/* Tagline */}
                    <p className="v3-mono text-accent text-[11px] uppercase tracking-widest mb-3">
                      {project.tagline}
                    </p>

                    {/* Title */}
                    <h3 className="v3-display text-3xl md:text-4xl mb-6">{project.title}</h3>

                    {/* Key metric */}
                    <div className="mb-4">
                      <span className="v3-metric text-2xl md:text-3xl block">{metric}</span>
                      <p className="text-muted text-sm mt-1 leading-snug">{project.outcome}</p>
                    </div>

                    {/* Decisions */}
                    <ul className="flex flex-col gap-2 mt-6 mb-6">
                      {project.decisions.map((d) => (
                        <li key={d} className="flex gap-2 text-sm text-muted leading-snug">
                          <span className="text-accent font-medium shrink-0">—</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="v3-mono text-[10px] border border-[var(--v3-line-bright)] rounded-full px-2.5 py-1 text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom CTA */}
                  {isLive && (
                    <div className="mt-8">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-soft inline-flex items-center gap-2"
                      >
                        Zobacz na żywo ↗
                      </a>
                    </div>
                  )}
                </div>

                {/* Right: layered multi-shot media (desktop) */}
                <div className="relative hidden md:block overflow-hidden" style={{ minHeight: 320 }}>
                  <ProjectShowcaseMedia project={project} className="absolute inset-0" />
                  <div className="v3-media-gradient absolute inset-0 z-[4] pointer-events-none" aria-hidden />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {openIndex !== null && (
        <CaseStudyOverlay
          projects={projects}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={(i) => setOpenIndex(i)}
          triggerRef={activeTriggerRef}
        />
      )}
    </section>
  )
}

// ─── Data ──────────────────────────────────────────────────────────────────

const projectMetrics: Record<string, string> = {
  mint: '10–15% taniej niż Booking.com',
  plumm: '12–20 h/mies. mniej',
  idrive: 'Szybsza publikacja + SEO',
  agentic: '5–10 h/tydz. mniej',
}
