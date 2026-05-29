import { site } from '../data/content'
import { Portrait } from './Portrait'

export function About() {
  return (
    <section id="about" data-section className="section-pad border-t border-rule">
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="section-label">
          About
        </p>
        <div className="mt-8 grid items-start gap-10 md:grid-cols-[minmax(200px,280px)_1fr] md:gap-12 lg:gap-16">
          <figure
            data-reveal
            className="border-rule mx-auto aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-2xl border bg-surface md:mx-0"
          >
            <Portrait
              sizes="(min-width: 768px) 280px, 64vw"
              className="h-full w-full"
            />
          </figure>
          <div className="min-w-0">
            <h2
              data-reveal
              className="font-display text-3xl leading-tight md:text-4xl"
            >
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
        </div>
      </div>
    </section>
  )
}
