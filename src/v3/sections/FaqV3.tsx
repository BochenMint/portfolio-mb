import { faq, sections } from '../../i18n/live'

export function FaqV3() {
  return (
    <section id="faq" className="mx-auto max-w-6xl px-5 py-24 md:py-32 md:px-8">
      <div className="mb-16">
        <p className="v3-label mb-4">
          {sections.faq.num} / {sections.faq.title}
        </p>
        <h2 className="v3-display text-[clamp(2rem,5vw,3.5rem)] text-balance mb-5">
          Pytania przed{' '}
          <em className="v3-serif-accent">pierwszą rozmową</em>
        </h2>
        <p className="text-muted max-w-2xl text-base leading-relaxed">{sections.faq.lead}</p>
      </div>

      <div className="border-t border-[var(--v3-line)]">
        {faq.map((item, i) => (
          <details
            key={item.question}
            className="v3-faq reveal group border-b border-[var(--v3-line)]"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-7 md:py-8 [&::-webkit-details-marker]:hidden">
              <span className="flex items-start gap-4">
                <span className="v3-mono mt-0.5 shrink-0 text-[10px] tracking-widest text-muted uppercase">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-grotesk text-base font-medium leading-snug text-[var(--color-paper)] transition-colors group-open:text-accent md:text-lg">
                  {item.question}
                </span>
              </span>
              <span
                className="v3-faq-chevron v3-mono mt-1 shrink-0 text-lg leading-none text-muted transition-[transform,color] duration-300 group-open:text-accent"
                aria-hidden
              >
                +
              </span>
            </summary>
            <div className="pb-7 pl-10 md:pb-8">
              <p className="text-muted max-w-3xl text-sm leading-relaxed md:text-base">{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
