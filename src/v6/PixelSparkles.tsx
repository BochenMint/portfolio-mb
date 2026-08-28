import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from './utils'

const GRID = 4
const PAPER = 'rgba(242, 239, 233,'
const KERMES = 'rgba(156, 31, 51,'

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
  gold: boolean
  field: boolean
}

function snap(n: number) {
  return Math.round(n / GRID) * GRID
}

export function PixelSparkles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = prefersReducedMotion()
    const coarse = window.matchMedia('(pointer: coarse)').matches

    let raf = 0
    let w = 0
    let h = 0
    const pixels: Pixel[] = []
    const mouse = { x: -9999, y: -9999, inside: false }
    let lastTrailX = -9999
    let lastTrailY = -9999

    const fieldCount = coarse ? 90 : 220
    const maxTransient = coarse ? 70 : 160

    const makePixel = (partial: Omit<Pixel, 'homeX' | 'homeY'> & { homeX?: number; homeY?: number }): Pixel => ({
      homeX: partial.homeX ?? partial.x,
      homeY: partial.homeY ?? partial.y,
      ...partial,
    })

    const seedField = () => {
      pixels.length = 0
      const cols = Math.max(8, Math.floor(Math.sqrt(fieldCount * (w / Math.max(h, 1)))))
      const rows = Math.max(6, Math.ceil(fieldCount / cols))
      const gapX = w / cols
      const gapY = h / rows
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (pixels.length >= fieldCount) return
          const x = snap(c * gapX + gapX * 0.35 + Math.random() * gapX * 0.4)
          const y = snap(r * gapY + gapY * 0.25 + Math.random() * gapY * 0.5)
          pixels.push(
            makePixel({
              x,
              y,
              vx: 0,
              vy: 0,
              size: Math.random() > 0.82 ? 4 : 2,
              life: Infinity,
              maxLife: Infinity,
              gold: false,
              field: true,
            }),
          )
        }
      }
    }

    const countTransient = () => pixels.reduce((n, p) => n + (p.field ? 0 : 1), 0)

    const spawnTransient = (x: number, y: number, vx: number, vy: number, extra?: Partial<Pixel>) => {
      if (countTransient() >= maxTransient) return
      const size = extra?.size ?? (Math.random() > 0.7 ? 4 : 2)
      const life = extra?.life ?? 28 + Math.random() * 36
      pixels.push(
        makePixel({
          x: snap(x),
          y: snap(y),
          vx,
          vy,
          size,
          life,
          maxLife: extra?.maxLife ?? life,
          gold: extra?.gold ?? false,
          field: false,
        }),
      )
    }

    const burst = (cx: number, cy: number, amount: number) => {
      for (let i = 0; i < amount; i++) {
        const ang = (i / amount) * Math.PI * 2 + Math.random() * 0.2
        const speed = 1.6 + Math.random() * 4.2
        spawnTransient(cx, cy, Math.cos(ang) * speed, Math.sin(ang) * speed, {
          size: Math.random() > 0.55 ? 4 : 2,
          life: 22 + Math.random() * 28,
          gold: true,
        })
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seedField()
    }

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.inside = true
      if (reduced) return

      const dx = mouse.x - lastTrailX
      const dy = mouse.y - lastTrailY
      if (dx * dx + dy * dy > 36) {
        lastTrailX = mouse.x
        lastTrailY = mouse.y
        const n = coarse ? 1 : 3
        for (let i = 0; i < n; i++) {
          spawnTransient(
            mouse.x + (Math.random() - 0.5) * 10,
            mouse.y + (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 0.8,
            (Math.random() - 0.5) * 0.8,
            { life: 16 + Math.random() * 18, size: 2 },
          )
        }
      }
    }

    const onLeave = () => {
      mouse.inside = false
      mouse.x = -9999
      mouse.y = -9999
    }

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.inside = true
      if (reduced) return

      burst(e.clientX, e.clientY, coarse ? 18 : 32)
      for (const p of pixels) {
        if (!p.field) continue
        const dx = p.x - e.clientX
        const dy = p.y - e.clientY
        const d2 = dx * dx + dy * dy
        if (d2 < 180 * 180 && d2 > 1) {
          const d = Math.sqrt(d2)
          const kick = ((180 - d) / 180) * 6.5
          p.vx += (dx / d) * kick
          p.vy += (dy / d) * kick
        }
      }
    }

    const tick = () => {
      ctx.clearRect(0, 0, w, h)

      const radius = coarse ? 70 : 110
      const radius2 = radius * radius

      for (let i = pixels.length - 1; i >= 0; i--) {
        const p = pixels[i]!

        if (!reduced && p.field && mouse.inside) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < radius2 && d2 > 4) {
            const d = Math.sqrt(d2)
            const force = ((radius - d) / radius) * 1.15
            p.vx += (dx / d) * force
            p.vy += (dy / d) * force
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

        const alpha = p.field
          ? 0.22 + (Math.sin((p.x + p.y) * 0.04) + 1) * 0.12
          : Math.max(0.08, p.life / Math.max(p.maxLife, 1))
        ctx.fillStyle = `${p.gold ? KERMES : PAPER} ${alpha})`
        ctx.fillRect(snap(p.x), snap(p.y), p.size, p.size)
      }

      raf = requestAnimationFrame(tick)
    }

    resize()
    if (reduced) {
      // one static paint
      ctx.clearRect(0, 0, w, h)
      for (const p of pixels) {
        ctx.fillStyle = `${p.gold ? KERMES : PAPER} 0.28)`
        ctx.fillRect(snap(p.x), snap(p.y), p.size, p.size)
      }
    } else {
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="v6-sparkles" aria-hidden />
}
