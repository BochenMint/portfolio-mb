import { navLinks, site } from '../data/content'
import { ThemeToggle } from './ThemeToggle'

export function Nav() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-rule bg-paper/92 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 md:px-10 lg:px-16"
        aria-label="Główna nawigacja"
      >
        <a href="#" className="font-headline text-lg tracking-tight">
          {site.name.split(' ')[0]}
        </a>

        <ul className="hidden items-center gap-6 sm:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-muted text-xs font-medium tracking-wide uppercase transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href="#contact" className="btn-fill hidden text-xs sm:inline-flex">
            Kontakt
          </a>
        </div>
      </nav>
    </header>
  )
}
