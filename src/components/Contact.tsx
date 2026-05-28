import { projects, site } from '../data/content'
import { LeadForm } from './LeadForm'
import { ProjectImage } from './ProjectImage'

export function Contact() {
  const ctaHref = site.calendly || `mailto:${site.email}`

  return (
    <section id="kontakt" className="section-pad editorial-rule border-t">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p data-reveal className="section-label">
            07 — Kontakt
          </p>
          <h2
            data-reveal
            className="font-display mt-4 text-[clamp(2rem,5vw,3.25rem)] leading-tight"
          >
            Opowiedz, co dziś nie działa — nie „ile stron”.
          </h2>
          <p data-reveal className="text-muted mt-6 leading-relaxed">
            Wyślij brief albo umów rozmowę. {site.responseTime}.
          </p>

          <div
            data-reveal
            className="border-rule mt-10 hidden aspect-[16/10] overflow-hidden border lg:block"
          >
            <ProjectImage project={projects[0]} variant="card" className="rounded-none" />
          </div>

          <div data-contact-cta className="mt-10 flex flex-wrap gap-4">
            <a
              href={ctaHref}
              className="btn-fill"
              {...(site.calendly ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {site.ctaPrimary}
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-soft"
            >
              GitHub
            </a>
            <a href={`mailto:${site.email}`} className="btn-soft">
              {site.email}
            </a>
          </div>

          <footer data-reveal className="text-muted mt-16 text-xs">
            © {new Date().getFullYear()} {site.name} · Polska
          </footer>
        </div>

        <div data-contact-cta>
          <LeadForm />
        </div>
      </div>
    </section>
  )
}
