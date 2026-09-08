import { useEffect, useRef, useState } from 'react'
import { useCoarsePointer } from '../hooks/useCoarsePointer'
import { useReducedMotion } from '../hooks/useReducedMotion'
import type { HangarShipScene } from './hangarShipScene'

function scheduleAfterPaint(fn: () => void, coarse: boolean): () => void {
  if (!coarse) {
    const id = window.requestAnimationFrame(() => fn())
    return () => cancelAnimationFrame(id)
  }
  const ric = window.requestIdleCallback
  if (typeof ric === 'function') {
    const idleId = ric(() => fn(), { timeout: 1800 })
    return () => window.cancelIdleCallback(idleId)
  }
  const t = window.setTimeout(fn, 480)
  return () => clearTimeout(t)
}

/** Same game hull, hangar-only canvas — no gra.html iframe / HUD. */
export function HangarShipPreview({ loadingLabel }: { loadingLabel: string }) {
  const reduced = useReducedMotion()
  const coarse = useCoarsePointer()
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [allowGl, setAllowGl] = useState(false)
  const [showPlaceholder, setShowPlaceholder] = useState(true)

  useEffect(() => scheduleAfterPaint(() => setAllowGl(true), coarse), [coarse])

  useEffect(() => {
    if (!allowGl) return
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return

    let disposed = false
    let scene: HangarShipScene | undefined
    let ro: ResizeObserver | undefined
    let io: IntersectionObserver | undefined

    void import('./hangarShipScene').then(async ({ createHangarShipScene }) => {
      if (disposed) return
      try {
        scene = await createHangarShipScene(canvas, {
          reducedMotion: reduced,
          lowPower: coarse,
        })
      } catch {
        if (!disposed) setShowPlaceholder(true)
        return
      }
      if (disposed) {
        scene.dispose()
        return
      }

      if (!scene.hullReady) {
        scene.dispose()
        setShowPlaceholder(true)
        return
      }

      const resize = () => {
        const rect = host.getBoundingClientRect()
        scene?.setSize(Math.round(rect.width), Math.round(rect.height))
      }
      resize()
      ro = new ResizeObserver(resize)
      ro.observe(host)

      io = new IntersectionObserver(
        ([entry]) => {
          if (!scene) return
          if (entry.isIntersecting) scene.start()
          else scene.stop()
        },
        { threshold: 0.08 },
      )
      io.observe(host)
      setShowPlaceholder(false)
    })

    return () => {
      disposed = true
      ro?.disconnect()
      io?.disconnect()
      scene?.stop()
      scene?.dispose()
    }
  }, [allowGl, coarse, reduced])

  return (
    <div ref={hostRef} className="studio-hangar-ship-host">
      {allowGl ? <canvas ref={canvasRef} className="studio-hangar-ship-canvas" aria-hidden /> : null}
      {showPlaceholder ? <p className="studio-hangar-ship-wait">{loadingLabel}</p> : null}
    </div>
  )
}
