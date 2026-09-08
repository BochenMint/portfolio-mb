import { useEffect, useRef, type RefObject } from 'react'
import { site } from '../../i18n/live'
import { ctaHref, isExternalCta, prefersReducedMotion } from '../utils'
import { useMagneticCta } from '../useVoltMotion'

function TimeSparksCanvas({ canvasRef }: { canvasRef: RefObject<HTMLCanvasElement | null> }) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || prefersReducedMotion()) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0

    type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number }
    const sparks: Spark[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const spawn = () => {
      if (sparks.length > 48) return
      sparks.push({
        x: Math.random() * w,
        y: h * 0.55 + Math.random() * h * 0.35,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.4 - Math.random() * 1.2,
        life: 0,
        max: 40 + Math.random() * 60,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      if (Math.random() < 0.35) spawn()

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]!
        s.x += s.vx
        s.y += s.vy
        s.life++
        const t = s.life / s.max
        const alpha = 1 - t
        ctx.beginPath()
        ctx.fillStyle = `rgba(184, 240, 0, ${alpha * 0.85})`
        ctx.arc(s.x, s.y, 1.2 + t * 2, 0, Math.PI * 2)
        ctx.fill()
        if (s.life >= s.max) sparks.splice(i, 1)
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [canvasRef])

  return null
}

export function HeroV5() {
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useMagneticCta(ctaRef)

  const href = ctaHref(site.calendly)
  const external = isExternalCta(site.calendly)

  return (
    <section id="volt-hero" className="volt-hero" aria-label="Hero">
      <canvas ref={canvasRef} className="volt-hero-canvas" aria-hidden />
      <TimeSparksCanvas canvasRef={canvasRef} />
      <p className="volt-hero-sunday" aria-hidden>
        23:00
      </p>
      <div className="volt-hero-inner">
        <h1 className="volt-hero-brand">
          <span className="volt-hero-brand-line">{site.headline[0]}</span>
          <span className="volt-hero-brand-line">{site.headline[1]}</span>
        </h1>
        <p className="volt-hero-promise" data-volt-split>
          {site.subhead}
        </p>
        <a
          ref={ctaRef}
          href={href}
          className="volt-btn-primary"
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {site.ctaPrimary}
          <span className="volt-btn-arrow" aria-hidden>
            →
          </span>
        </a>
      </div>
    </section>
  )
}
