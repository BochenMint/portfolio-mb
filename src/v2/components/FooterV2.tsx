import { site } from '../../data/content'

export function FooterV2({ onOpenCmd }: { onOpenCmd?: () => void }) {
  return (
    <footer className="relative border-t border-[var(--v2-line)]">
      {/* Big typographic CTA */}
      <div className="mx-auto max-w-[1400px] px-5 pt-20 pb-10 md:px-8 md:pt-28">
        <div className="reveal mb-16 text-center">
          <p className="v2-label mx-auto mb-6">gotowy na audyt?</p>
          <a
            href="#console"
            className="group block no-underline"
            aria-label="Przejdź do formularza kontaktowego"
          >
            <p className="v2-display text-[clamp(2.5rem,9vw,7rem)] leading-[0.92] tracking-tight text-[var(--color-paper)]/90 transition-colors duration-300 group-hover:text-accent">
              {site.footerCta.line1}
            </p>
            <p className="v2-serif text-[clamp(1.8rem,6vw,5rem)] leading-[1.05] text-[var(--color-paper)]/55 transition-colors duration-300 group-hover:text-[var(--color-paper)]/80 italic">
              {site.footerCta.line2}
            </p>
          </a>
        </div>

        {/* Bottom bar */}
        <div className="reveal border-t border-[var(--v2-line)] pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left — links */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${site.email}`}
                className="v2-mono text-[11px] tracking-[0.12em] text-[var(--color-paper)]/40 uppercase transition-colors hover:text-accent"
              >
                {site.email}
              </a>
              <span className="v2-mono text-[11px] text-[var(--color-paper)]/20" aria-hidden>·</span>
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="v2-mono text-[11px] tracking-[0.12em] text-[var(--color-paper)]/40 uppercase transition-colors hover:text-accent"
              >
                GitHub ↗
              </a>
              <span className="v2-mono text-[11px] text-[var(--color-paper)]/20" aria-hidden>·</span>
              <a
                href="/v1.html"
                className="v2-mono text-[11px] tracking-[0.12em] text-[var(--color-paper)]/40 uppercase transition-colors hover:text-[var(--color-paper)]/70"
              >
                ← wersja 1
              </a>
            </div>

            {/* Center — command palette trigger */}
            {onOpenCmd && (
              <button
                onClick={onOpenCmd}
                className="v2-kbd flex items-center gap-1.5 transition-colors hover:border-accent"
                aria-label="Otwórz paletę poleceń"
              >
                <span>⌘K</span>
              </button>
            )}

            {/* Right — copyright */}
            <p className="v2-mono text-[11px] tracking-[0.1em] text-[var(--color-paper)]/30">
              © 2026 Marcin Bochenek · {site.location}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
