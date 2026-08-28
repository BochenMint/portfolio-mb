import { useEffect, useRef } from 'react'
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
          { x: 0.18, y: 0.12, r: 0.42, c: [180, 210, 255], a: 0.55 },
          { x: 0.82, y: 0.22, r: 0.38, c: [255, 255, 255], a: 0.5 },
          { x: 0.55, y: 0.78, r: 0.48, c: [160, 190, 255], a: 0.45 },
          { x: 0.08, y: 0.72, r: 0.32, c: [210, 230, 255], a: 0.4 },
        ]
      : [
          { x: 0.2, y: 0.15, r: 0.46, c: [90, 40, 220], a: 0.7 },
          { x: 0.85, y: 0.2, r: 0.4, c: [20, 180, 255], a: 0.65 },
          { x: 0.7, y: 0.85, r: 0.5, c: [220, 40, 140], a: 0.55 },
          { x: 0.1, y: 0.75, r: 0.36, c: [40, 90, 255], a: 0.6 },
          { x: 0.5, y: 0.45, r: 0.28, c: [255, 120, 80], a: 0.35 },
        ]

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX / Math.max(w, 1)
      mouse.y = e.clientY / Math.max(h, 1)
    }

    const tick = () => {
      t += reduced ? 0 : 0.0045
      ctx.clearRect(0, 0, w, h)
      if (liquid) {
        ctx.fillStyle = '#d5e3f4'
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
          { x: 0.78, y: 0.18, rx: 0.31, ry: 0.105, rotation: -0.34, alpha: 0.16 },
          { x: 0.16, y: 0.62, rx: 0.38, ry: 0.13, rotation: 0.42, alpha: 0.11 },
          { x: 0.68, y: 0.78, rx: 0.3, ry: 0.09, rotation: 0.16, alpha: 0.1 },
        ]

        caustics.forEach((c, i) => {
          const drift = reduced ? 0 : Math.sin(t * (0.72 + i * 0.11) + i * 1.7)
          const cx = (c.x + drift * 0.018 + (mouse.x - 0.5) * 0.012) * w
          const cy = (c.y + drift * 0.012 + (mouse.y - 0.5) * 0.008) * h
          const rx = c.rx * Math.max(w, 720)
          const ry = c.ry * Math.max(h, 720)
          ctx.save()
          ctx.translate(cx, cy)
          ctx.rotate(c.rotation + drift * 0.035)
          ctx.scale(1, ry / rx)
          const light = ctx.createRadialGradient(0, 0, rx * 0.08, 0, 0, rx)
          light.addColorStop(0, `rgba(255,255,255,${c.alpha})`)
          light.addColorStop(0.46, `rgba(235,246,255,${c.alpha * 0.58})`)
          light.addColorStop(0.78, `rgba(185,215,255,${c.alpha * 0.16})`)
          light.addColorStop(1, 'rgba(185,215,255,0)')
          ctx.fillStyle = light
          ctx.beginPath()
          ctx.arc(0, 0, rx, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        })

        const sx = mouse.x * w
        const sy = mouse.y * h
        const specular = ctx.createRadialGradient(sx, sy, 0, sx, sy, Math.min(240, w * 0.22))
        specular.addColorStop(0, 'rgba(255,255,255,0.2)')
        specular.addColorStop(0.32, 'rgba(255,255,255,0.08)')
        specular.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = specular
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
