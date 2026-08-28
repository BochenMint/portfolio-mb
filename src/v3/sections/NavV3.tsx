import { useEffect, useState } from 'react'
import { ArchiveLang } from '../../i18n'
import { getArchiveUi } from '../../i18n/archive-ui'
import { useLocale } from '../../i18n'
import { site } from '../../i18n/live'

export function NavV3() {
  const { locale } = useLocale()
  const ui = getArchiveUi(locale)
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
        <a href="#top" className="group flex items-center gap-3 no-underline">
          <img
            src="/brand/mark.svg"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 shrink-0"
            aria-hidden
          />
          <span className="font-grotesk text-[15px] font-semibold tracking-[-0.02em] text-[var(--color-paper)]">
            Marcin Bochenek<span className="text-accent">.</span>
          </span>
        </a>

        <div className="hidden items-center gap-6 lg:flex">
          {ui.v3Nav.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[var(--color-paper)]/60 transition-colors hover:text-[var(--color-paper)]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ArchiveLang />
          <a
            href={ctaHref}
            className="btn-accent text-sm"
            {...(site.calendly ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {ui.bookAudit} <span aria-hidden>→</span>
          </a>
        </div>
      </nav>
    </header>
  )
}
