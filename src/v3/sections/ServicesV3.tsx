import type { MouseEvent } from 'react'
import { services, sections } from '../../data/content'

/** Sztuka kart — wygenerowane „backlit fluted glass" (public/v3/, tiery 1200/2400 z mastera 4K) */
const SERVICE_ART = ['/v3/art-arch', '/v3/art-blocks', '/v3/art-knot']

const MAX_TILT = 4 // degrees
// Only apply hover effects on devices with a precise pointer (desktop)
const canHover =
  typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

function handleGlow(e: MouseEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  const gx = ((e.clientX - rect.left) / rect.width) * 100
  const gy = ((e.clientY - rect.top) / rect.height) * 100
  e.currentTarget.style.setProperty('--gx', `${gx}%`)
  e.currentTarget.style.setProperty('--gy', `${gy}%`)
}

function handleTiltMove(e: MouseEvent<HTMLDivElement>) {
  if (!canHover) return
  const rect = e.currentTarget.getBoundingClientRect()
  // Normalise cursor to [-1, 1] relative to card centre
  const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
  const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
  // rotateX tilts around horizontal axis (y offset drives X rotation), vice versa
  const rotX = (-ny * MAX_TILT).toFixed(2)
  const rotY = (nx * MAX_TILT).toFixed(2)
  e.currentTarget.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`
}

function handleTiltLeave(e: MouseEvent<HTMLDivElement>) {
  if (!canHover) return
  e.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)'
}

export function ServicesV3() {
  return (
    <section id="uslugi" className="mx-auto max-w-6xl px-5 py-24 md:py-32 md:px-8">
      {/* Section header */}
      <div className="mb-16">
        <p className="v3-label mb-4">02 / Usługi</p>
        <h2 className="v3-display text-[clamp(2rem,5vw,3.5rem)] text-balance mb-5">
          Co robię dla Twojej{' '}
          <em className="v3-serif-accent">firmy</em>
        </h2>
        <p className="text-muted max-w-2xl text-base leading-relaxed">
          {sections.services.lead}
        </p>
      </div>

      {/* Services grid */}
      <div className="grid md:grid-cols-3 gap-5">
        {services.map((service, idx) => (
          <div
            key={service.num}
            className="v3-card v3-glow-card reveal group/card flex flex-col overflow-hidden"
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.18s ease-out',
            }}
            onMouseMove={(e) => {
              handleGlow(e)
              handleTiltMove(e)
            }}
            onMouseLeave={handleTiltLeave}
          >
            {/* Art header — backlit fluted glass */}
            <div className="relative h-44 overflow-hidden md:h-48">
              <img
                src={`${SERVICE_ART[idx]}.webp`}
                srcSet={`${SERVICE_ART[idx]}.webp 1200w, ${SERVICE_ART[idx]}@2x.webp 2400w`}
                sizes="(min-width: 768px) 33vw, 100vw"
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.06]"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, transparent 40%, var(--v3-surface) 100%)' }}
                aria-hidden
              />
            </div>

            <div className="flex flex-1 flex-col p-7 pt-6 md:p-9 md:pt-7">
            {/* Number */}
            <span className="v3-mono text-accent text-sm font-medium mb-5 block">
              {service.num}
            </span>

            {/* Outcome as strong title */}
            <h3 className="font-grotesk text-xl font-semibold text-[var(--color-paper)] mb-4 leading-snug">
              {service.outcome}
            </h3>

            {/* Description */}
            <p className="text-muted text-sm leading-relaxed mb-6">
              {service.description}
            </p>

            {/* Deliverables */}
            {service.deliverables && (
              <div className="flex-1 mb-6">
                <p className="v3-label mb-3">W zakresie:</p>
                <ul className="flex flex-col gap-1.5">
                  {service.deliverables.map((item) => (
                    <li
                      key={item}
                      className="v3-mono text-[11.5px] leading-relaxed text-muted flex gap-2"
                    >
                      <span className="text-accent shrink-0">–</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="v3-mono text-[10px] border border-[var(--v3-line-bright)] rounded-full px-2.5 py-1 text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-[var(--v3-line)] pt-5">
              <p className="v3-mono text-[11px] text-muted">
                {service.timeline} ·{' '}
                <span className="text-accent">{service.from}</span>
              </p>
            </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
