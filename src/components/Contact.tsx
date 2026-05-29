import { site } from '../data/content'
import { LeadForm } from './LeadForm'

export function Contact() {
  const ctaHref = site.calendly || `mailto:${site.email}`

  return (
    <section id="contact" data-section className="section-pad border-t border-rule">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p data-reveal className="section-label">
            Contact
          </p>
          <h2
            data-reveal
            className="font-headline mt-3 text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] normal-case"
          >
            Porozmawiajmy o Twoim projekcie
          </h2>
          <p data-reveal className="text-muted mt-6 leading-relaxed">
            Napisz krótko, co nie działa — odpowiem w jeden dzień roboczy.
          </p>

          <div data-reveal className="mt-8 flex flex-wrap gap-4">
            <a href={`mailto:${site.email}`} className="btn-fill">
              {site.email}
            </a>
            {site.calendly ? (
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-soft"
              >
                Umów rozmowę
              </a>
            ) : null}
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-soft"
            >
              GitHub
            </a>
          </div>

          <footer data-reveal className="text-muted mt-16 text-xs">
            © {new Date().getFullYear()} {site.name}
          </footer>
        </div>

        <div data-reveal>
          <LeadForm />
        </div>
      </div>
    </section>
  )
}
