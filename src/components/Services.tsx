import { services } from '../data/content'
import { SectionIntro } from './SectionIntro'

export function Services() {
  return (
    <section id="services" data-section className="section-pad border-t border-[var(--color-paper)]/15">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          num="02"
          title="Usługi"
          lead="Trzy filary — od pierwszego wireframe’u po agentów z audytem kroków."
        />

        <div className="divide-y divide-[var(--color-paper)]/12">
          {services.map((service) => (
            <article
              key={service.num}
              data-service-block
              className="grid gap-6 py-12 first:pt-0 md:grid-cols-[minmax(5rem,7rem)_1fr] md:gap-12 md:py-16"
            >
              <p className="font-headline text-[clamp(3rem,8vw,5.5rem)] leading-none text-[var(--color-paper)]/20">
                {service.num}
              </p>
              <div>
                <h3 data-reveal className="font-headline text-2xl leading-tight md:text-3xl">
                  {service.title}
                </h3>
                <p data-reveal className="text-muted mt-4 max-w-2xl text-base leading-relaxed md:text-lg">
                  {service.description}
                </p>
                <ul data-reveal className="text-muted mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs tracking-wide uppercase">
                  {service.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
