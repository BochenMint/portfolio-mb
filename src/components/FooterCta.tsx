import { site } from '../i18n/live'

export function FooterCta() {
  // calendly is empty → fallback to #contact (the form)
  const ctaHref = site.calendly || '#contact'
  const isExternal = Boolean(site.calendly)

  return (
    <footer
      data-footer-cta
      className="relative overflow-hidden border-t border-[var(--color-paper)]/15 bg-[radial-gradient(circle_at_76%_12%,rgba(245,165,36,0.16),transparent_28rem),var(--color-ink)]"
    >
      <div className="pointer-events-none absolute inset-0 hero-premium-grid opacity-20" aria-hidden />
      <div className="section-pad relative mx-auto max-w-[1440px]">
        <p data-reveal className="font-mono text-[10px] tracking-[0.18em] text-[var(--color-paper)]/40 uppercase">
          Następny krok
        </p>

        <a
          href={ctaHref}
          data-footer-headline
          className="footer-cta-link group mt-6 block rounded-[2rem] border border-[var(--color-paper)]/12 bg-[var(--color-paper)]/[0.025] p-5 transition duration-300 hover:border-accent/30 md:p-8"
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          <span className="font-headline block text-[clamp(2.75rem,11vw,9.5rem)] leading-[0.92] tracking-tight">
            {/* Line 1 — accent on hover via text-sunset group class */}
            <span data-footer-line className="block overflow-hidden">
              <span
                data-footer-line-inner
                className="block transition-[transform,color] duration-500 group-hover:translate-x-2 group-hover:text-accent-bright"
              >
                {site.footerCta.line1}
              </span>
            </span>
            {/* Line 2 — dimmer, slides further */}
            <span data-footer-line className="block overflow-hidden">
              <span
                data-footer-line-inner
                className="block text-[var(--color-paper)]/45 transition-[transform,color] duration-500 group-hover:translate-x-4 group-hover:text-accent/60"
              >
                {site.footerCta.line2}
              </span>
            </span>
          </span>

          {/* CTA label */}
          <span className="mt-8 inline-flex items-center gap-3 rounded-full border border-accent/25 bg-accent/10 px-4 py-3 text-sm font-medium tracking-wide text-accent uppercase transition-colors duration-300 group-hover:bg-accent/16 group-hover:text-accent-bright">
            {site.ctaPrimary}
            <span
              className="inline-block transition-transform duration-300 group-hover:translate-x-2"
              aria-hidden
            >
              →
            </span>
          </span>
        </a>

        {/* Footer meta */}
        <div data-reveal className="mt-16 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[10px] tracking-[0.12em] text-[var(--color-paper)]/30 uppercase">
            © {new Date().getFullYear()} {site.name} · {site.location}
          </p>
          <a
            href={`mailto:${site.email}`}
            className="font-mono text-[10px] tracking-[0.12em] text-[var(--color-paper)]/30 uppercase transition-colors hover:text-accent"
          >
            {site.email}
          </a>
        </div>
      </div>
    </footer>
  )
}
