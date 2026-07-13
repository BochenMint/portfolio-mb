import { sections, site, liveProof, trustPoints } from '../../data/content'

export function Proof() {
  return (
    <section id="proof" className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
      {/* Section header */}
      <div className="reveal mb-14">
        <p className="v2-label">04 / DOWÓD</p>
        <h2 className="v2-display mt-4 text-[clamp(2rem,5vw,3.75rem)]">
          {sections.testimonials.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-paper)]/60 md:text-lg">
          {sections.testimonials.lead}
        </p>
      </div>

      {/* Pull quote — editorial serif, warmth */}
      <div className="v2-panel reveal mb-10 p-8 md:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="v2-serif text-[clamp(1.3rem,3.5vw,2rem)] leading-[1.35] text-[var(--color-paper)]/90 italic">
            &ldquo;{site.aboutQuote}&rdquo;
          </p>
          <p className="v2-mono mt-6 text-[11px] tracking-[0.2em] text-accent">
            — Marcin
          </p>
        </div>
      </div>

      {/* Live proof cards */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {liveProof.map((proof) => (
          <a
            key={proof.name}
            href={proof.url}
            target="_blank"
            rel="noopener noreferrer"
            className="v2-panel v2-panel-link reveal block p-6 no-underline"
          >
            {/* Tag + arrow */}
            <div className="flex items-center justify-between">
              <span className="v2-mono rounded border border-[var(--v2-line-bright)] px-2 py-0.5 text-[10px] tracking-[0.12em] text-[var(--color-paper)]/50 uppercase">
                {proof.tag}
              </span>
              <span className="v2-mono text-[11px] text-accent">↗</span>
            </div>

            {/* Name */}
            <p className="font-grotesk mt-4 text-lg font-semibold leading-snug tracking-tight">
              {proof.name}
            </p>

            {/* Result */}
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-paper)]/55">
              {proof.result}
            </p>

            {/* CTA */}
            <p className="v2-mono mt-4 text-[11px] tracking-[0.14em] text-accent uppercase">
              Zobacz ↗
            </p>
          </a>
        ))}
      </div>

      {/* Trust points */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {trustPoints.map((point, idx) => {
          const num = String(idx + 1).padStart(2, '0')
          return (
            <div key={point.title} className="v2-panel v2-hud reveal p-6">
              <span className="v2-mono text-[11px] tracking-[0.2em] text-accent">{num}</span>
              <h3 className="font-grotesk mt-4 text-base font-semibold leading-snug tracking-tight">
                {point.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-paper)]/55">
                {point.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
