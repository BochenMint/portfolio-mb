import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { SceneHandle } from './sceneHost'
import { leg, type Window } from './timing'
import './stage.css'

const DEBUG = typeof window !== 'undefined' && window.location.search.includes('debug=1')

type Status = 'loading' | 'live' | 'fallback'

export type ScrollStageProps = {
  /** Section id, e.g. "ogrod" — anchor links and JSON-LD point at this. */
  id: string
  /** Extra class on the section, purely a hook for the landing's own CSS
   *  (its `--stage-*` custom-property values). */
  className: string
  /** window.<name> the live scene handle is exposed as under `?debug=1`. */
  debugHandleName: string
  /** The section's own scroll length (e.g. "480svh"); the still/fallback
   *  state always collapses to one viewport regardless. */
  height: string
  /** Dynamically imported by the caller; three never loads until this runs. */
  createScene: (canvas: HTMLCanvasElement, opts: { reduced: boolean; coarse: boolean }) => Promise<SceneHandle>
  h1: { id: string; text: string }
  brand: { href: string; content: ReactNode }
  contact: { href: string; label: string }
  intro: { eyebrow: string; title: string; hint: string }
  outro: { line: ReactNode; ctaLabel: string; ctaHref: string; mailHref: string; mailLabel: string }
  /** The same beats the scene's own timeline uses, so the overlay copy fades
   *  in and out on the scene's schedule rather than one of its own. */
  timeline: { introHold: number; introOut: number; outro: Window }
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * The pinned stage: a scene that renders into a sticky viewport-high canvas
 * while the section scrolls past behind it, driven purely by scroll
 * progress. Copy over the canvas fades on the caller's own beats through two
 * CSS variables, so scrolling never re-renders React. Generalised out of the
 * garden's own stage so a second trade can mount a different scene on the
 * same rig: everything landing-specific arrives as a prop, everything here —
 * the observers, the fallback, the debug handle, the chrome around the
 * canvas — stays the same for both.
 */
export function ScrollStage({
  id,
  className,
  debugHandleName,
  height,
  createScene,
  h1,
  brand,
  contact,
  intro,
  outro,
  timeline,
}: ScrollStageProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const outroRef = useRef<HTMLDivElement>(null)
  const [reduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [status, setStatus] = useState<Status>('loading')
  const still = reduced || status === 'fallback'

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const canvas = canvasRef.current
    const outroEl = outroRef.current
    if (!section || !stage || !canvas || !outroEl) return
    let disposed = false
    let handle: SceneHandle | null = null
    let phase = ''
    // The observer can report before the scene exists; the scene is told
    // the latest answer once it does.
    let onScreen = true

    const progress = () => {
      if (reduced) return 1
      const rect = section.getBoundingClientRect()
      const span = rect.height - window.innerHeight
      return span > 0 ? clamp01(-rect.top / span) : 1
    }
    const onScroll = () => {
      const p = progress()
      const introFrac = 1 - leg(p, [timeline.introHold, timeline.introOut])
      const outroFrac = leg(p, timeline.outro)
      stage.style.setProperty('--p', p.toFixed(4))
      stage.style.setProperty('--intro', introFrac.toFixed(3))
      stage.style.setProperty('--outro', outroFrac.toFixed(3))
      // Only what can be clicked needs a discrete state: a faded-out button
      // must neither catch taps nor take keyboard focus.
      const next = outroFrac > 0.6 ? 'outro' : introFrac > 0.4 ? 'intro' : 'mid'
      if (next !== phase) {
        phase = next
        stage.dataset.phase = next
        outroEl.inert = next !== 'outro'
      }
      handle?.setProgress(p)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        handle?.setVisible(onScreen)
      },
      { rootMargin: '10% 0px' },
    )
    io.observe(section)
    // The section changes height when it drops to the still version, which
    // moves progress to 1 without any scroll event to say so.
    const ro = new ResizeObserver(() => {
      onScroll()
      handle?.resize()
    })
    ro.observe(stage)
    ro.observe(section)

    const onLost = (e: Event) => {
      e.preventDefault()
      handle?.dispose()
      handle = null
      setStatus('fallback')
    }
    canvas.addEventListener('webglcontextlost', onLost)

    ;(async () => {
      try {
        const coarse = window.matchMedia('(pointer: coarse)').matches
        const h = await createScene(canvas, { reduced, coarse })
        if (disposed) {
          h.dispose()
          return
        }
        handle = h
        h.setProgress(progress())
        h.setVisible(onScreen)
        setStatus('live')
        if (DEBUG) (window as unknown as Record<string, unknown>)[debugHandleName] = h.debug
      } catch (err) {
        if (import.meta.env.DEV) console.warn(`[${debugHandleName}] scene unavailable, showing the still`, err)
        if (!disposed) setStatus('fallback')
      }
    })()

    return () => {
      disposed = true
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      canvas.removeEventListener('webglcontextlost', onLost)
      io.disconnect()
      ro.disconnect()
      handle?.dispose()
    }
  }, [reduced, createScene, debugHandleName, timeline])

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={h1.id}
      className={`stage ${className} ${still ? 'stage--still' : ''}`}
      style={{ '--stage-height': height } as CSSProperties}
    >
      <div ref={stageRef} className="stage-frame" data-status={status} data-phase="intro">
        <canvas ref={canvasRef} className="stage-canvas" aria-hidden />
        <div className="stage-vignette" aria-hidden />

        <header className="stage-bar">
          <a href={brand.href} className="stage-brand">
            {brand.content}
          </a>
          <a href={contact.href} className="stage-bar-link">
            {contact.label}
          </a>
        </header>

        {/* The real headline, for everything that cannot see the scene. */}
        <h1 id={h1.id} className={status === 'fallback' ? 'stage-fallback-title' : 'sr-only'}>
          {h1.text}
        </h1>

        <div className="stage-intro">
          <p className="stage-eyebrow">{intro.eyebrow}</p>
          <p className="stage-intro-title">{intro.title}</p>
          <p className="stage-intro-hint">
            <span className="stage-cue" aria-hidden />
            {intro.hint}
          </p>
        </div>

        <div ref={outroRef} className="stage-outro">
          <p className="stage-outro-line">{outro.line}</p>
          <div className="stage-outro-actions">
            <a href={outro.ctaHref} className="cta-red stage-outro-cta">
              {outro.ctaLabel}
            </a>
            <a href={outro.mailHref} className="stage-outro-mail">
              {outro.mailLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
