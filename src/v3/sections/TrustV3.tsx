import type { MouseEvent } from 'react'
import { site, liveProof, trustPoints } from '../../data/content'

function handleGlow(e: MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  const gx = ((e.clientX - rect.left) / rect.width) * 100
  const gy = ((e.clientY - rect.top) / rect.height) * 100
  e.currentTarget.style.setProperty('--gx', `${gx}%`)
  e.currentTarget.style.setProperty('--gy', `${gy}%`)
}

const marqueeItems = [
  'Direct booking',
  'KSeF',
  'AI concierge 24/7',
  'PMS',
  'Smart-lock',
  'Next.js',
  'Astro',
  'Audyt kroków',
]

export function TrustV3() {
  return (
    <div>
      {/* Marquee separator */}
      <div className="overflow-hidden border-y border-[var(--v3-line)] py-4" aria-hidden>
        <div className="v3-marquee">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="v3-mono text-[11px] uppercase text-muted tracking-widest">
              {item}
              <span className="mx-5 text-accent">/</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main trust section */}
      <div className="mx-auto max-w-6xl px-5 py-24 md:py-32 md:px-8">
        {/* Large quote */}
        <blockquote className="mb-20 reveal">
          <p
            className="v3-serif-accent text-[var(--color-paper)]/90 text-center max-w-3xl mx-auto leading-relaxed"
            style={{
              fontFamily: 'var(--font-headline)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(1.4rem, 3.2vw, 2.3rem)',
            }}
          >
            "{site.aboutQuote}"
          </p>
          <footer className="v3-mono text-accent text-[11px] text-center mt-5 tracking-widest uppercase">
            — Marcin
          </footer>
        </blockquote>

        {/* Live proof cards */}
        <div className="mb-6">
          <p className="v3-label mb-8">Żywe wdrożenia — kliknij i sprawdź</p>
          <div className="grid md:grid-cols-3 gap-5">
            {liveProof.map((proof) => (
              <a
                key={proof.name}
                href={proof.url}
                target="_blank"
                rel="noopener noreferrer"
                className="v3-card v3-glow-card reveal block p-6 group"
                onMouseMove={handleGlow}
              >
                {/* Tag chip */}
                <span className="v3-mono text-[10px] border border-[var(--v3-line-bright)] rounded-full px-2.5 py-1 text-muted inline-block mb-4">
                  {proof.tag}
                </span>

                {/* Name */}
                <h3 className="font-grotesk font-semibold text-[var(--color-paper)] text-base mb-3 group-hover:text-accent transition-colors leading-snug">
                  {proof.name}
                </h3>

                {/* Result */}
                <p className="text-muted text-sm leading-relaxed mb-4">{proof.result}</p>

                {/* CTA */}
                <span className="v3-mono text-accent text-[11px] tracking-widest uppercase">
                  Zobacz ↗
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Trust points */}
        <div className="grid md:grid-cols-3 gap-5 mt-12">
          {trustPoints.slice(0, 3).map((tp, i) => (
            <div key={tp.title} className="reveal flex flex-col gap-3">
              <span className="v3-metric text-2xl leading-none">0{i + 1}</span>
              <h4 className="font-grotesk font-semibold text-[var(--color-paper)] text-base leading-snug">
                {tp.title}
              </h4>
              <p className="text-muted text-sm leading-relaxed">{tp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
