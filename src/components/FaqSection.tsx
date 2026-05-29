import { faq, sections } from '../data/content'
import { SectionIntro } from './SectionIntro'

export function FaqSection() {
  return (
    <section id="faq" data-section className="section-pad border-t border-[var(--color-paper)]/15">
      <div className="mx-auto max-w-6xl">
        <SectionIntro num={sections.faq.num} title={sections.faq.title} lead={sections.faq.lead} />

        <dl className="divide-y divide-[var(--color-paper)]/12">
          {faq.map((item) => (
            <div key={item.question} data-reveal className="py-8 first:pt-0 md:py-10">
              <dt className="font-headline text-lg leading-snug md:text-xl">{item.question}</dt>
              <dd className="text-muted mt-3 max-w-3xl text-base leading-relaxed">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
