import { navLinks, site } from '../data/content'
import { ThemeToggle } from './ThemeToggle'

export function Nav() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-paper/90 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5 md:px-10 lg:px-16"
        aria-label="Główna nawigacja"
      >
        <a
          href="#"
          className="flex items-center gap-2.5 font-display text-lg tracking-tight md:text-xl"
        >
          <img
            src="/images/marcin-bochenek-400w.webp"
            alt=""
            width={32}
            height={32}
            className="hidden size-8 shrink-0 rounded-full object-cover object-[center_18%] ring-1 ring-rule sm:block"
            decoding="async"
            aria-hidden
          />
          <span>{site.name.split(' ')[0]}</span>
        </a>

        <ul className="flex items-center gap-4 md:gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-muted text-[10px] tracking-[0.12em] uppercase transition-colors hover:text-accent md:text-xs md:tracking-[0.14em]"
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
