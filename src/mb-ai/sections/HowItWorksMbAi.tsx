import { useMbAiCopy } from '../../i18n'

export function HowItWorksMbAi() {
  const copy = useMbAiCopy()

  return (
    <section id="jak-dziala" className="mx-auto max-w-6xl px-5 py-24 md:py-32 md:px-8">
      <div className="mb-16 max-w-2xl">
        <p className="mbai-label mb-4">{copy.howKicker}</p>
        <h2 className="mbai-display text-[clamp(2rem,5vw,3.25rem)] text-balance mb-5">
          {copy.howTitleBefore}
          <em className="mbai-serif-accent">{copy.howTitleEm}</em>
        </h2>
        <p className="text-muted text-base leading-relaxed">{copy.howLead}</p>
      </div>

      <ol className="mbai-steps flex flex-col gap-10 md:gap-0">
        {copy.steps.map((step, i) => (
          <li
            key={step.num}
            className={`relative flex gap-5 md:grid md:grid-cols-2 md:gap-16 md:py-10 ${
              i % 2 === 1 ? 'md:[&>div:last-child]:md:col-start-1 md:[&>div:last-child]:md:row-start-1 md:[&>div:first-child]:md:col-start-2' : ''
            }`}
          >
            <div className="flex gap-5 md:justify-end md:pr-12">
              <div className="mbai-step-node relative z-10 mt-0.5 md:absolute md:left-1/2 md:-translate-x-1/2">
                <span>{step.num}</span>
              </div>
              <div className="md:text-right md:max-w-sm">
                <h3 className="font-[family-name:var(--font-grotesk)] font-semibold text-[var(--color-paper)] text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
            <div className="hidden md:block" aria-hidden />
          </li>
        ))}
      </ol>
    </section>
  )
}
