import { useLocale } from '../i18n/context'
import { ChromeCard, SectionHeader } from './primitives'

export function Process() {
  const { t: c, content } = useLocale()
  const process = content.process

  return (
    <section id="proces" className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow={c.process.eyebrow} title={c.process.title} lead={c.process.lead} />

        <ChromeCard tone="brushed" className="mt-14 p-6 md:p-10">
          <div className="hidden lg:block">
            <div className="hairline opacity-50" />
            <ol className="mt-10 grid grid-cols-4 gap-10">
              {process.map((step) => (
                <li key={step.step} data-card className="flex flex-col gap-4">
                  <p className="engraved font-display text-5xl font-semibold tracking-[-0.03em] opacity-90">
                    {step.step}
                  </p>
                  <h3 className="engraved text-lg font-semibold tracking-[-0.01em]">{step.title}</h3>
                  <p className="engraved text-[15px] leading-relaxed opacity-70">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>

          <ol className="flex flex-col gap-8 lg:hidden">
            {process.map((step) => (
              <li key={step.step} data-card className="relative flex flex-col gap-2 pl-6">
                <div className="hairline-v absolute top-0 left-0 h-full" />
                <p className="engraved font-display text-4xl font-semibold tracking-[-0.03em] opacity-90">
                  {step.step}
                </p>
                <h3 className="engraved text-lg font-semibold tracking-[-0.01em]">{step.title}</h3>
                <p className="engraved text-[15px] leading-relaxed opacity-70">{step.text}</p>
              </li>
            ))}
          </ol>
        </ChromeCard>
      </div>
    </section>
  )
}
