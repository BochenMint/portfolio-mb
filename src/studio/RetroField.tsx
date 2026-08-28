import { useEffect, useRef } from 'react'
import { useTheme } from './ThemeContext'

/** Sunset + vanishing-point grid. This is the floor the retro UI stands on. */
export function RetroField() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (theme !== 'retro') return
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
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const tick = () => {
      t += reduced ? 0 : 0.008
      const sky = ctx.createLinearGradient(0, 0, 0, h)
      sky.addColorStop(0, '#1a0a18')
      sky.addColorStop(0.35, '#3a1028')
      sky.addColorStop(0.52, '#c45a18')
      sky.addColorStop(0.58, '#ffb24a')
      sky.addColorStop(0.62, '#140c08')
      sky.addColorStop(1, '#080604')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, w, h)

      const horizon = h * 0.58
      const cx = w * 0.5
      const sunR = Math.min(w, h) * 0.16
      const sun = ctx.createRadialGradient(cx, horizon - sunR * 0.15, 0, cx, horizon - sunR * 0.15, sunR)
      sun.addColorStop(0, '#fff4c8')
      sun.addColorStop(0.45, '#ff8a20')
      sun.addColorStop(1, 'rgba(255,80,0,0)')
      ctx.fillStyle = sun
      ctx.beginPath()
      ctx.arc(cx, horizon - sunR * 0.2, sunR, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#080604'
      ctx.fillRect(0, horizon, w, h - horizon)

      ctx.save()
      ctx.beginPath()
      ctx.rect(0, horizon, w, h - horizon)
      ctx.clip()
      ctx.strokeStyle = 'rgba(255, 120, 40, 0.55)'
      ctx.lineWidth = 1
      const shift = reduced ? 0 : (t * 28) % 28
      for (let i = 0; i < 18; i++) {
        const y = horizon + i * i * 3.2 + shift
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }
      for (let i = -16; i <= 16; i++) {
        ctx.beginPath()
        ctx.moveTo(cx, horizon)
        ctx.lineTo(cx + i * (w * 0.09), h + 40)
        ctx.stroke()
      }
      ctx.restore()

      ctx.fillStyle = 'rgba(255, 90, 20, 0.12)'
      ctx.fillRect(0, horizon - 2, w, 4)

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

  if (theme !== 'retro') return null
  return <canvas ref={canvasRef} className="studio-retro-field" aria-hidden />
}
