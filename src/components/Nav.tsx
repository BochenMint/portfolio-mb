import { site } from '../data/content'
import { MagneticButton } from './MagneticButton'

const links = [
  { href: '#realizacje', label: 'Realizacje' },
  { href: '#case-studies', label: 'Case studies' },
  { href: '#inwestycja', label: 'Cennik' },
  { href: '#kontakt', label: 'Kontakt' },
]

export function Nav() {
  const ctaHref = site.calendly || '#kontakt'

  return (
    <header className="fixed top-0 right-0 left-0 z-50 px-4 py-4 md:px-8">
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-2.5 md:px-6 md:py-3">
        <a href="#" className="font-display text-sm font-bold tracking-tight md:text-base">
          {site.brand}
          <span className="text-mint">.</span>
        </a>
        <ul className="hidden items-center gap-6 lg:flex">
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
        <MagneticButton
          href={ctaHref}
          external={!!site.calendly}
          className="rounded-full bg-mint px-3 py-2 text-[11px] font-bold text-ink md:px-5 md:text-sm"
        >
          Audyt 20 min
        </MagneticButton>
      </nav>
    </header>
  )
}
