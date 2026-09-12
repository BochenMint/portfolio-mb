import { useEffect } from 'react'
import { useLocale } from '../i18n/context'
import { ChromeCard, SectionHeader } from './primitives'

const FAQ_JSONLD_ID = 'faq-jsonld'

export function FAQ() {
  const { t: c, content } = useLocale()
  const faq = content.faq

  // FAQPage structured data for the homepage's real 6-question FAQ, built
  // from the same `content.faq` the visible <details> below renders — one
  // source of truth, so the JSON-LD can never drift from the copy on the
  // page. Injected at runtime rather than baked into each locale's <head>
  // because `content.faq` is already locale-aware (see src/chrome/data/i18n.ts).
  useEffect(() => {
    let script = document.getElementById(FAQ_JSONLD_ID) as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = FAQ_JSONLD_ID
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    })
    return () => {
      script?.remove()
    }
  }, [faq])

  return (
    <section id="faq" className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeader eyebrow={c.faq.eyebrow} title={c.faq.title} />
        </div>

        <ChromeCard tone="dark" data-card className="p-2 md:p-4">
          {faq.map((item, i) => (
            <div key={item.q}>
              {i > 0 && <div className="hairline" />}
              <details className="group px-4 py-6 md:px-6 md:py-8">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                  <span
                    data-reveal
                    className="font-display text-lg text-white tracking-[-0.01em]"
                  >
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className="chrome-text relative shrink-0 text-2xl font-light transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-silver-2">{item.a}</p>
              </details>
            </div>
          ))}
        </ChromeCard>
      </div>
    </section>
  )
}
