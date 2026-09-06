import { useEffect, useState } from 'react'
import { site } from '../../data/content'
import { chromeCopy as c } from '../copy'
import { LinkButton } from './primitives'

export function Nav() {
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
        aria-label="Główna"
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
          <LinkButton href={ctaHref} external={!!site.calendly} size="sm" magnetic={false}>
            {c.navCta}
          </LinkButton>
          <button
            type="button"
            aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="ghost-btn h-9 w-9 !p-0 lg:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-px w-4 bg-white transition-transform ${open ? 'top-1.5 rotate-45' : 'top-0'}`}
              />
              <span
                className={`absolute left-0 h-px w-4 bg-white transition-transform ${open ? 'top-1.5 -rotate-45' : 'top-3'}`}
              />
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
        </div>
      )}
    </header>
  )
}
