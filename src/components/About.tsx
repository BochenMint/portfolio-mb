import { site } from '../data/content'

export function About() {
  return (
    <section id="about" data-section className="section-pad border-t border-rule">
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="section-label">
          About
        </p>
        <h2 data-reveal className="font-display mt-3 max-w-3xl text-3xl leading-tight md:text-4xl">
          Cześć — buduję produkty, które działają w niedzielę o 23:00.
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 md:gap-12">
          <p data-reveal className="text-lg leading-relaxed">
            {site.aboutLead}
          </p>
          <p data-reveal className="text-muted leading-relaxed">
            {site.aboutAside}
          </p>
        </div>
        <p data-reveal className="text-muted mt-10 text-sm">
          {site.responseTime} · {site.location}
        </p>
      </div>
    </section>
  )
}
