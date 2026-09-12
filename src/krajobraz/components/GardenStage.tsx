import { useEffect, useRef, useState } from 'react'
import { BrandMark } from '../../chrome/components/BrandMark'
import { site } from '../../chrome/data/content'
import type { GardenHandle } from '../scene/gardenScene'
import { T } from '../scene/timeline'
import './garden.css'

const DEBUG = typeof window !== 'undefined' && window.location.search.includes('debug=1')

type Status = 'loading' | 'live' | 'fallback'

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * The pinned garden. The section is tall; inside it a viewport-high stage
 * sticks while the visitor scrolls through, and the scroll position is the
 * only clock the scene has. Copy over the canvas fades on the same beats
 * (`../scene/timeline.ts`) through two CSS variables, so scrolling never
 * re-renders React.
 */
export function GardenStage() {
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
    const outro = outroRef.current
    if (!section || !stage || !canvas || !outro) return
    let disposed = false
    let handle: GardenHandle | null = null
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
      const intro = clamp01((T.introOut - p) / (T.introOut - T.introHold))
      const outroA = clamp01((p - T.outro[0]) / (T.outro[1] - T.outro[0]))
      stage.style.setProperty('--p', p.toFixed(4))
      stage.style.setProperty('--intro', intro.toFixed(3))
      stage.style.setProperty('--outro', outroA.toFixed(3))
      // Only what can be clicked needs a discrete state: a faded-out button
      // must neither catch taps nor take keyboard focus.
      const next = outroA > 0.6 ? 'outro' : intro > 0.4 ? 'intro' : 'mid'
      if (next !== phase) {
        phase = next
        stage.dataset.phase = next
        outro.inert = next !== 'outro'
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
        const { createGardenScene } = await import('../scene/gardenScene')
        const h = await createGardenScene(canvas, { reduced, coarse })
        if (disposed) {
          h.dispose()
          return
        }
        handle = h
        h.setProgress(progress())
        h.setVisible(onScreen)
        setStatus('live')
        if (DEBUG) (window as unknown as { __garden?: unknown }).__garden = h.debug
      } catch (err) {
        if (import.meta.env.DEV) console.warn('[garden] WebGL scene unavailable, showing the still', err)
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
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="ogrod"
      aria-labelledby="garden-title"
      className={`garden ${still ? 'garden--still' : ''}`}
    >
      <div ref={stageRef} className="garden-stage" data-status={status} data-phase="intro">
        <canvas ref={canvasRef} className="garden-canvas" aria-hidden />
        <div className="garden-vignette" aria-hidden />

        <header className="garden-bar">
          <a href="https://marcinbochenek.com/" className="garden-brand">
            <BrandMark size={26} />
            <span>Marcin Bochenek</span>
          </a>
          <a href="#kontakt" className="garden-bar-link">
            Kontakt
          </a>
        </header>

        {/* The real headline, for everything that cannot see flowers. The
            bed on the canvas is the same sentence, set in the same face. */}
        <h1 id="garden-title" className={status === 'fallback' ? 'garden-still-title' : 'sr-only'}>
          Zbuduję nową stronę dla Twojej pracowni architektury krajobrazu
        </h1>

        <div className="garden-intro">
          <p className="eyebrow garden-eyebrow">Dla pracowni architektury krajobrazu</p>
          <p className="garden-intro-title">Najpierw przygotujmy teren.</p>
          <p className="garden-intro-hint">
            <span className="garden-cue" aria-hidden />
            Przewiń — rozłożę trawnik
          </p>
        </div>

        <div ref={outroRef} className="garden-outro">
          <p className="garden-outro-line">
            Strona dla Twojej pracowni: realizacje, oferta i&nbsp;zapytania od klientów w&nbsp;jednym miejscu.
          </p>
          <div className="garden-outro-actions">
            <a href="#kontakt" className="cta-red garden-outro-cta">
              Porozmawiajmy
            </a>
            <a href={`mailto:${site.email}`} className="garden-outro-mail">
              {site.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
