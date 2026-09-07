import { useEffect, useRef } from 'react'
import { site } from '../../data/content'
import { chromeCopy as c } from '../copy'
import { Arrow, Em, LinkButton } from './primitives'

export function Hero() {
  const ctaHref = site.calendly || '#kontakt'
  const objRef = useRef<HTMLDivElement>(null)

  // Subtle parallax + rotating light for the chrome object (desktop only).
  useEffect(() => {
    const el = objRef.current
    if (!el) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let raf = 0
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
    }
    const loop = () => {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      el.style.transform = `translate3d(${cx * 18}px, ${cy * 14}px, 0) rotate(${cx * 3}deg)`
      el.style.setProperty('--lx', `${50 + cx * 40}%`)
      el.style.setProperty('--ly', `${50 + cy * 40}%`)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <section className="studio-bg relative overflow-hidden px-5 pt-32 pb-16 md:px-10 md:pt-40 md:pb-24">
      {/* Horizon hairline behind the object */}
      <div aria-hidden className="hairline absolute top-[58%] right-0 left-0 opacity-40" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <div className="relative z-10">
          <p data-hero-fade className="eyebrow">
            {c.hero.eyebrow}
          </p>

          <h1 className="mt-6 max-w-[14ch] text-[clamp(2.5rem,5.2vw,4.75rem)] leading-[1.02] font-semibold">
            <span data-hero-line className="chrome-text inline-block">
              {c.hero.h1a} {c.hero.h1b}
            </span>{' '}
            <span data-hero-line className="inline-block text-silver-2">
              Działają jak <Em>inżynieria.</Em>
            </span>
          </h1>

          <p
            data-hero-fade
            className="mt-8 max-w-xl text-base leading-relaxed text-silver-2 md:text-lg"
          >
            {c.hero.lead}
          </p>

          <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-3">
            <LinkButton href={ctaHref} external={!!site.calendly} size="lg">
              {c.hero.ctaPrimary}
              <Arrow />
            </LinkButton>
            <LinkButton href="#realizacje" variant="ghost" size="lg">
              {c.hero.ctaSecondary}
            </LinkButton>
          </div>

          <ul data-hero-fade className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {c.hero.meta.map((m) => (
              <li key={m} className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
                {m}
              </li>
            ))}
          </ul>
        </div>

        {/* Chrome object */}
        <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[-20%] rounded-full opacity-60 blur-3xl"
            style={{
              background:
                'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.14), rgba(255,255,255,0.03) 40%, transparent 65%)',
            }}
          />
          <div
            ref={objRef}
            data-hero-object
            className="relative aspect-square will-change-transform"
            style={{ ['--lx' as string]: '50%', ['--ly' as string]: '50%' }}
          >
            <img
              src="/chrome/hero-torus.webp"
              width={900}
              height={873}
              alt=""
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.7)]"
            />
            {/* Hard light hotspot that travels with the cursor across the object */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at var(--lx) var(--ly), rgba(255,255,255,0.28) 0, rgba(255,255,255,0.08) 8%, transparent 26%)',
                mixBlendMode: 'screen',
                maskImage: 'url(/chrome/hero-torus.webp)',
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskImage: 'url(/chrome/hero-torus.webp)',
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div data-stats className="relative mx-auto mt-16 max-w-7xl md:mt-24">
        <div className="hairline" />
        <ul className="grid grid-cols-2 gap-x-6 gap-y-8 py-8 md:grid-cols-4">
          {c.hero.stats.map((s) => (
            <li key={s.label} data-stat>
              <p className="chrome-text font-display text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                {s.value}
              </p>
              <p className="mt-2 text-[13px] text-muted">{s.label}</p>
            </li>
          ))}
        </ul>
        <div className="hairline" />
      </div>
    </section>
  )
}
