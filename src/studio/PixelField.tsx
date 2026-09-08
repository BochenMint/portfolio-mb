import { useEffect, useRef } from 'react'
import { fit2dCanvas, pointerOnElement } from '../lib/pointerSurface'
import { useTheme } from './useTheme'

type Pixel = {
  x: number
  y: number
  homeX: number
  homeY: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  field: boolean
  accent: boolean
}

const GRID = 4
const PAPER = 'rgba(242, 239, 233,'
const KERMES = 'rgba(156, 31, 51,'

function snap(n: number) {
  return Math.round(n / GRID) * GRID
}

export function PixelField() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (theme !== 'pixel') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    let raf = 0
    let w = 0
    let h = 0
    const pixels: Pixel[] = []
    const mouse = { x: -9999, y: -9999, inside: false }
    let lastX = -9999
    let lastY = -9999
    const fieldCount = coarse ? 80 : 200
    const maxTransient = coarse ? 60 : 140

    const transients = () => pixels.reduce((n, p) => n + (p.field ? 0 : 1), 0)

    const spawn = (x: number, y: number, vx: number, vy: number, accent: boolean, life: number) => {
      if (transients() >= maxTransient) return
      pixels.push({
        x: snap(x),
        y: snap(y),
        homeX: snap(x),
        homeY: snap(y),
        vx,
        vy,
        size: Math.random() > 0.7 ? 4 : 2,
        life,
        maxLife: life,
        field: false,
        accent,
      })
    }

    const seed = () => {
      pixels.length = 0
      const cols = Math.max(8, Math.floor(Math.sqrt(fieldCount * (w / Math.max(h, 1)))))
      const rows = Math.max(6, Math.ceil(fieldCount / cols))
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (pixels.length >= fieldCount) return
          const x = snap((c + 0.3 + Math.random() * 0.4) * (w / cols))
          const y = snap((r + 0.2 + Math.random() * 0.5) * (h / rows))
          pixels.push({
            x,
            y,
            homeX: x,
            homeY: y,
            vx: 0,
            vy: 0,
            size: Math.random() > 0.82 ? 4 : 2,
            life: Infinity,
            maxLife: Infinity,
            field: true,
            accent: false,
          })
        }
      }
    }

    const resize = () => {
      const size = fit2dCanvas(canvas, ctx, 2)
      w = size.w
      h = size.h
      seed()
    }

    const onMove = (e: PointerEvent) => {
      const p = pointerOnElement(e.clientX, e.clientY, canvas)
      mouse.x = p.x
      mouse.y = p.y
      mouse.inside = true
      if (reduced) return
      const dx = mouse.x - lastX
      const dy = mouse.y - lastY
      if (dx * dx + dy * dy > 36) {
        lastX = mouse.x
        lastY = mouse.y
        spawn(mouse.x, mouse.y, (Math.random() - 0.5) * 0.7, (Math.random() - 0.5) * 0.7, false, 18)
      }
    }

    const onDown = (e: PointerEvent) => {
      if (reduced) return
      const p = pointerOnElement(e.clientX, e.clientY, canvas)
      for (let i = 0; i < (coarse ? 16 : 28); i++) {
        const ang = (i / 28) * Math.PI * 2
        const sp = 1.8 + Math.random() * 4
        spawn(p.x, p.y, Math.cos(ang) * sp, Math.sin(ang) * sp, true, 26)
      }
    }

    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      const radius = coarse ? 70 : 110
      const r2 = radius * radius
      for (let i = pixels.length - 1; i >= 0; i--) {
        const p = pixels[i]!
        if (!reduced && p.field && mouse.inside) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < r2 && d2 > 4) {
            const d = Math.sqrt(d2)
            const f = ((radius - d) / radius) * 1.1
            p.vx += (dx / d) * f
            p.vy += (dy / d) * f
          }
        }
        if (!reduced) {
          if (p.field) {
            p.vx += (p.homeX - p.x) * 0.018
            p.vy += (p.homeY - p.y) * 0.018
            p.vx *= 0.86
            p.vy *= 0.86
          }
          p.x += p.vx
          p.y += p.vy
        }
        if (!p.field) {
          p.life -= 1
          p.vx *= 0.94
          p.vy *= 0.94
          if (p.life <= 0) {
            pixels.splice(i, 1)
            continue
          }
        }
        const alpha = p.field ? 0.28 : Math.max(0.1, p.life / p.maxLife)
        ctx.fillStyle = `${p.accent ? KERMES : PAPER} ${alpha})`
        ctx.fillRect(snap(p.x), snap(p.y), p.size, p.size)
      }
      raf = requestAnimationFrame(tick)
    }

    resize()
    if (!reduced) raf = requestAnimationFrame(tick)
    else {
      ctx.clearRect(0, 0, w, h)
      for (const p of pixels) {
        ctx.fillStyle = `${PAPER} 0.28)`
        ctx.fillRect(p.x, p.y, p.size, p.size)
      }
    }
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [theme])

  if (theme !== 'pixel') return null
  return <canvas ref={canvasRef} className="studio-pixel-field" aria-hidden />
}
