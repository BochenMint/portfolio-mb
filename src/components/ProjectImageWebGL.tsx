import { useEffect, useRef, useState } from 'react'
import type { Project } from '../data/content'
import { projectImageUrl } from '../lib/projectImageUrl'
import {
  DISPLACEMENT_LEVEL,
  type DisplacementLevel,
} from '../webgl/displacementConfig'

export type WebGLStatus = 'idle' | 'loading' | 'ready' | 'failed'

type Props = {
  project: Project
  variant?: 'hero' | 'card'
  level: DisplacementLevel
  className?: string
  onFallback?: () => void
  onReady?: () => void
}

export function ProjectImageWebGL({
  project,
  variant = 'card',
  level,
  className = '',
  onFallback,
  onReady,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasVisible, setCanvasVisible] = useState(false)
  const [status, setStatus] = useState<WebGLStatus>('idle')
  const onFallbackRef = useRef(onFallback)
  const onReadyRef = useRef(onReady)
  onFallbackRef.current = onFallback
  onReadyRef.current = onReady

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return

    let disposed = false
    let removeListeners: (() => void) | undefined
    const runId = Symbol('webgl-run')
    let activeRun: symbol | null = runId

    setStatus('loading')

    const imageUrl = projectImageUrl(project, variant)

    void (async () => {
      try {
        const { createDisplacementEffect } = await import('../webgl/createDisplacementEffect')
        if (disposed || activeRun !== runId) return

        const effect = await createDisplacementEffect(canvas, imageUrl, DISPLACEMENT_LEVEL[level])
        if (disposed || activeRun !== runId) {
          effect.dispose()
          return
        }

        if (!effect.ready) {
          effect.dispose()
          throw new Error('WebGL texture not ready')
        }

        const resize = () => {
          const rect = host.getBoundingClientRect()
          effect.setSize(Math.round(rect.width), Math.round(rect.height))
        }

        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(host)

        const introStart = performance.now()
        const introDuration = 1400

        const onMove = (e: MouseEvent) => {
          const rect = host.getBoundingClientRect()
          if (rect.width < 1 || rect.height < 1) return
          effect.setMouse(
            (e.clientX - rect.left) / rect.width,
            (e.clientY - rect.top) / rect.height,
            true,
          )
        }

        const onLeave = () => {
          effect.setMouse(0.5, 0.5, false)
        }

        const io = new IntersectionObserver(
          (entries) => {
            if (entries[0]?.isIntersecting) effect.start()
            else effect.stop()
          },
          { threshold: 0.08 },
        )
        io.observe(host)
        effect.start()

        const introTick = () => {
          if (disposed || activeRun !== runId) return
          const t = Math.min(1, (performance.now() - introStart) / introDuration)
          effect.setIntroProgress(t)
          if (t < 1) requestAnimationFrame(introTick)
        }
        introTick()

        host.addEventListener('mousemove', onMove)
        host.addEventListener('mouseleave', onLeave)

        if (!disposed && activeRun === runId) {
          setCanvasVisible(true)
          setStatus('ready')
          onReadyRef.current?.()
        }

        removeListeners = () => {
          ro.disconnect()
          io.disconnect()
          host.removeEventListener('mousemove', onMove)
          host.removeEventListener('mouseleave', onLeave)
          effect.stop()
          effect.dispose()
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('[ProjectImageWebGL]', project.id, imageUrl, err)
        }
        if (!disposed && activeRun === runId) {
          setStatus('failed')
          onFallbackRef.current?.()
        }
      }
    })()

    return () => {
      disposed = true
      activeRun = null
      removeListeners?.()
      removeListeners = undefined
      setCanvasVisible(false)
      setStatus('idle')
    }
  }, [project, variant, level])

  return (
    <div
      ref={hostRef}
      className={`project-webgl pointer-events-auto absolute inset-0 z-[1] overflow-hidden ${className}`}
      aria-hidden={!canvasVisible}
      data-webgl-status={status}
    >
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full touch-none transition-opacity duration-500 ${
          canvasVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
