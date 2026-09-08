import { site } from '../../i18n/live'
import { useCoarsePointer } from '../../hooks/useCoarsePointer'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function FooterV3() {
  const reduced = useReducedMotion()
  const coarse = useCoarsePointer()
  const showVideo = !reduced && !coarse

  return (
    <footer>
      <a
        href="#kontakt"
        className="v3-footer-cta group relative block overflow-hidden text-center py-24 md:py-32 border-t border-[var(--v3-line)] hover:border-[var(--v3-line-bright)] transition-colors no-underline"
        aria-label="Umów audyt — przejdź do sekcji kontakt"
        onMouseMove={(e) => {
          if (reduced || coarse) return
          const r = e.currentTarget.getBoundingClientRect()
          e.currentTarget.style.setProperty('--fx', `${((e.clientX - r.left) / r.width) * 100}%`)
          e.currentTarget.style.setProperty('--fy', `${((e.clientY - r.top) / r.height) * 100}%`)
        }}
      >
        {/* Backlight za szkłem — pod media, bez blendu na wierzchu */}
        <div className="v3-footer-pleat-light pointer-events-none absolute inset-0 z-0" aria-hidden />

        {showVideo ? (
          <video
            className="absolute inset-0 z-[1] h-full w-full object-cover opacity-45 transition-opacity duration-700 group-hover:opacity-60"
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
            className="absolute inset-0 z-[1] h-full w-full object-cover opacity-45 transition-opacity duration-700 group-hover:opacity-60"
          />
        )}

        {/* Ryflowanie na szkle — tnie snop z warstwy pod spodem */}
        <div className="v3-footer-glass-ribs pointer-events-none absolute inset-0 z-[2]" aria-hidden />

        {/* Statyczny scrim pod typografię — bez radialnej poświaty wokół kursora */}
        <div className="v3-footer-scrim pointer-events-none absolute inset-0 z-[3]" aria-hidden />

        <div className="relative z-10">
          <p className="v3-label mb-6">gotowy na audyt?</p>

          <p className="v3-display text-[clamp(2.8rem,9vw,7.5rem)] text-[var(--color-paper)]/85 leading-none mb-3">
            {site.footerCta.line1.split(' ').map((word, i, arr) => {
              const isLast = i === arr.length - 1
              return (
                <span key={i}>
                  {isLast ? (
                    <span className="transition-colors duration-700 group-hover:text-accent">{word}</span>
                  ) : (
                    word
                  )}
                  {!isLast ? ' ' : ''}
                </span>
              )
            })}
          </p>

          <p
            className="text-[var(--color-paper)]/50 text-[clamp(1.6rem,5vw,3.6rem)] leading-none mt-4 block"
            style={{ fontFamily: 'var(--font-headline)', fontStyle: 'italic', fontWeight: 400 }}
          >
            {site.footerCta.line2}
          </p>
        </div>
      </a>

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
            <a
              href={site.mbAiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="v3-mono text-[11px] text-muted hover:text-accent transition-colors"
            >
              MB AI ↗
            </a>
            <a
              href={site.gameUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="v3-mono text-[11px] text-muted hover:text-accent transition-colors"
            >
              Gra kosmiczna ↗
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="v3-mono text-[11px] text-muted">
              © 2026 Marcin Bochenek · {site.location}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
