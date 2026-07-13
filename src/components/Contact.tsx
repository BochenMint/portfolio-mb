import { sections, site } from '../data/content'
import { LeadForm } from './LeadForm'
import { MagneticButton } from './MagneticButton'
import { SectionIntro } from './SectionIntro'

export function Contact() {
  // calendly is empty → fallback to #contact (scroll to form)
  const ctaHref = site.calendly || '#contact'

  return (
    <section id="contact" data-section className="section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(245,165,36,0.1),transparent_26rem)]" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-10">
        {/* Left col: copy + CTAs */}
        <div className="rounded-[1.8rem] border border-[var(--color-paper)]/12 bg-[var(--color-paper)]/[0.025] p-5 md:p-7">
          <SectionIntro
            num={sections.contact.num}
            title={sections.contact.title}
            lead={sections.contact.lead}
          />

          <p data-reveal className="text-muted mt-6 max-w-sm text-sm leading-relaxed">
            Napisz kilka zdań o tym, co dziś zjada czas — brief w formularzu wystarczy na start.
            Odpowiadam w&nbsp;jeden dzień roboczy.
          </p>

          <div data-reveal className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {/* Primary CTA — btn-accent */}
            <MagneticButton
              href={ctaHref}
              className="btn-accent premium-cta justify-center"
              external={Boolean(site.calendly)}
            >
              {site.ctaPrimary}
            </MagneticButton>

            {/* Email link — clearly readable */}
            <MagneticButton
              href={`mailto:${site.email}`}
              className="btn-soft premium-secondary-cta justify-center"
            >
              {site.email}
            </MagneticButton>
          </div>

          {/* Meta info */}
          <div data-reveal className="mt-10 grid gap-2">
            <p className="rounded-2xl border border-[var(--color-paper)]/10 bg-[var(--color-ink)]/40 px-4 py-3 font-mono text-[10px] tracking-[0.14em] text-[var(--color-paper)]/45 uppercase">
              {site.responseTime}
            </p>
            <p className="rounded-2xl border border-[var(--color-paper)]/10 bg-[var(--color-ink)]/40 px-4 py-3 font-mono text-[10px] tracking-[0.14em] text-[var(--color-paper)]/45 uppercase">
              {site.icpBadge}
            </p>
          </div>
        </div>

        {/* Right col: form */}
        <div data-reveal>
          <LeadForm />
        </div>
      </div>
    </section>
  )
}
