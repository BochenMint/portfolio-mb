import { site } from '../data/content'
import { LeadForm } from './LeadForm'
import { MagneticButton } from './MagneticButton'
import { SectionIntro } from './SectionIntro'

export function Contact() {
  const ctaHref = site.calendly || `mailto:${site.email}`

  return (
    <section id="contact" data-section className="section-pad">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionIntro
            num="04"
            title="Kontakt"
            lead="Napisz krótko, co nie działa — odpowiem w jeden dzień roboczy."
          />

          <div data-reveal className="mt-8 flex flex-wrap gap-4">
            <MagneticButton
              href={`mailto:${site.email}`}
              className="btn-fill border border-[var(--color-paper)] bg-[var(--color-paper)] text-[var(--color-ink)]"
            >
              {site.email}
            </MagneticButton>
            {site.calendly ? (
              <MagneticButton href={ctaHref} className="btn-soft" external>
                Umów rozmowę
              </MagneticButton>
            ) : null}
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-soft border-[var(--color-paper)]/25 text-[var(--color-paper)]"
            >
              GitHub
            </a>
          </div>
        </div>

        <div data-reveal>
          <LeadForm />
        </div>
      </div>
    </section>
  )
}
