import { useEffect, useState } from 'react'
import { site } from '../../data/content'

const LINKS = [
  { href: '#realizacje', label: 'Realizacje' },
  { href: '#uslugi', label: 'Usługi' },
  { href: '#proces', label: 'Proces' },
  { href: '#kontakt', label: 'Kontakt' },
]

export function NavV3() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const ctaHref = site.calendly || '#kontakt'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[80] transition-all duration-300 ${
        scrolled ? 'border-b border-[var(--v3-line)] bg-[var(--color-ink)]/75 backdrop-blur-md' : ''
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <a href="#top" className="font-grotesk text-[15px] font-semibold tracking-tight">
          Marcin Bochenek<span className="text-accent">.</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[var(--color-paper)]/60 transition-colors hover:text-[var(--color-paper)]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href={ctaHref}
          className="btn-accent text-sm"
          {...(site.calendly ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          Umów audyt <span aria-hidden>→</span>
        </a>
      </nav>
    </header>
  )
}
