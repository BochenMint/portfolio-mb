import { sections, process } from '../../i18n/live'

export function Pipeline() {
  return (
    <section id="pipeline" className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
      {/* Section header */}
      <div className="reveal mb-16">
        <p className="v2-label">03 / PROCES</p>
        <h2 className="v2-display mt-4 text-[clamp(2rem,5vw,3.75rem)]">
          {sections.process.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-paper)]/60 md:text-lg">
          {sections.process.lead}
        </p>
      </div>

      {/* Pipeline — desktop horizontal, mobile vertical */}
      <div className="relative">
        {/* Desktop connector line */}
        <div
          className="absolute top-12 left-0 right-0 hidden h-px md:block"
          style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)', opacity: 0.25 }}
          aria-hidden
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-4">
          {process.map((step, idx) => {
            const isLast = idx === process.length - 1
            return (
              <div key={step.num} className="relative flex flex-col">
                {/* Mobile vertical connector */}
                {!isLast && (
                  <div
                    className="absolute top-full left-6 h-6 w-px md:hidden"
                    style={{ background: 'var(--color-accent)', opacity: 0.3 }}
                    aria-hidden
                  />
                )}

                <div className="v2-panel v2-hud reveal flex flex-col p-6 md:p-7">
                  {/* Node dot on desktop connector line */}
                  <div
                    className="mb-5 hidden h-3 w-3 rounded-full border border-accent md:block"
                    style={{ background: 'var(--v2-surface)', boxShadow: '0 0 0 3px color-mix(in srgb, var(--color-accent) 20%, transparent)' }}
                    aria-hidden
                  />

                  {/* Step number */}
                  <span className="v2-metric text-3xl md:text-4xl">{step.num}</span>

                  {/* Title */}
                  <h3 className="font-grotesk mt-4 text-base font-semibold leading-snug tracking-tight md:text-lg">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 flex-1 text-[13px] leading-relaxed text-[var(--color-paper)]/55">
                    {step.description}
                  </p>

                  {/* Step label */}
                  <p className="v2-label mt-5 border-t border-[var(--v2-line)] pt-4">
                    krok {step.num}
                  </p>
                </div>

                {/* Desktop arrow between cards */}
                {!isLast && (
                  <div
                    className="absolute top-12 -right-3 z-10 hidden items-center justify-center md:flex"
                    aria-hidden
                  >
                    <span className="v2-mono text-[10px] text-accent">›</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Timeline callout */}
      <div className="v2-panel reveal mt-8 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="v2-label mb-1">typowy czas od audytu do efektu</p>
            <p className="v2-metric text-2xl">2–12 tygodni</p>
          </div>
          <div className="h-px flex-1 bg-[var(--v2-line)] md:h-auto md:w-px md:min-h-[40px]" aria-hidden />
          <p className="max-w-xl text-[13.5px] leading-relaxed text-[var(--color-paper)]/55">
            Landing i formularz kontaktowy: 2–4 tygodnie. Direct booking z PMS lub panel z integracjami: 6–12 tygodni zależnie od API.
            Na audycie podam konkretny zakres dla Twojego przypadku.
          </p>
        </div>
      </div>
    </section>
  )
}
