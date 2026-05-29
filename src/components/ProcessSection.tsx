import { process, sections } from '../data/content'
import { SectionIntro } from './SectionIntro'

export function ProcessSection() {
  return (
    <section id="process" data-section className="section-pad border-t border-[var(--color-paper)]/15">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          num={sections.process.num}
          title={sections.process.title}
          lead={sections.process.lead}
        />

        <ol className="divide-y divide-[var(--color-paper)]/12">
          {process.map((step) => (
            <li
              key={step.num}
              data-reveal
              className="grid gap-4 py-10 first:pt-0 md:grid-cols-[minmax(4rem,5rem)_1fr] md:gap-10 md:py-12"
            >
              <span className="font-headline text-4xl leading-none text-[var(--color-paper)]/25 tabular-nums">
                {step.num}
              </span>
              <div>
                <h3 className="font-headline text-xl leading-tight md:text-2xl">{step.title}</h3>
                <p className="text-muted mt-3 max-w-2xl text-base leading-relaxed">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
