import { useState } from 'react'
import { site } from '../data/content'
import { FullscreenMenu } from './FullscreenMenu'

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header
        className={`nav-bar fixed top-0 right-0 left-0 ${menuOpen ? 'z-[100]' : 'z-[80]'}`}
      >
        <nav
          className="mx-auto flex max-w-[100vw] items-center justify-between gap-4 px-6 py-5 md:px-10 lg:px-16"
          aria-label="Główna nawigacja"
        >
          <a
            href="#"
            className="font-headline text-lg tracking-tight text-[var(--color-paper)] mix-blend-difference"
          >
            {site.name.split(' ')[0]}
          </a>

          <button
            type="button"
            className="nav-menu-trigger group flex items-center gap-3 text-[var(--color-paper)]"
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
        </nav>
      </header>

      <FullscreenMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
