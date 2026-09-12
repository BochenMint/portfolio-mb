import { useEffect, useRef, useState } from 'react'
import { useLocale } from '../i18n/context'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { CarSceneHandle } from '../underhood/carScene'
import { supportsWebGL } from '../webgl'

/** Same switch the section uses; only the screenshot harness turns it on. */
const DEBUG = typeof window !== 'undefined' && window.location.search.includes('debug=1')

/** Degrees an arrow key turns the car. Matches one notch of a comfortable drag. */
const KEY_STEP_DEG = 15
/** Length of the poster → canvas crossfade, in milliseconds. */
const FADE_MS = 320

/**
 * The hero's chrome object: the assembled Formula 1 car, as real geometry
 * rather than a picture of one.
 *
 * It is the same scene the "Pod maską" section takes apart further down the
 * page — same manifest, same materials, same module-level geometry cache — so
 * the hero doubles as the preload for it.
 *
 * Here it does not move at all. It sits at a front three-quarter view and
 * stays there until the visitor grabs it, exactly like the project cubes
 * (Marcin 2026-09: "niech bolid sam z siebie się nie rusza"). The chrome still
 * reads as chrome because the reflections are real; they just wait for a hand
 * to travel across the panels instead of doing it unprompted. Nothing renders
 * between drags, so a still hero costs no GPU at all.
 *
 * Falls back to the pre-rendered still when WebGL is missing, the context is
 * lost, or the visitor asked for reduced motion. That still is rendered from
 * this very scene at this very angle (see `debug.snapshot`), so the handover
 * is a crossfade between two identical pictures rather than a jump.
 */
export function HeroObject() {
  const { t: c } = useLocale()
  const reduced = useReducedMotion()
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const handleRef = useRef<CarSceneHandle | null>(null)
  /** The scene has drawn its first frame; start the crossfade. */
  const [live, setLive] = useState(false)
  /** The crossfade has finished; the poster can leave the DOM. */
  const [posterGone, setPosterGone] = useState(false)
  /** No WebGL, reduced motion, or a lost context: the poster is all there is. */
  const [posterOnly, setPosterOnly] = useState(true)

  useEffect(() => {
    if (reduced || !supportsWebGL()) return
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return

    let disposed = false
    let handle: CarSceneHandle | null = null
    let idleHandle: number | null = null

    const ro = new ResizeObserver(() => handle?.resize())
    const onLost = () => {
      setLive(false)
      setPosterGone(false)
      setPosterOnly(true)
    }

    const boot = async () => {
      const { createCarScene } = await import('../underhood/carScene')
      if (disposed) return
      handle = await createCarScene(canvas, host, { mode: 'hero', reduced })
      if (disposed) {
        handle.dispose()
        return
      }
      handleRef.current = handle
      ro.observe(host)
      canvas.addEventListener('carscene:lost', onLost)
      setPosterOnly(false)
      // Two frames, not one: the canvas has to have been painted at opacity 0
      // once before the transition to 1 has anything to interpolate from.
      requestAnimationFrame(() => requestAnimationFrame(() => setLive(true)))
      if (DEBUG) {
        ;(window as unknown as { __hero?: unknown }).__hero = {
          ready: true,
          setCamera: (
            az: number | null,
            el: number | null,
            opts?: { dist?: number; target?: [number, number, number] },
          ) => handle?.debug.setCamera(az, el, opts),
          render: () => handle?.debug.render(),
          metrics: () => handle?.debug.metrics(),
          rotateBy: (az: number, el: number) => handle?.rotateBy(az, el),
          snapshot: (w?: number, h?: number) => handle?.debug.snapshot(w, h),
        }
      }
    }

    // The hero renders behind a poster (see below) until this resolves, so
    // deferring it costs nothing visually — but the model + Draco fetches it
    // kicks off used to start within milliseconds of navigation, competing
    // with the LCP headline text for bandwidth on every load. Waiting for the
    // page's own `load` event, then one idle turn, moves that cost off the
    // critical path without changing the handover itself.
    const schedule = () => {
      if (typeof window.requestIdleCallback === 'function') {
        idleHandle = window.requestIdleCallback(() => void boot(), { timeout: 1500 })
      } else {
        idleHandle = window.setTimeout(() => void boot(), 150)
      }
    }
    if (document.readyState === 'complete') {
      schedule()
    } else {
      window.addEventListener('load', schedule, { once: true })
    }

    return () => {
      disposed = true
      window.removeEventListener('load', schedule)
      if (idleHandle !== null) {
        if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleHandle)
        else window.clearTimeout(idleHandle)
      }
      handleRef.current = null
      ro.disconnect()
      canvas.removeEventListener('carscene:lost', onLost)
      handle?.dispose()
    }
  }, [reduced])

  // Retire the poster only once it has finished fading, so the canvas is never
  // alone on screen at partial opacity.
  useEffect(() => {
    if (!live) return
    const id = window.setTimeout(() => setPosterGone(true), FADE_MS + 40)
    return () => window.clearTimeout(id)
  }, [live])

  const showPoster = posterOnly || !posterGone

  return (
    <div
      ref={hostRef}
      data-hero-object
      className="relative aspect-[16/10] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/50 lg:aspect-[7/5]"
      role="img"
      aria-label={c.hero.objectLabel}
      tabIndex={0}
      onKeyDown={(e) => {
        const h = handleRef.current
        if (!h) return
        // Arrows only. No wheel handler anywhere: the page's scroll belongs to
        // the page, and a hero that swallowed it would be a trap.
        if (e.key === 'ArrowLeft') h.rotateBy(-KEY_STEP_DEG, 0)
        else if (e.key === 'ArrowRight') h.rotateBy(KEY_STEP_DEG, 0)
        else if (e.key === 'ArrowUp') h.rotateBy(0, KEY_STEP_DEG)
        else if (e.key === 'ArrowDown') h.rotateBy(0, -KEY_STEP_DEG)
        else return
        e.preventDefault()
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 h-full w-full"
        style={{
          display: posterOnly ? 'none' : 'block',
          opacity: live ? 1 : 0,
          transition: `opacity ${FADE_MS}ms ease-out`,
        }}
      />
      {showPoster && (
        <img
          src="/chrome/f1-hero.webp"
          srcSet="/chrome/f1-hero-960.webp 960w, /chrome/f1-hero.webp 1920w"
          sizes="(min-width: 1024px) 50vw, 92vw"
          width={1920}
          height={1200}
          alt=""
          fetchPriority="high"
          decoding="async"
          // Both layers sit in the same box so the crossfade happens in place.
          // No drop shadow on the poster any more: the canvas has none, and a
          // shadow that vanished mid-fade would be exactly the jump this whole
          // arrangement exists to avoid.
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
          style={{ opacity: live ? 0 : 1, transition: `opacity ${FADE_MS}ms ease-out` }}
        />
      )}
    </div>
  )
}
