import { useEffect, useRef, useState } from 'react'
import { ArchiveLang, useLocale } from '../i18n'
import { getArchiveUi } from '../i18n/archive-ui'
import { site } from '../i18n/live'
import { FullscreenMenu } from './FullscreenMenu'

export function Nav() {
  const { locale } = useLocale()
  const ui = getArchiveUi(locale)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const ticking = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40)
        ticking.current = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const ctaHref = site.calendly || '#contact'

  return (
    <>
      <header
        className={`nav-bar fixed top-0 right-0 left-0 transition-all duration-300 ${
          menuOpen ? 'z-[100]' : 'z-[80]'
        } ${scrolled && !menuOpen ? 'pt-3' : 'pt-4'}`}
      >
        <nav
          className={`mx-auto flex max-w-[1440px] items-center justify-between gap-4 border px-3 py-3 shadow-[0_18px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-all duration-300 md:px-4 ${
            scrolled && !menuOpen
              ? 'mx-4 rounded-full border-[var(--color-paper)]/12 bg-[var(--color-ink)]/78 md:mx-10 lg:mx-16'
              : 'mx-3 rounded-full border-[var(--color-paper)]/8 bg-[var(--color-ink)]/38 md:mx-8 lg:mx-12'
          }`}
          aria-label={ui.navAria}
        >
          {/* Logo */}
          <a
            href="#"
            className="group inline-flex items-center gap-2 rounded-full px-2 py-1 text-[var(--color-paper)]"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full border border-accent/30 bg-accent/10 font-mono text-[10px] font-semibold text-accent">
              MB
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block font-headline text-lg tracking-tight">{site.name}</span>
              <span className="block font-mono text-[8px] tracking-[0.18em] text-[var(--color-paper)]/38 uppercase">
                operator/build studio
              </span>
            </span>
          </a>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3 md:gap-4">
            <ArchiveLang />
            <span className="hidden items-center gap-2 rounded-full border border-[var(--color-paper)]/10 bg-[var(--color-paper)]/[0.035] px-3 py-2 font-mono text-[9px] tracking-[0.14em] text-[var(--color-paper)]/50 uppercase lg:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_rgba(245,165,36,0.8)]" aria-hidden />
              {ui.slotMonth}
            </span>
            <a
              href={ctaHref}
              className="rounded-full border border-accent/35 bg-accent/10 px-3 py-2 font-mono text-[10px] font-semibold tracking-[0.12em] text-accent uppercase shadow-[0_0_24px_rgba(245,165,36,0.12)] md:hidden"
              {...(site.calendly ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {ui.bookAuditShort}
            </a>
            {/* Primary CTA — tylko desktop. Wrapper kontroluje widoczność,
                bo .btn-accent wymusza display:inline-flex (hidden by nie zadziałał). */}
            <div className="hidden md:block">
              <a
                href={ctaHref}
                className="btn-accent premium-cta text-sm"
                {...(site.calendly ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {site.ctaPrimary}
                <span aria-hidden className="ml-1">→</span>
              </a>
            </div>

            {/* Hamburger */}
            <button
              type="button"
              className="nav-menu-trigger group flex items-center gap-3 rounded-full border border-[var(--color-paper)]/10 bg-[var(--color-paper)]/[0.035] px-3 py-2 text-[var(--color-paper)] transition-colors hover:border-[var(--color-paper)]/22 hover:bg-[var(--color-paper)]/[0.07]"
              aria-expanded={menuOpen}
              aria-controls="fullscreen-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="sr-only">{menuOpen ? 'Zamknij menu' : 'Otwórz menu'}</span>
              <span
                className="flex h-5 w-6 flex-col justify-between"
                aria-hidden
              >
                <span
                  className={`h-px w-full origin-center bg-current transition-transform duration-300 ${
                    menuOpen ? 'translate-y-[9px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`h-px w-full bg-current transition-opacity duration-200 ${
                    menuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`h-px w-full origin-center bg-current transition-transform duration-300 ${
                    menuOpen ? '-translate-y-[9px] -rotate-45' : ''
                  }`}
                />
              </span>
              <span className="text-[10px] font-semibold tracking-[0.22em] uppercase">
                {menuOpen ? 'Zamknij' : 'Menu'}
              </span>
            </button>
          </div>
        </nav>
      </header>

      <FullscreenMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
