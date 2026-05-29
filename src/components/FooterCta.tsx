import { site } from '../data/content'

export function FooterCta() {
  const ctaHref = site.calendly || '#contact'

  return (
    <footer
      data-footer-cta
      className="relative overflow-hidden border-t border-[var(--color-paper)]/15 bg-[var(--color-ink)]"
    >
      <div className="section-pad mx-auto max-w-[100vw]">
        <p data-reveal className="section-label">
          Następny krok
        </p>
        <a
          href={ctaHref}
          data-footer-headline
          className="footer-cta-link group mt-6 block"
          {...(site.calendly ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          <span className="font-headline block text-[clamp(2.75rem,11vw,9.5rem)] leading-[0.92] tracking-tight">
            <span data-footer-line className="block overflow-hidden">
              <span data-footer-line-inner className="block transition-transform duration-500 group-hover:translate-x-2">
                Porozmawiajmy
              </span>
            </span>
            <span data-footer-line className="block overflow-hidden">
              <span
                data-footer-line-inner
                className="block text-[var(--color-paper)]/45 transition-transform duration-500 group-hover:translate-x-4"
              >
                o Twoim projekcie
              </span>
            </span>
          </span>
          <span className="mt-8 inline-flex items-center gap-3 text-sm font-medium tracking-wide uppercase">
            {site.ctaPrimary}
            <span
              className="inline-block transition-transform duration-300 group-hover:translate-x-2"
              aria-hidden
            >
              →
            </span>
          </span>
        </a>
        <p data-reveal className="text-muted mt-16 text-xs">
          © {new Date().getFullYear()} {site.name} · {site.location}
        </p>
      </div>
    </footer>
  )
}
