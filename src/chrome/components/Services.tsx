import { useLocale } from '../i18n/context'
import { ChromeCard, SectionHeader } from './primitives'

export function Services() {
  const { t: c, content } = useLocale()
  const services = content.services

  return (
    <section id="uslugi" className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow={c.services.eyebrow} title={c.services.title} lead={c.services.lead} />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {services.map((service, i) => (
            <ChromeCard
              key={service.title}
              as="article"
              data-card
              tone="dark"
              className="flex flex-col gap-6 p-7 md:p-8"
            >
              <p className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
                {String(i + 1).padStart(2, '0')}
              </p>
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.02em] text-white">{service.title}</h3>
                <p className="mt-2 text-lg font-light text-silver-2">{service.subtitle}</p>
              </div>
              <div className="hairline" />
              <ul className="flex flex-col gap-4">
                {service.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-white to-silver-2" />
                    <span className="text-[15px] leading-relaxed text-silver-2">{point}</span>
                  </li>
                ))}
              </ul>
            </ChromeCard>
          ))}
        </div>
      </div>
    </section>
  )
}
