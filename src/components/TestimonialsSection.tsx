import { sections, testimonials } from '../data/content'
import { SectionIntro } from './SectionIntro'

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      data-section
      className="section-pad border-t border-[var(--color-paper)]/15 bg-[var(--color-paper)]/[0.02]"
    >
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          num={sections.testimonials.num}
          title={sections.testimonials.title}
          lead={sections.testimonials.lead}
        />

        <div className="grid gap-8 md:grid-cols-3 md:gap-6">
          {testimonials.map((item) => (
            <figure
              key={item.quote.slice(0, 40)}
              data-reveal
              className="flex flex-col border border-[var(--color-paper)]/15 p-6 md:p-8"
            >
              <blockquote className="flex-1 text-base leading-relaxed text-[var(--color-paper)]/90">
                „{item.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-[var(--color-paper)]/12 pt-4">
                <p className="text-sm font-medium">{item.role}</p>
                <p className="text-muted text-xs">
                  {item.company}
                  {item.placeholder ? ' · [przykład]' : ''}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
