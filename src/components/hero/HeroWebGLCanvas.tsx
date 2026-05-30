import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { HeroScene } from '../../webgl/hero/heroSceneTypes'
import { warnWebGL } from '../../webgl/warnWebGL'

type HeroWebGLCanvasProps = {
  className?: string
  createScene: (canvas: HTMLCanvasElement) => Promise<HeroScene>
  fallback?: ReactNode
}

export function HeroWebGLCanvas({
  className = '',
  createScene,
  fallback = null,
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
      } catch (err) {
        warnWebGL('hero-webgl', err instanceof Error ? err.message : String(err))
        if (!disposed) setFailed(true)
      }
    })()

    return () => {
      disposed = true
      setReady(false)
      ro?.disconnect()
      scene?.stop()
      scene?.dispose()
    }
  }, [createScene, failed])

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
