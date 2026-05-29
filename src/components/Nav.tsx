import { navLinks, site } from '../data/content'
import { ThemeToggle } from './ThemeToggle'

export function Nav() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-paper/90 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5 md:px-10 lg:px-16"
        aria-label="Główna nawigacja"
      >
        <a href="#" className="font-display text-lg tracking-tight md:text-xl">
          {site.name.split(' ')[0]}
        </a>

        <ul className="hidden items-center gap-6 sm:flex md:gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-muted text-xs tracking-[0.14em] uppercase transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href="#contact" className="btn-soft hidden text-xs sm:inline-flex">
            Contact
          </a>
        </div>
      </nav>
    </header>
  )
}
