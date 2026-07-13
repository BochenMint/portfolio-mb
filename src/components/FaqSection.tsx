import { useState } from 'react'
import { faq, sections } from '../data/content'
import { SectionIntro } from './SectionIntro'

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i))
  }

  return (
    <section id="faq" data-section className="section-pad border-t border-[var(--color-paper)]/15">
      <div className="mx-auto max-w-6xl">
        <SectionIntro num={sections.faq.num} title={sections.faq.title} lead={sections.faq.lead} />

        <dl className="divide-y divide-[var(--color-paper)]/12">
          {faq.map((item, i) => {
            const isOpen = openIndex === i
            const panelId = `faq-panel-${i}`
            const headerId = `faq-header-${i}`

            return (
              <div key={item.question} data-reveal className="group">
                <dt>
                  <button
                    id={headerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(i)}
                    className="flex w-full items-start justify-between gap-6 py-8 text-left md:py-10"
                  >
                    <span className="flex items-start gap-4">
                      <span
                        className="font-mono mt-0.5 shrink-0 text-[10px] tracking-[0.14em] text-[var(--color-paper)]/30 uppercase"
                        aria-hidden
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`font-headline text-lg leading-snug transition-colors duration-200 md:text-xl ${isOpen ? 'text-accent' : 'text-[var(--color-paper)]'}`}
                      >
                        {item.question}
                      </span>
                    </span>
                    <span
                      className={`mt-1 shrink-0 font-mono text-lg leading-none transition-colors duration-200 ${isOpen ? 'text-accent' : 'text-[var(--color-paper)]/40'}`}
                      aria-hidden
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                </dt>
                <dd
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  hidden={!isOpen}
                  className="pb-8 md:pb-10"
                >
                  <p className="text-muted max-w-3xl pl-10 text-base leading-relaxed">
                    {item.answer}
                  </p>
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
