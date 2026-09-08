import { useEffect, useState } from 'react'
import { LanguageSwitcher, useContent, useLocale, useMbAiCopy } from '../../i18n'

export function NavMbAi() {
  const [scrolled, setScrolled] = useState(false)
  const { site } = useContent()
  const { locale } = useLocale()
  const copy = useMbAiCopy()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const ctaHref = site.calendly || '#kontakt'
  const links = [
    { href: '#wdrozenia', label: copy.navProof },
    { href: '#jak-dziala', label: copy.navHow },
    { href: '#kontakt', label: copy.navContact },
  ]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[80] transition-all duration-300 ${
        scrolled ? 'border-b border-[var(--mbai-line)] bg-[var(--color-ink)]/80 backdrop-blur-md' : ''
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8" aria-label={copy.navAria}>
        <a href="#top" className="group flex items-center gap-3 no-underline">
          <img
            src="/brand/mark.svg"
            alt=""
            width={30}
            height={30}
            className="h-[30px] w-[30px] shrink-0 transition-[filter] duration-300 group-hover:brightness-110"
            aria-hidden
          />
          <span className="font-[family-name:var(--font-grotesk)] text-[15px] font-semibold tracking-[-0.03em] text-[var(--color-paper)]">
            MB{' '}
            <span className="text-accent">AI</span>
            <span className="text-accent">.</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[var(--color-paper)]/60 transition-colors hover:text-[var(--color-paper)]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} ariaLabel={copy.langAria} className="mbai-lang" />
          <a
            href={ctaHref}
            className="btn-accent text-sm"
            {...(site.calendly ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {copy.ctaAudit} <span aria-hidden>→</span>
          </a>
        </div>
      </nav>
    </header>
  )
}
