import { useEffect, useRef } from 'react'
import type { Project } from '../data/content'
import { projectImageTextureUrl } from '../lib/projectImageUrl'
import { galleryForProject } from '../data/gallery'
import { gsap, useGSAP } from '../animation/gsap'
import { AgenticSwarmCanvas } from './AgenticSwarmCanvas'
import './casestudy.css'

type CaseStudyOverlayProps = {
  projects: Project[]
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
  triggerRef: React.RefObject<HTMLElement | null>
}

function lockBodyScroll(lock: boolean) {
  document.body.style.overflow = lock ? 'hidden' : ''
  document.documentElement.style.overflow = lock ? 'hidden' : ''
  // Lenis przechwytuje wheel globalnie — bez stop() kółko przewija stronę pod overlayem.
  const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis
  if (lock) lenis?.stop()
  else lenis?.start()
}

export function CaseStudyOverlay({
  projects,
  index,
  onClose,
  onNavigate,
  triggerRef,
}: CaseStudyOverlayProps) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const total = projects.length
  const project = projects[index]

  const prevIndex = (index - 1 + total) % total
  const nextIndex = (index + 1) % total

  // Lock scroll while open, restore + return focus on close.
  useEffect(() => {
    lockBodyScroll(true)
    return () => {
      lockBodyScroll(false)
      triggerRef.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Escape to close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Focus the close button on open (and whenever project changes via prev/next).
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => closeBtnRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [project.id])

  // Reset scroll position to top when switching project via prev/next.
  useEffect(() => {
    backdropRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }, [project.id])

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const backdrop = backdropRef.current
      if (!backdrop) return

      if (prefersReduced) {
        gsap.set(backdrop, { opacity: 1 })
        gsap.set('.v3-cs-column', { y: 0 })
        gsap.set('.v3-cs-anim', { opacity: 1, y: 0 })
        return
      }

      const ctx = gsap.context(() => {
        gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power3.out' })
        gsap.fromTo(
          '.v3-cs-column',
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        )
        gsap.fromTo(
          '.v3-cs-anim',
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.06,
            delay: 0.08,
          },
        )
      }, backdrop)

      return () => ctx.revert()
    },
    { dependencies: [project.id] },
  )

  const isLive = project.url.startsWith('http')
  const indexLabel = `A00${index + 1}`
  const gallery = galleryForProject(project.id)

  return (
    <div
      ref={backdropRef}
      className="v3-cs-backdrop"
      data-lenis-prevent
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button
        ref={closeBtnRef}
        type="button"
        onClick={onClose}
        aria-label="Zamknij case study"
        className="v3-cs-close"
      >
        ✕
      </button>

      <div className="v3-cs-scroll">
        <div
          className="v3-cs-column"
          role="dialog"
          aria-modal="true"
          aria-label={`Case study: ${project.title}`}
        >
          {/* Header */}
          <div className="v3-cs-anim mb-8">
            <p className="v3-label mb-4">{indexLabel} / Case study</p>
            <h2 className="v3-display text-[clamp(2.25rem,6vw,4rem)] text-balance mb-3">
              {project.title}
            </h2>
            <p className="v3-serif-accent text-xl md:text-2xl mb-5">{project.domain}</p>
            {isLive && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="v3-cs-trigger"
              >
                Otwórz stronę ↗
              </a>
            )}
          </div>

          {/* Hero image */}
          <div className="v3-cs-anim v3-cs-hero-media mb-2">
            {project.id === 'agentic' ? (
              <AgenticSwarmCanvas
                className="block w-full aspect-video"
                imgProps={{
                  src: projectImageTextureUrl(project, 'hero'),
                  alt: project.title,
                  loading: 'lazy',
                }}
              />
            ) : (
              <img
                src={projectImageTextureUrl(project, 'hero')}
                alt={project.title}
                loading="lazy"
              />
            )}
          </div>

          {/* Problem */}
          <section className="v3-cs-anim v3-cs-section">
            <p className="v3-label mb-4">Problem</p>
            <p className="text-lg leading-relaxed text-muted max-w-2xl">{project.pain}</p>
          </section>

          {/* Co zbudowałem */}
          <section className="v3-cs-anim v3-cs-section">
            <p className="v3-label mb-4">Co zbudowałem</p>
            <p className="text-lg leading-relaxed text-muted max-w-2xl">
              {project.contribution}
            </p>
          </section>

          {/* Jak to działa */}
          {project.howItWorks && project.howItWorks.length > 0 && (
            <section className="v3-cs-anim v3-cs-section">
              <p className="v3-label mb-4">Jak to działa</p>
              <ol className="v3-cs-decision-list">
                {project.howItWorks.map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="v3-cs-decision-num">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base leading-relaxed text-muted">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Kluczowe decyzje */}
          <section className="v3-cs-anim v3-cs-section">
            <p className="v3-label mb-4">Kluczowe decyzje</p>
            <ol className="v3-cs-decision-list">
              {project.decisions.map((decision, i) => (
                <li key={decision} className="flex gap-4">
                  <span className="v3-cs-decision-num">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-base leading-relaxed text-muted">{decision}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Stack i integracje */}
          {project.stack && project.stack.length > 0 && (
            <section className="v3-cs-anim v3-cs-section">
              <p className="v3-label mb-4">Stack i integracje</p>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span
                    key={item}
                    className="v3-mono text-[10px] border border-accent/40 rounded-full px-2.5 py-1 text-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Efekt — strongest visual weight */}
          <section className="v3-cs-anim v3-cs-section">
            <p className="v3-label mb-4">Efekt</p>
            <div className="v3-card v3-cs-outcome-panel">
              <p className="v3-display text-[clamp(1.5rem,3.5vw,2.25rem)] text-balance">
                {project.outcome}
              </p>
            </div>
          </section>

          {/* Z produkcji — verified production screenshots, editorial stack */}
          {gallery.length > 0 && (
            <section className="v3-cs-anim v3-cs-section">
              <p className="v3-label mb-4">Z produkcji</p>
              <div className="v3-cs-gallery">
                {gallery.map((shot) => (
                  <figure key={shot.src} className="v3-cs-gallery-item">
                    <img
                      src={shot.src}
                      srcSet={`${shot.srcSmall} 1200w, ${shot.src} 2400w`}
                      sizes="(min-width: 896px) 896px, 100vw"
                      width={shot.width}
                      height={shot.height}
                      alt={shot.caption}
                      loading="lazy"
                      className="v3-cs-gallery-img"
                    />
                    <figcaption className="v3-cs-gallery-caption">{shot.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          {/* Tags */}
          <div className="v3-cs-anim flex flex-wrap gap-2 mt-8">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="v3-mono text-[10px] border border-[var(--v3-line-bright)] rounded-full px-2.5 py-1 text-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Prev / next navigation */}
          <nav className="v3-cs-nav" aria-label="Nawigacja między projektami">
            <button
              type="button"
              className="v3-cs-nav-btn v3-cs-nav-btn--prev"
              onClick={() => onNavigate(prevIndex)}
            >
              <span className="v3-mono text-[10px] uppercase tracking-widest text-muted">
                ← A00{prevIndex + 1}
              </span>
              <span className="v3-display text-lg">{projects[prevIndex].title}</span>
            </button>
            <button
              type="button"
              className="v3-cs-nav-btn v3-cs-nav-btn--next"
              onClick={() => onNavigate(nextIndex)}
            >
              <span className="v3-mono text-[10px] uppercase tracking-widest text-muted">
                A00{nextIndex + 1} →
              </span>
              <span className="v3-display text-lg">{projects[nextIndex].title}</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}
