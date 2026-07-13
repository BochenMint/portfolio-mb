import { process, sections } from '../../data/content'

export function ProcessV3() {
  return (
    <section id="proces" className="mx-auto max-w-6xl px-5 py-24 md:py-32 md:px-8">
      {/* Section header */}
      <div className="mb-16">
        <p className="v3-label mb-4">03 / Proces</p>
        <h2 className="v3-display text-[clamp(2rem,5vw,3.5rem)] text-balance mb-5">
          Jak wygląda{' '}
          <em className="v3-serif-accent">współpraca</em>
        </h2>
        <p className="text-muted max-w-2xl text-base leading-relaxed">
          {sections.process.lead}
        </p>
      </div>

      {/* Steps grid */}
      <div className="grid md:grid-cols-4 gap-0 relative">
        {/* Desktop connector line */}
        <div
          className="hidden md:block absolute top-[1.75rem] left-0 right-0 h-px bg-[var(--v3-line-bright)]"
          aria-hidden
        />

        {process.map((step, i) => (
          <div
            key={step.num}
            className={[
              'reveal flex flex-col gap-3 px-0 pt-0 pb-8 md:pb-0',
              i !== 0 ? 'md:pl-8' : '',
              i !== process.length - 1 ? 'border-b border-[var(--v3-line)] md:border-b-0 md:border-r md:border-[var(--v3-line)] md:pr-8' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ paddingTop: i !== 0 ? '2rem' : 0 }}
          >
            {/* Node dot on desktop connector */}
            <div className="relative md:mb-2">
              <span
                className="hidden md:block w-2 h-2 rounded-full bg-accent absolute -top-[1.25rem] left-0"
                aria-hidden
              />
              <span className="v3-metric text-4xl leading-none">{step.num}</span>
            </div>

            <h3 className="font-grotesk font-semibold text-[var(--color-paper)] text-base leading-snug">
              {step.title}
            </h3>
            <p className="text-muted text-[13px] leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Timeline note */}
      <p className="v3-mono text-muted text-xs mt-12 text-center">
        Landing: 2–4 tyg. · Booking/panel z integracjami: 6–12 tyg.
      </p>
    </section>
  )
}
