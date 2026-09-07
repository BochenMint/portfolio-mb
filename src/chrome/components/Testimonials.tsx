import { useLocale } from '../i18n/context'
import { ChromeCard, SectionHeader } from './primitives'

export function Testimonials() {
  const { t: c, content } = useLocale()
  const testimonials = content.testimonials

  return (
    <section id="opinie" className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow={c.testimonials.eyebrow} title={c.testimonials.title} align="center" />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <ChromeCard
              key={t.author}
              as="article"
              data-card
              tone="brushed"
              className="flex flex-col p-8 md:p-10"
            >
              <span aria-hidden className="chrome-text-soft text-5xl leading-none font-semibold">
                &ldquo;
              </span>
              <p className="mt-4 flex-1 text-lg leading-relaxed font-light text-white">
                {t.quote}
              </p>
              <div className="hairline mt-8" />
              <div className="mt-6">
                <p className="text-sm font-medium text-white">{t.author}</p>
                <p className="mt-1 text-xs text-muted">{t.role}</p>
                <p className="mt-2 font-mono text-[11px] text-muted">{t.year}</p>
              </div>
            </ChromeCard>
          ))}
        </div>
      </div>
    </section>
  )
}
