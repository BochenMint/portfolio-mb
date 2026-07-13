import { useEffect, useState } from 'react'
import { site } from '../../data/content'

export function NavV2({ onOpenCmd }: { onOpenCmd: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const ctaHref = site.calendly || '#console'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[80] transition-colors duration-300 ${
        scrolled ? 'border-b border-[var(--v2-line)] bg-[var(--color-ink)]/80 backdrop-blur-md' : ''
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-4 md:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="font-grotesk grid h-7 w-7 place-items-center rounded-md border border-[var(--v2-line-bright)] text-sm font-bold text-accent">
            M
          </span>
          <span className="v2-mono text-[11px] tracking-[0.2em] text-[var(--color-paper)]/70 uppercase">
            Bochenek<span className="text-accent">/</span>systems
          </span>
        </a>
        <div className="flex items-center gap-2 md:gap-3">
          <span className="v2-pill hidden sm:inline-flex">
            <span className="v2-dot" />
            dostępny
          </span>
          <button
            type="button"
            onClick={onOpenCmd}
            className="v2-kbd hidden cursor-pointer items-center gap-1.5 md:inline-flex"
            aria-label="Otwórz paletę poleceń (Ctrl/Cmd + K)"
          >
            <span>⌘</span>
            <span>K</span>
          </button>
          <a
            href={ctaHref}
            className="btn-accent text-sm"
            {...(site.calendly ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            Umów audyt
            <span aria-hidden>→</span>
          </a>
        </div>
      </nav>
    </header>
  )
}
