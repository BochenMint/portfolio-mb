import { useEffect, useState } from 'react'
import { useLocale } from '../i18n/context'
import type { Locale } from '../i18n/types'
import { LinkButton } from './primitives'

function LangSwitch({ className = '' }: { className?: string }) {
  const { locale, setLocale, t } = useLocale()

  const option = (value: Locale, label: string) => (
    <button
      key={value}
      type="button"
      aria-pressed={locale === value}
      aria-label={`${t.langSwitch.ariaLabel}: ${label}`}
      onClick={() => setLocale(value)}
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.06em] transition-colors ${
        locale === value ? 'bg-white text-ink' : 'text-silver-2 hover:text-white'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className={`ghost-btn flex items-center gap-0.5 !px-1 !py-1 ${className}`} role="group" aria-label={t.langSwitch.ariaLabel}>
      {option('pl', t.langSwitch.pl)}
      {option('en', t.langSwitch.en)}
    </div>
  )
}

export function Nav() {
  const { t: c, content } = useLocale()
  const site = content.site
  const ctaHref = site.calendly || '#kontakt'
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="fixed top-0 right-0 left-0 z-50 px-4 pt-4 md:px-8 md:pt-5">
      <nav
        aria-label={c.navAria.main}
        className={`glass-nav r-card-sm mx-auto flex max-w-6xl items-center justify-between px-3 py-2 transition-[max-width] duration-500 md:px-4 ${
          scrolled ? 'md:max-w-4xl' : ''
        }`}
      >
        <a href="#" className="flex items-center gap-3 pl-2" aria-label={c.brand}>
          <span
            aria-hidden
            className="chrome-text font-display text-[15px] font-bold tracking-[-0.04em]"
          >
            {c.mark}
          </span>
          <span className="hidden text-sm font-medium text-white sm:block">{c.brand}</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {c.nav.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3.5 py-2 text-[13px] text-silver-2 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LangSwitch className="hidden sm:flex" />
          <LinkButton href={ctaHref} external={!!site.calendly} size="sm" magnetic={false}>
            {c.navCta}
          </LinkButton>
          <button
            type="button"
            aria-label={open ? c.navAria.closeMenu : c.navAria.openMenu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden"
          >
            <span className="ghost-btn flex h-9 w-9 items-center justify-center">
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-px w-4 bg-white transition-transform ${open ? 'top-1.5 rotate-45' : 'top-0'}`}
              />
              <span
                className={`absolute left-0 h-px w-4 bg-white transition-transform ${open ? 'top-1.5 -rotate-45' : 'top-3'}`}
              />
            </span>
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass-nav r-card-sm mx-auto mt-2 max-w-6xl p-2 lg:hidden">
          <ul className="flex flex-col">
            {c.nav.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm text-silver transition-colors hover:bg-white/[0.04] hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-1 flex justify-center border-t border-white/[0.06] pt-3 sm:hidden">
            <LangSwitch />
          </div>
        </div>
      )}
    </header>
  )
}
