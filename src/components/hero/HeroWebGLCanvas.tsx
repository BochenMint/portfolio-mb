import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { HeroScene } from '../../webgl/hero/heroSceneTypes'
import { warnWebGL } from '../../webgl/warnWebGL'

type HeroWebGLCanvasProps = {
  className?: string
  createScene: (canvas: HTMLCanvasElement) => Promise<HeroScene>
  fallback?: ReactNode
  /**
   * Pause the scene's render loop (scene.stop()/start()) via IntersectionObserver
   * when the host scrolls out of view — avoids burning GPU on off-screen canvases
   * (e.g. deck cards far down the page, or a card behind the case-study overlay).
   */
  pauseWhenOffscreen?: boolean
}

export function HeroWebGLCanvas({
  className = '',
  createScene,
  fallback = null,
  pauseWhenOffscreen = false,
}: HeroWebGLCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas || failed) return

    let disposed = false
    let scene: HeroScene | undefined
    let ro: ResizeObserver | undefined
    let io: IntersectionObserver | undefined

    void (async () => {
      try {
        scene = await createScene(canvas)
        if (disposed) {
          scene.dispose()
          return
        }

        const resize = () => {
          const rect = host.getBoundingClientRect()
          scene?.setSize(Math.round(rect.width), Math.round(rect.height))
        }
        resize()
        ro = new ResizeObserver(resize)
        ro.observe(host)
        scene.start()
        if (!disposed) setReady(true)

        if (pauseWhenOffscreen) {
          io = new IntersectionObserver(
            ([entry]) => {
              if (!scene) return
              if (entry.isIntersecting) scene.start()
              else scene.stop()
            },
            { threshold: 0 },
          )
          io.observe(host)
        }
      } catch (err) {
        warnWebGL('hero-webgl', err instanceof Error ? err.message : String(err))
        if (!disposed) setFailed(true)
      }
    })()

    return () => {
      disposed = true
      setReady(false)
      ro?.disconnect()
      io?.disconnect()
      scene?.stop()
      scene?.dispose()
    }
  }, [createScene, failed, pauseWhenOffscreen])

  if (failed) {
    return <div className={className}>{fallback}</div>
  }

  return (
    <div ref={hostRef} className={`hero-webgl-host ${className}`}>
      <canvas
        ref={canvasRef}
        className="hero-webgl-canvas absolute inset-0 z-[1] h-full w-full"
        aria-hidden
      />
      {!ready && fallback ? (
        <div className="absolute inset-0 z-0">{fallback}</div>
      ) : null}
    </div>
  )
}
