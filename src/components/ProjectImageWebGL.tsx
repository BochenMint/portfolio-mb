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
  const hostRef = useRef<HTMLDivElement>(null)
  const effectRef = useRef<DisplacementEffect | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host || failed) return

    let disposed = false
    let canvas: HTMLCanvasElement | null = null
    let removeListeners: (() => void) | undefined

    const disposeEffect = () => {
      removeListeners?.()
      removeListeners = undefined
      effectRef.current = null
    }

    const imageUrl = projectImageUrl(project, variant)
    const options = DISPLACEMENT_LEVEL[level]
    const alt = `${project.title} — ${project.tagline}`

    host.replaceChildren()
    canvas = document.createElement('canvas')
    canvas.className = 'absolute inset-0 h-full w-full touch-none'
    canvas.setAttribute('aria-label', alt)
    canvas.setAttribute('role', 'img')
    host.appendChild(canvas)

    void (async () => {
      try {
        const { createDisplacementEffect } = await import('../webgl/createDisplacementEffect')
        if (disposed || !canvas) return

        const effect = await createDisplacementEffect(canvas, imageUrl, options)
        if (disposed) {
          effect.dispose()
          return
        }

        effectRef.current = effect

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
          if (disposed) return
          const t = Math.min(1, (performance.now() - introStart) / introDuration)
          effect.setIntroProgress(t)
          if (t < 1) requestAnimationFrame(introTick)
        }
        introTick()

        host.addEventListener('mousemove', onMove)
        host.addEventListener('mouseleave', onLeave)

        removeListeners = () => {
          ro.disconnect()
          io.disconnect()
          host.removeEventListener('mousemove', onMove)
          host.removeEventListener('mouseleave', onLeave)
          effect.stop()
          effect.dispose()
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
      disposeEffect()
      if (host.isConnected) {
        host.replaceChildren()
      }
      canvas = null
    }
  }, [project, variant, level, failed, onFallback])

  if (failed) return null

  return (
    <div
      ref={hostRef}
      className={`project-webgl relative h-full w-full overflow-hidden ${className}`}
    />
  )
}
