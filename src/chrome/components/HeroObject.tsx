import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { CarSceneHandle } from '../underhood/carScene'
import { supportsWebGL } from '../webgl'

/** Same switch the section uses; only the screenshot harness turns it on. */
const DEBUG = typeof window !== 'undefined' && window.location.search.includes('debug=1')

/**
 * The hero's chrome object: the assembled Formula 1 car, as real geometry
 * rather than a picture of one.
 *
 * It is the same scene the "Pod maską" section takes apart further down the
 * page — same manifest, same materials, same module-level geometry cache — so
 * the hero doubles as the preload for it. Here it only turns: a slow auto-yaw
 * plus a few degrees of pointer lean, which is what makes the surface read as
 * metal (the highlights travel across the panels instead of sliding with the
 * element, the way the old flat still did).
 *
 * Falls back to the pre-rendered still when WebGL is missing, the context is
 * lost, or the visitor asked for reduced motion.
 */
export function HeroObject() {
  const reduced = useReducedMotion()
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fallback, setFallback] = useState(true)

  useEffect(() => {
    // `fallback` already starts true, so the still is what shows until the
    // scene reports itself ready.
    if (reduced || !supportsWebGL()) return
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return

    let disposed = false
    let handle: CarSceneHandle | null = null

    const ro = new ResizeObserver(() => handle?.resize())
    const onLost = () => setFallback(true)

    void (async () => {
      const { createCarScene } = await import('../underhood/carScene')
      if (disposed) return
      handle = await createCarScene(canvas, host, { mode: 'hero', reduced })
      if (disposed) {
        handle.dispose()
        return
      }
      ro.observe(host)
      canvas.addEventListener('carscene:lost', onLost)
      setFallback(false)
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
        }
      }
    })()

    return () => {
      disposed = true
      ro.disconnect()
      canvas.removeEventListener('carscene:lost', onLost)
      handle?.dispose()
    }
  }, [reduced])

  return (
    <div ref={hostRef} data-hero-object className="relative aspect-[16/10] lg:aspect-[7/5]">
      <canvas
        ref={canvasRef}
        aria-hidden
        className="h-full w-full"
        style={{ display: fallback ? 'none' : 'block' }}
      />
      {fallback && (
        <img
          src="/chrome/f1-hero.webp"
          srcSet="/chrome/f1-hero-960.webp 960w, /chrome/f1-hero.webp 1920w"
          sizes="(min-width: 1024px) 50vw, 92vw"
          width={1920}
          height={1200}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.7)]"
        />
      )}
    </div>
  )
}
