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
  const mountedRef = useRef(true)
  onFallbackRef.current = onFallback
  onReadyRef.current = onReady

  useEffect(() => {
    mountedRef.current = true
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
        const introDuration = 900

        const pointerRect = () => eventRoot.getBoundingClientRect()

        let lastX = 0
        let lastY = 0
        let lastT = 0

        const readNormFromClient = (clientX: number, clientY: number) => {
          const rect = pointerRect()
          if (rect.width < 1 || rect.height < 1) return { x: 0.5, y: 0.5 }
          return {
            x: (clientX - rect.left) / rect.width,
            y: (clientY - rect.top) / rect.height,
          }
        }

        const applyPointer = (clientX: number, clientY: number, active: boolean) => {
          const { x: nx, y: ny } = readNormFromClient(clientX, clientY)
          let speed = 0
          if (active && lastT > 0) {
            const dt = Math.max(8, performance.now() - lastT)
            const dist = Math.hypot(clientX - lastX, clientY - lastY)
            speed = Math.min(3.2, (dist / dt) * 18)
          }
          lastX = clientX
          lastY = clientY
          lastT = performance.now()
          effect.setMouse(nx, ny, active, speed)
        }

        const onMove = (e: Event) => {
          if (!(e instanceof PointerEvent)) return
          applyPointer(e.clientX, e.clientY, true)
        }

        const onLeave = () => {
          const { x, y } = readNormFromClient(lastX, lastY)
          effect.setMouse(x, y, false, 0)
        }

        const io = new IntersectionObserver(
          (entries) => {
            if (entries[0]?.isIntersecting) effect.start()
            else effect.stop()
          },
          { threshold: 0.05, rootMargin: '80px 0px' },
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

        if (!disposed && activeRun === runId && mountedRef.current) {
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
        if (!disposed && activeRun === runId && mountedRef.current) {
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
      if (mountedRef.current) setStatus('idle')
    }
  }, [project, variant, level])

  const isReady = status === 'ready'

  return (
    <div
      ref={hostRef}
      className={`project-webgl pointer-events-auto absolute inset-0 z-[2] overflow-hidden ${className}`}
      aria-hidden={!isReady}
      data-webgl-status={status}
    >
      <canvas
        ref={canvasRef}
        className="project-webgl__canvas absolute inset-0 block h-full w-full touch-none"
        data-webgl-canvas-ready={isReady ? 'true' : 'false'}
        aria-hidden={!isReady}
      />
    </div>
  )
}
