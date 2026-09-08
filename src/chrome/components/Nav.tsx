import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocale } from '../i18n/context'
import { localeHome } from '../i18n/routes'
import type { Locale } from '../i18n/types'
import { useTheme } from '../theme/context'
import { LinkButton } from './primitives'

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  )
}

function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const { t } = useLocale()
  const isLight = theme === 'light'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t.themeToggle}
      aria-pressed={isLight}
      title={isLight ? t.themeDark : t.themeLight}
      className={`chrome-btn flex h-9 w-9 shrink-0 !p-0 ${className}`}
    >
      <span className="relative z-10 inline-flex items-center justify-center">
        {isLight ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  )
}

function LangSwitch({ className = '' }: { className?: string }) {
  const { locale, t } = useLocale()

  // Links, not buttons: each language is a real URL, so the switch has to be
  // a navigation. A client-side swap would leave /en/ serving Polish under an
  // English canonical, and would hide the other languages from crawlers.
  const option = (value: Locale, label: string) => (
    <a
      key={value}
      href={localeHome[value]}
      hrefLang={value}
      aria-current={locale === value ? 'page' : undefined}
      aria-label={`${t.langSwitch.ariaLabel}: ${label}`}
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.06em] transition-colors ${
        locale === value ? 'bg-white text-ink' : 'text-silver-2 hover:text-white'
      }`}
    >
      {label}
    </a>
  )

  return (
    <div className={`ghost-btn flex items-center gap-0.5 !px-1 !py-1 ${className}`} role="group" aria-label={t.langSwitch.ariaLabel}>
      {option('pl', t.langSwitch.pl)}
      {option('en', t.langSwitch.en)}
      {option('uk', t.langSwitch.uk)}
    </div>
  )
}

export function Nav() {
  const { t: c, content } = useLocale()
  const site = content.site
  const ctaHref = site.calendly || '#kontakt'
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // The scrolled bar is 256px narrower, which slides every control on its
  // right edge ~128px sideways — more than three times the width of the
  // theme toggle. With Lenis the scroll (and the slide) keeps running for
  // about a second after the wheel stops, so a control could move out from
  // under the pointer mid-click. Hold the resize back while the pointer is
  // on the bar and apply it once the pointer leaves.
  const scrolledRef = useRef(false)
  const holdRef = useRef(false)
  const pendingRef = useRef<boolean | null>(null)

  useEffect(() => {
    const apply = (next: boolean) => {
      if (scrolledRef.current === next) {
        pendingRef.current = null
        return
      }
      if (holdRef.current) {
        pendingRef.current = next
        return
      }
      pendingRef.current = null
      scrolledRef.current = next
      setScrolled(next)
    }
    const onScroll = () => apply(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Touch has no meaningful hover, and a pointerleave is not guaranteed
  // there — holding on touch could freeze the bar at the wrong width.
  const holdResize = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') holdRef.current = true
  }, [])

  const releaseResize = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    holdRef.current = false
    const pending = pendingRef.current
    if (pending === null) return
    pendingRef.current = null
    scrolledRef.current = pending
    setScrolled(pending)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 px-4 pt-4 md:px-8 md:pt-5"
      onPointerEnter={holdResize}
      onPointerLeave={releaseResize}
    >
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
          <div className="max-sm:hidden">
            <ThemeToggle />
          </div>
          <div className="max-sm:hidden">
            <LangSwitch />
          </div>
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
        <div className="glass-nav glass-nav--solid r-card-sm mx-auto mt-2 max-w-6xl p-2 lg:hidden">
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
          <div className="mt-1 flex items-center justify-center gap-2 border-t border-white/[0.06] pt-3 sm:hidden">
            <ThemeToggle />
            <LangSwitch />
          </div>
        </div>
      )}
    </header>
  )
}
