import { useLocale } from '../i18n/context'
import { headlineFactsFor } from '../data/facts'
import { pick } from '../i18n/pick'
import { ChromeCard, SectionHeader } from './primitives'

/**
 * Live proof, not quotes.
 *
 * This section used to carry three testimonials that were written as
 * placeholders and never sourced from a real client. A studio of one has a
 * stronger and honest alternative: the products are public, so link them and
 * put a verifiable number next to each. Every figure here comes from
 * `data/facts/<project>.json`, where each entry carries the command that
 * produced it.
 */
export function Testimonials() {
  const { t: c, locale, content } = useLocale()
  const shown = content.projects

  return (
    <section id="opinie" className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow={c.testimonials.eyebrow} title={c.testimonials.title} align="center" />

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {shown.map((project) => {
            const facts = headlineFactsFor(project.id).slice(0, 2)
            return (
              <ChromeCard
                key={project.id}
                as="article"
                data-card
                tone="brushed"
                className="flex flex-col p-8 md:p-10"
              >
                <p className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
                  {project.domain}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-white">
                  {project.title}
                </h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-silver-2">
                  {project.tagline}
                </p>

                {facts.length > 0 && (
                  <>
                    <div className="hairline mt-8" />
                    <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
                      {facts.map((fact) => (
                        <div key={fact.id}>
                          <dt className="sr-only">
                            {pick(fact.short ?? fact.label, locale)}
                          </dt>
                          <dd className="font-display text-2xl font-semibold text-white">
                            {fact.value}
                          </dd>
                          <p className="mt-1 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
                            {pick(fact.short ?? fact.label, locale)}
                          </p>
                        </div>
                      ))}
                    </dl>
                  </>
                )}

                {project.url && project.url !== '#' ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 font-mono text-[11px] tracking-[0.14em] text-white uppercase transition-colors hover:text-silver-2"
                  >
                    {c.testimonials.open(project.domain)}
                  </a>
                ) : (
                  <p className="mt-8 font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
                    {c.testimonials.notPublic}
                  </p>
                )}
              </ChromeCard>
            )
          })}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-[13px] leading-relaxed text-muted">
          {c.testimonials.note}
        </p>
      </div>
    </section>
  )
}
