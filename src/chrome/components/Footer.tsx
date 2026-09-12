import { useLocale } from '../i18n/context'
import { localeHome } from '../i18n/routes'
import { BrandMark } from './BrandMark'

export function Footer() {
  const { t: c, content, locale } = useLocale()
  const site = content.site

  return (
    <footer className="px-5 py-12 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="hairline" />

        {/* Brand + what the brand does, then navigation. The right-hand slot
            used to list the build stack (React / Vite / GSAP …), which tells a
            prospective client nothing and tells everyone else that the page
            was written for developers. It now carries the positioning line. */}
        <div className="grid gap-8 py-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-16">
          <div>
            {/* The page's one large statement of the mark. It replaces the old
                26 px lockup rather than adding a second one — 44 px on mobile,
                56 px from md up, wordmark set to match. Plain currentColor,
                no glow: the footer is where the brand signs off, not where it
                shouts. */}
            <a
              href={localeHome[locale]}
              className="inline-flex items-center gap-3 md:gap-4"
              aria-label={site.brand}
            >
              <BrandMark size={56} className="h-11 w-11 shrink-0 text-white md:h-14 md:w-14" />
              <span className="text-lg font-semibold tracking-[-0.01em] text-white md:text-xl">
                {site.brand}
              </span>
            </a>
            <p className="mt-5 max-w-[46ch] text-[13px] leading-relaxed text-silver-2">{c.footer.stack}</p>
          </div>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 md:justify-end">
            {c.nav.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm text-silver-2 transition-colors hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="hairline" />

        <div className="flex flex-col gap-3 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>{c.footer.rights(site.brand, new Date().getFullYear())}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {/* The AI-automation sister site — the only followable link from the
                live homepage to mb-ai.pl (see P1-5 of the 2026-09 SEO audit). */}
            <a
              href={c.footer.mbAiHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase transition-colors hover:text-white"
            >
              {c.footer.mbAi}
            </a>
            {/* The archive of earlier editions. Kept reachable but deliberately
                quiet — it is a workshop, not part of the offer. */}
            <a
              href={c.footer.classicHref}
              className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase transition-colors hover:text-white"
            >
              {c.footer.classic}
            </a>
            {/* The niche landings — indexed but unlinked from any nav, so
                these are their only internal links. When there are four of
                them they want a hub page instead of four footer links. */}
            <a
              href={c.footer.krajobrazHref}
              className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase transition-colors hover:text-white"
            >
              {c.footer.krajobraz}
            </a>
            <a
              href={c.footer.brukarstwoHref}
              className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase transition-colors hover:text-white"
            >
              {c.footer.brukarstwo}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
