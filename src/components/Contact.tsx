import { site } from '../data/content'
import { LeadForm } from './LeadForm'
import { MagneticButton } from './MagneticButton'

export function Contact() {
  const ctaHref = site.calendly || `mailto:${site.email}`

  return (
    <section id="kontakt" data-section className="gradient-mesh px-5 py-24 pb-32 md:px-10 md:py-36 md:pb-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p data-reveal className="text-mint text-xs font-semibold tracking-[0.3em] uppercase">
            Kontakt
          </p>
          <h2
            data-reveal
            className="font-display mt-4 text-[clamp(2rem,5vw,3.5rem)] leading-tight font-bold"
          >
            Porozmawiajmy o Twoim procesie — nie o „stronie”.
          </h2>
          <p data-reveal className="text-muted mt-6 text-lg leading-relaxed">
            Wyślij brief albo umów audyt. {site.responseTime}.
          </p>

          <ul data-reveal className="mt-8 space-y-3 text-sm text-cream/80">
            <li>✓ Umowa + NDA standard</li>
            <li>✓ Hosting EU · RODO w scope</li>
            <li>✓ Możesz wysłać link do Plumm / Previo / Excel</li>
          </ul>

          <div data-reveal className="mt-10 flex flex-wrap gap-4">
            <MagneticButton
              href={ctaHref}
              external={!!site.calendly}
              className="rounded-full bg-mint px-8 py-3.5 text-sm font-bold text-ink"
            >
              {site.ctaPrimary}
            </MagneticButton>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-full px-6 py-3.5 text-sm text-cream/80 hover:text-mint"
            >
              GitHub →
            </a>
          </div>

          <p data-reveal className="text-muted mt-12 text-xs">
            © {new Date().getFullYear()} {site.name} · {site.brand}
          </p>
        </div>

        <div data-reveal>
          <LeadForm />
        </div>
      </div>
    </section>
  )
}
