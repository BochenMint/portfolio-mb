import { useEffect, useRef } from 'react'
import { useTheme } from './ThemeContext'

/** Aurora ribbons + operator grid. Distinct from Massive (space) and Glass (orbs). */
export function V2Field() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (theme !== 'v2') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let w = 0
    let h = 0
    let t = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const tick = () => {
      t += reduced ? 0 : 0.01
      ctx.fillStyle = '#07090f'
      ctx.fillRect(0, 0, w, h)

      ctx.strokeStyle = 'rgba(90, 160, 255, 0.07)'
      ctx.lineWidth = 1
      const step = 48
      for (let x = 0; x < w; x += step) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      ctx.globalCompositeOperation = 'lighter'
      const ribbons = [
        { y: 0.22, amp: 48, c: 'rgba(80, 120, 255, 0.22)', w: 90 },
        { y: 0.38, amp: 36, c: 'rgba(40, 220, 255, 0.18)', w: 70 },
        { y: 0.58, amp: 54, c: 'rgba(140, 80, 255, 0.16)', w: 110 },
      ]
      for (let r = 0; r < ribbons.length; r++) {
        const rib = ribbons[r]!
        ctx.beginPath()
        for (let x = 0; x <= w; x += 6) {
          const y =
            h * rib.y +
            Math.sin(x * 0.004 + t * 1.4 + r) * rib.amp +
            Math.sin(x * 0.01 - t * 0.8 + r * 2) * (rib.amp * 0.35)
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = rib.c
        ctx.lineWidth = rib.w
        ctx.lineCap = 'round'
        ctx.stroke()
      }
      ctx.globalCompositeOperation = 'source-over'

      const vg = ctx.createRadialGradient(w * 0.5, h * 0.4, 80, w * 0.5, h * 0.4, Math.max(w, h) * 0.75)
      vg.addColorStop(0, 'rgba(0,0,0,0)')
      vg.addColorStop(1, 'rgba(4,6,12,0.55)')
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, w, h)

      if (!reduced) raf = requestAnimationFrame(tick)
    }

    resize()
    tick()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [theme])

  if (theme !== 'v2') return null
  return <canvas ref={canvasRef} className="studio-v2-field" aria-hidden />
}
