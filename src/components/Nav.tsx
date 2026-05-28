import { navLinks, site } from '../data/content'
import { ThemeToggle } from './ThemeToggle'

export function Nav() {
  const ctaHref = site.calendly || '#kontakt'

  return (
    <header className="fixed top-0 right-0 left-0 z-50">
      <nav
        className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-5 md:px-12 lg:px-16"
        aria-label="Główna nawigacja"
      >
        <a href="#" className="font-display text-lg tracking-tight md:text-xl">
          {site.name}
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-muted text-[11px] tracking-[0.18em] uppercase transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <a
            href={ctaHref}
            className="btn-soft hidden text-xs sm:inline-flex"
            {...(site.calendly ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            Kontakt
          </a>
        </div>
      </nav>
      <div className="editorial-rule mx-6 md:mx-12 lg:mx-16" />
    </header>
  )
}
