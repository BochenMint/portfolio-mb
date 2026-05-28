import { site } from '../data/content'

const links = [
  { href: '#realizacje', label: 'Realizacje' },
  { href: '#uslugi', label: 'Usługi' },
  { href: '#proces', label: 'Proces' },
  { href: '#kontakt', label: 'Kontakt' },
]

export function Nav() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 px-5 py-5 md:px-10">
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-5 py-3 md:px-6">
        <a href="#" className="font-display text-sm font-bold tracking-tight md:text-base">
          {site.name}
          <span className="text-mint">.</span>
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-muted text-xs tracking-wide uppercase transition-colors hover:text-cream"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#kontakt"
          className="rounded-full bg-mint px-4 py-2 text-xs font-semibold text-ink transition-transform hover:scale-[1.03] active:scale-[0.98] md:text-sm"
        >
          {site.ctaSecondary}
        </a>
      </nav>
    </header>
  )
}
