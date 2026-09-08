import { process, sections } from '../i18n/live'
import { SectionIntro } from './SectionIntro'

export function ProcessSection() {
  return (
    <section
      id="process"
      data-section
      className="section-pad border-t border-[var(--color-paper)]/12 bg-[var(--color-paper)]/[0.012]"
    >
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          num={sections.process.num}
          title={sections.process.title}
          lead={sections.process.lead}
        />

        <ol className="relative grid gap-4 md:grid-cols-2">
          {/* connecting accent line — visible md+ */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-8 bottom-8 hidden w-px md:block"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, rgba(245,165,36,0.28) 14%, rgba(255,94,58,0.22) 86%, transparent 100%)',
            }}
          />

          {process.map((step, i) => (
            <li
              key={step.num}
              data-reveal
              className="relative rounded-[1.6rem] border border-[var(--color-paper)]/12 bg-[var(--color-surface)]/62 p-5 transition duration-300 hover:border-accent/30 hover:bg-[var(--color-paper)]/[0.04] md:p-6"
            >
              {/* step number bubble — accent ring on first step */}
              <div className="mb-6 flex justify-between gap-4">
                <div
                  className={[
                    'relative z-10 flex h-[2.75rem] w-[2.75rem] items-center justify-center rounded-full',
                    i === 0
                      ? 'bg-accent/10 ring-1 ring-accent/60'
                      : 'bg-[var(--color-surface)] ring-1 ring-[var(--color-paper)]/15',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'font-mono text-[13px] font-semibold tabular-nums',
                      i === 0 ? 'text-accent' : 'text-[var(--color-paper)]/40',
                    ].join(' ')}
                  >
                    {step.num}
                  </span>
                </div>
                <span className="font-mono text-[10px] tracking-[0.14em] text-[var(--color-paper)]/28 uppercase">
                  krok {step.num}
                </span>
              </div>

              <div className="min-w-0">
                <h3 className="font-headline text-xl leading-tight md:text-2xl">
                  {step.title}
                </h3>
                <p className="text-muted mt-3 max-w-prose text-base leading-relaxed">
                  {step.description}
                </p>

                {/* accent hairline at the bottom of each step (mobile connector) */}
                {i < process.length - 1 && (
                  <div aria-hidden className="accent-hairline mt-8 opacity-20 md:hidden" />
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
