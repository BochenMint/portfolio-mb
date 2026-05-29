import { useEffect, useRef, useState } from 'react'
import type { Project } from '../data/content'
import { projectImageTextureUrl } from '../lib/projectImageUrl'
import {
  DISPLACEMENT_LEVEL,
  type DisplacementLevel,
} from '../webgl/displacementConfig'
import { warnWebGL } from '../webgl/warnWebGL'

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

    const imageUrl = projectImageTextureUrl(project, variant)
    const eventRoot = host.closest('.project-interactive') ?? host

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
          throw new Error('texture not ready after load')
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

        const pointerRect = () => eventRoot.getBoundingClientRect()

        const onMove = (e: Event) => {
          if (!(e instanceof PointerEvent)) return
          const rect = pointerRect()
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

        eventRoot.addEventListener('pointermove', onMove)
        eventRoot.addEventListener('pointerleave', onLeave)

        if (!disposed && activeRun === runId) {
          setStatus('ready')
          onReadyRef.current?.()
        }

        removeListeners = () => {
          ro.disconnect()
          io.disconnect()
          eventRoot.removeEventListener('pointermove', onMove)
          eventRoot.removeEventListener('pointerleave', onLeave)
          effect.stop()
          effect.dispose()
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        warnWebGL(project.id, `init failed (${imageUrl})`, message)
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
      setStatus('idle')
    }
  }, [project, variant, level])

  const isReady = status === 'ready'

  return (
    <div
      ref={hostRef}
      className={`project-webgl pointer-events-auto absolute inset-0 z-[1] overflow-hidden ${className}`}
      aria-hidden={!isReady}
      data-webgl-status={status}
    >
      <canvas
        ref={canvasRef}
        className={`project-webgl__canvas absolute inset-0 h-full w-full touch-none ${
          isReady ? 'block' : 'hidden'
        }`}
        data-webgl-canvas-ready={isReady ? 'true' : 'false'}
        aria-hidden={!isReady}
      />
    </div>
  )
}
