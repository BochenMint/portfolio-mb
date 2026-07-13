import { site } from '../../data/content'
import { useCoarsePointer } from '../../hooks/useCoarsePointer'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function FooterV3() {
  const reduced = useReducedMotion()
  const coarse = useCoarsePointer()
  // Video ambient only where it pays off: desktop pointers, no reduced-motion.
  const showVideo = !reduced && !coarse

  return (
    <footer>
      {/* Big footer CTA — z ambientem ryflowanego szkła w tle */}
      <a
        href="#kontakt"
        className="v3-footer-cta group relative block overflow-hidden text-center py-24 md:py-32 border-t border-[var(--v3-line)] hover:border-[var(--v3-line-bright)] transition-colors no-underline"
        aria-label="Umów audyt — przejdź do sekcji kontakt"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          e.currentTarget.style.setProperty('--fx', `${((e.clientX - r.left) / r.width) * 100}%`)
          e.currentTarget.style.setProperty('--fy', `${((e.clientY - r.top) / r.height) * 100}%`)
        }}
      >
        {showVideo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-40 transition-opacity duration-700 group-hover:opacity-55"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/v3/art-wide.webp"
            aria-hidden
          >
            <source src="/v3/ambient-wide.mp4" type="video/mp4" />
          </video>
        ) : (
          <img
            src="/v3/art-wide.webp"
            srcSet="/v3/art-wide.webp 2560w, /v3/art-wide@2x.webp 3840w"
            sizes="100vw"
            alt=""
            loading="lazy"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-40 transition-opacity duration-700 group-hover:opacity-55"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(70% 80% at 50% 50%, rgba(8,8,7,0.82), rgba(8,8,7,0.55) 60%, rgba(8,8,7,0.85))',
          }}
          aria-hidden
        />
        {/* Glow podążający za kursorem — "latarka" na ryflowanym szkle */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(340px 260px at var(--fx, 50%) var(--fy, 60%), rgba(255,200,97,0.30), rgba(255,94,58,0.10) 45%, transparent 72%)',
            mixBlendMode: 'screen',
          }}
          aria-hidden
        />
        <div className="relative z-10">
        <p className="v3-label mb-6">gotowy na audyt?</p>

        {/* Line 1 — last word accent sweep via group-hover */}
        <p className="v3-display text-[clamp(2.8rem,9vw,7.5rem)] text-[var(--color-paper)]/85 leading-none mb-3">
          {site.footerCta.line1
            .split(' ')
            .map((word, i, arr) => {
              const isLast = i === arr.length - 1
              return (
                <span key={i}>
                  {isLast ? (
                    <span className="transition-colors duration-700 group-hover:text-accent">
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                  {!isLast ? ' ' : ''}
                </span>
              )
            })}
        </p>

        {/* Line 2 */}
        <p
          className="text-[var(--color-paper)]/50 text-[clamp(1.6rem,5vw,3.6rem)] leading-none mt-4 block"
          style={{ fontFamily: 'var(--font-headline)', fontStyle: 'italic', fontWeight: 400 }}
        >
          {site.footerCta.line2}
        </p>
        </div>
      </a>

      {/* Bottom bar */}
      <div className="border-t border-[var(--v3-line)]">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href={`mailto:${site.email}`}
              className="v3-mono text-[11px] text-muted hover:text-accent transition-colors"
            >
              {site.email}
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="v3-mono text-[11px] text-muted hover:text-accent transition-colors"
            >
              GitHub ↗
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="/v1.html" className="v3-mono text-[11px] text-muted hover:text-accent transition-colors">
              ← wersja 1
            </a>
            <a href="/v2.html" className="v3-mono text-[11px] text-muted hover:text-accent transition-colors">
              v2 →
            </a>
            <span className="v3-mono text-[11px] text-muted">
              © 2026 Marcin Bochenek · {site.location}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
