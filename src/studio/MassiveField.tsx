import { useEffect, useRef } from 'react'
import { fit2dCanvas, pointerOnElement } from '../lib/pointerSurface'
import { useTheme } from './ThemeContext'

/** Deep space field: parallax stars and nebula only — no radar HUD. */
export function MassiveField() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (theme !== 'massive') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let w = 0
    let h = 0
    const mouse = { x: 0.5, y: 0.5 }
    const stars = Array.from({ length: reduced ? 140 : 480 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.08 + Math.random() * 0.92,
      s: 0.4 + Math.random() * 1.6,
    }))

    const resize = () => {
      const size = fit2dCanvas(canvas, ctx, 2)
      w = size.w
      h = size.h
    }

    const onMove = (e: PointerEvent) => {
      const p = pointerOnElement(e.clientX, e.clientY, canvas)
      mouse.x = p.nx
      mouse.y = p.ny
    }

    const tick = () => {
      ctx.fillStyle = '#020308'
      ctx.fillRect(0, 0, w, h)

      const neb = ctx.createRadialGradient(w * 0.72, h * 0.2, 0, w * 0.72, h * 0.2, w * 0.55)
      neb.addColorStop(0, 'rgba(201,162,39,0.12)')
      neb.addColorStop(0.35, 'rgba(40,70,140,0.14)')
      neb.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = neb
      ctx.fillRect(0, 0, w, h)

      const ox = (mouse.x - 0.5) * 48
      const oy = (mouse.y - 0.5) * 32
      for (const star of stars) {
        const x = star.x * w + ox * star.z
        const y = star.y * h + oy * star.z
        ctx.fillStyle = `rgba(220, 236, 255, ${0.12 + star.z * 0.75})`
        ctx.fillRect(x, y, star.s, star.s)
      }

      if (!reduced) raf = requestAnimationFrame(tick)
    }

    resize()
    tick()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [theme])

  if (theme !== 'massive') return null
  return <canvas ref={canvasRef} className="studio-massive-field" aria-hidden />
}
