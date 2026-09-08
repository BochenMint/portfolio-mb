import { useEffect, useRef } from 'react'
import { fit2dCanvas, pointerOnElement } from '../lib/pointerSurface'
import { useTheme } from './ThemeContext'

/** Optical light field: dark saturated emitters for Glass, quiet filled caustics for Liquid. */
export function GlassField() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (theme !== 'glass' && theme !== 'liquid') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const liquid = theme === 'liquid'
    let raf = 0
    let w = 0
    let h = 0
    let t = 0
    const mouse = { x: 0.55, y: 0.4 }

    const orbs = liquid
      ? [
          { x: 0.2, y: 0.08, r: 0.48, c: [255, 248, 236], a: 0.55 },
          { x: 0.82, y: 0.12, r: 0.42, c: [196, 218, 238], a: 0.48 },
          { x: 0.58, y: 0.78, r: 0.5, c: [255, 255, 255], a: 0.32 },
          { x: 0.08, y: 0.72, r: 0.4, c: [168, 196, 218], a: 0.4 },
          { x: 0.9, y: 0.82, r: 0.42, c: [255, 226, 196], a: 0.32 },
          { x: 0.38, y: 0.92, r: 0.32, c: [214, 226, 236], a: 0.28 },
        ]
      : [
          { x: 0.2, y: 0.15, r: 0.46, c: [72, 88, 156], a: 0.68 },
          { x: 0.85, y: 0.2, r: 0.4, c: [214, 186, 142], a: 0.55 },
          { x: 0.7, y: 0.85, r: 0.5, c: [156, 72, 108], a: 0.5 },
          { x: 0.1, y: 0.75, r: 0.36, c: [52, 78, 138], a: 0.58 },
          { x: 0.5, y: 0.45, r: 0.28, c: [216, 164, 96], a: 0.32 },
        ]

    const resize = () => {
      const size = fit2dCanvas(canvas, ctx, 1.75)
      w = size.w
      h = size.h
    }

    const onMove = (e: PointerEvent) => {
      const p = pointerOnElement(e.clientX, e.clientY, canvas)
      mouse.x = p.nx
      mouse.y = p.ny
    }

    const tick = () => {
      t += reduced ? 0 : 0.0045
      ctx.clearRect(0, 0, w, h)
      if (liquid) {
        const slate = ctx.createLinearGradient(0, 0, w * 0.12, h)
        slate.addColorStop(0, '#6d8298')
        slate.addColorStop(0.36, '#8ca2b6')
        slate.addColorStop(0.7, '#b4c2d0')
        slate.addColorStop(1, '#c6c1b6')
        ctx.fillStyle = slate
        ctx.fillRect(0, 0, w, h)
        const warm = ctx.createRadialGradient(w * 0.58, h * 1.08, 0, w * 0.58, h * 1.08, h * 0.9)
        warm.addColorStop(0, 'rgba(232, 214, 188, 0.58)')
        warm.addColorStop(1, 'rgba(232, 214, 188, 0)')
        ctx.fillStyle = warm
        ctx.fillRect(0, 0, w, h)
      } else {
        ctx.fillStyle = '#070b16'
        ctx.fillRect(0, 0, w, h)
      }

      for (let i = 0; i < orbs.length; i++) {
        const o = orbs[i]!
        const px = (o.x + Math.sin(t * (1.1 + i * 0.17) + i) * 0.06 + (mouse.x - 0.5) * 0.04) * w
        const py = (o.y + Math.cos(t * (0.9 + i * 0.13) + i) * 0.05 + (mouse.y - 0.5) * 0.03) * h
        const radius = o.r * Math.min(w, h)
        const g = ctx.createRadialGradient(px, py, 0, px, py, radius)
        g.addColorStop(0, `rgba(${o.c[0]},${o.c[1]},${o.c[2]},${o.a})`)
        g.addColorStop(0.45, `rgba(${o.c[0]},${o.c[1]},${o.c[2]},${o.a * 0.35})`)
        g.addColorStop(1, `rgba(${o.c[0]},${o.c[1]},${o.c[2]},0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(px, py, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      if (liquid) {
        ctx.globalCompositeOperation = 'screen'

        const caustics = [
          { x: 0.7, y: 0.12, rx: 0.46, ry: 0.09, rotation: -0.4, alpha: 0.36 },
          { x: 0.26, y: 0.2, rx: 0.3, ry: 0.068, rotation: 0.5, alpha: 0.28 },
          { x: 0.16, y: 0.56, rx: 0.5, ry: 0.11, rotation: 0.26, alpha: 0.24 },
          { x: 0.6, y: 0.46, rx: 0.38, ry: 0.08, rotation: -0.16, alpha: 0.22 },
          { x: 0.76, y: 0.74, rx: 0.42, ry: 0.1, rotation: 0.14, alpha: 0.26 },
          { x: 0.44, y: 0.82, rx: 0.34, ry: 0.07, rotation: -0.5, alpha: 0.2 },
        ]

        caustics.forEach((c, i) => {
          const drift = reduced ? 0 : Math.sin(t * (0.68 + i * 0.1) + i * 1.6)
          const cx = (c.x + drift * 0.016 + (mouse.x - 0.5) * 0.014) * w
          const cy = (c.y + drift * 0.01 + (mouse.y - 0.5) * 0.01) * h
          const rx = c.rx * Math.max(w, 720)
          const ry = c.ry * Math.max(h, 720)
          ctx.save()
          ctx.translate(cx, cy)
          ctx.rotate(c.rotation + drift * 0.03)
          ctx.scale(1, ry / rx)
          const light = ctx.createRadialGradient(0, 0, rx * 0.06, 0, 0, rx)
          light.addColorStop(0, `rgba(255,255,255,${c.alpha})`)
          light.addColorStop(0.4, `rgba(240,248,255,${c.alpha * 0.62})`)
          light.addColorStop(0.72, `rgba(196,220,240,${c.alpha * 0.2})`)
          light.addColorStop(1, 'rgba(196,220,240,0)')
          ctx.fillStyle = light
          ctx.beginPath()
          ctx.arc(0, 0, rx, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        })

        const fringeX = (0.62 + Math.sin(t * 0.55) * 0.02 + (mouse.x - 0.5) * 0.03) * w
        const fringeY = (0.26 + Math.cos(t * 0.48) * 0.016 + (mouse.y - 0.5) * 0.02) * h
        const reach = Math.min(w, h) * 0.24
        const red = ctx.createRadialGradient(fringeX - 7, fringeY, 0, fringeX, fringeY, reach)
        red.addColorStop(0, 'rgba(255, 92, 64, 0.1)')
        red.addColorStop(1, 'rgba(255, 92, 64, 0)')
        ctx.fillStyle = red
        ctx.fillRect(0, 0, w, h)
        const cyan = ctx.createRadialGradient(fringeX + 9, fringeY + 5, 0, fringeX, fringeY, reach)
        cyan.addColorStop(0, 'rgba(64, 148, 255, 0.12)')
        cyan.addColorStop(1, 'rgba(64, 148, 255, 0)')
        ctx.fillStyle = cyan
        ctx.fillRect(0, 0, w, h)

        const sx = mouse.x * w
        const sy = mouse.y * h
        const specular = ctx.createRadialGradient(sx, sy, 0, sx, sy, Math.min(280, w * 0.26))
        specular.addColorStop(0, 'rgba(255,255,255,0.32)')
        specular.addColorStop(0.28, 'rgba(255,255,255,0.1)')
        specular.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = specular
        ctx.fillRect(0, 0, w, h)

        ctx.globalCompositeOperation = 'multiply'
        const vig = ctx.createRadialGradient(
          w * 0.5,
          h * 0.4,
          Math.min(w, h) * 0.22,
          w * 0.5,
          h * 0.48,
          Math.max(w, h) * 0.74,
        )
        vig.addColorStop(0, 'rgba(255,255,255,1)')
        vig.addColorStop(1, 'rgba(148, 162, 176, 1)')
        ctx.fillStyle = vig
        ctx.fillRect(0, 0, w, h)
        ctx.globalCompositeOperation = 'source-over'
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

  if (theme !== 'glass' && theme !== 'liquid') return null
  return <canvas ref={canvasRef} className="studio-glass-field" aria-hidden />
}
