import { site } from '../data/content'
import { Portrait } from './Portrait'

export function About() {
  return (
    <section id="about" data-section className="section-pad border-t border-rule">
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="section-label">
          O mnie
        </p>
        <div className="mt-8 grid items-start gap-10 md:grid-cols-[minmax(200px,280px)_1fr] md:gap-12 lg:gap-16">
          <figure
            data-about-portrait
            className="border-rule mx-auto aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-sm border bg-surface will-change-transform md:mx-0"
          >
            <Portrait sizes="(min-width: 768px) 280px, 64vw" className="h-full w-full" />
          </figure>
          <div className="min-w-0">
            <blockquote
              data-pull-quote
              className="font-display border-l-2 border-accent pl-6 text-2xl leading-snug md:text-[1.65rem]"
            >
              Cześć — buduję produkty, które działają w niedzielę o 23:00.
            </blockquote>
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
