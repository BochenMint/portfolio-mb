import { LanguageSwitcher, homePath, useContent, useLocale, useMbAiCopy } from '../../i18n'

export function FooterMbAi() {
  const { site } = useContent()
  const { locale } = useLocale()
  const copy = useMbAiCopy()
  const origin = site.portfolioUrl.replace(/\/$/, '')
  const portfolioHref = `${origin}${homePath(locale)}`

  return (
    <footer className="border-t border-[var(--mbai-line)]">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-8 flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a href="#top" className="no-underline">
            <img
              src="/brand/logo-mb-ai.svg"
              alt="MB AI"
              width={104}
              height={24}
              className="h-6 w-auto opacity-80 transition-opacity hover:opacity-100"
            />
          </a>
          <a
            href={`mailto:${site.email}`}
            className="mbai-mono text-[11px] text-muted hover:text-accent transition-colors"
          >
            {site.email}
          </a>
          <LanguageSwitcher locale={locale} ariaLabel={copy.langAria} className="mbai-lang" />
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a
            href={portfolioHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mbai-mono text-[11px] text-muted hover:text-accent transition-colors"
          >
            {copy.portfolioLabel}
          </a>
          <a
            href={site.gameUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mbai-mono text-[11px] text-muted hover:text-accent transition-colors"
          >
            {copy.gameLabel}
          </a>
          <span className="mbai-mono text-[11px] text-muted">
            © 2026 MB AI · {site.location}
          </span>
        </div>
      </div>
    </footer>
  )
}
