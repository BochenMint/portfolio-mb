import { useEffect, useRef, useState } from 'react'
import type { Project } from '../data/content'
import { projectImageUrl } from '../lib/projectImageUrl'
import type { DisplacementEffect } from '../webgl/createDisplacementEffect'
import {
  DISPLACEMENT_LEVEL,
  type DisplacementLevel,
} from '../webgl/displacementConfig'

type Props = {
  project: Project
  variant?: 'hero' | 'card'
  level: DisplacementLevel
  className?: string
  onFallback?: () => void
}

export function ProjectImageWebGL({
  project,
  variant = 'card',
  level,
  className = '',
  onFallback,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const effectRef = useRef<DisplacementEffect | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas || failed) return

    let disposed = false
    let removeListeners: (() => void) | undefined

    const imageUrl = projectImageUrl(project, variant)
    const options = DISPLACEMENT_LEVEL[level]

    void (async () => {
      try {
        const { createDisplacementEffect } = await import('../webgl/createDisplacementEffect')
        if (disposed) return

        const effect = await createDisplacementEffect(canvas, imageUrl, options)
        effectRef.current = effect
        if (disposed) {
          effect.dispose()
          effectRef.current = null
          return
        }

        const resize = () => {
          const rect = root.getBoundingClientRect()
          effect.setSize(Math.round(rect.width), Math.round(rect.height))
        }

        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(root)

        const introStart = performance.now()
        const introDuration = 1400

        const onMove = (e: MouseEvent) => {
          const rect = root.getBoundingClientRect()
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
        io.observe(root)
        effect.start()

        const introTick = () => {
          if (disposed) return
          const t = Math.min(1, (performance.now() - introStart) / introDuration)
          effect.setIntroProgress(t)
          if (t < 1) requestAnimationFrame(introTick)
        }
        introTick()

        root.addEventListener('mousemove', onMove)
        root.addEventListener('mouseleave', onLeave)

        removeListeners = () => {
          ro.disconnect()
          io.disconnect()
          root.removeEventListener('mousemove', onMove)
          root.removeEventListener('mouseleave', onLeave)
          effect.stop()
          effect.dispose()
          effectRef.current = null
        }
      } catch {
        if (!disposed) {
          setFailed(true)
          onFallback?.()
        }
      }
    })()

    return () => {
      disposed = true
      removeListeners?.()
      effectRef.current?.stop()
      effectRef.current?.dispose()
      effectRef.current = null
    }
  }, [project, variant, level, failed, onFallback])

  if (failed) return null

  const alt = `${project.title} — ${project.tagline}`

  return (
    <div
      ref={rootRef}
      className={`project-webgl relative h-full w-full overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
        aria-label={alt}
        role="img"
      />
    </div>
  )
}
