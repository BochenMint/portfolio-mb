/**
 * The content sections every niche landing shares: what you get, how it
 * runs, what it costs, what people ask — and the contact block under them.
 *
 * These started life as `krajobraz/components/{Offer,Contact}.tsx` and were
 * generalised the moment a second trade needed the same four sections with
 * different words in them. The markup here is that original markup, moved
 * verbatim: the landings differ in copy, in the small glyph that marks a
 * list item, and in nothing else. Anything a landing wants to say arrives
 * through `OfferContent` / `ContactContent`; anything about how it looks
 * comes from the `--stage-*` and palette custom properties its own CSS sets.
 *
 * Why data rather than props-per-string: the same object feeds the page's
 * FAQPage JSON-LD, so the questions a visitor reads and the questions a
 * search engine is told about cannot drift apart.
 */

import type { ReactNode } from 'react'
import { Inquiry, type InquiryField } from './Inquiry'

export type OfferBlock = { title: string; body: string }
export type ProcessStep = { number: string; title: string; body: string }
export type PriceTier = { name: string; price: string; desc: string }
export type FaqItem = { q: string; a: string }

export type OfferContent = {
  offer: { eyebrow: string; heading: string; blocks: OfferBlock[] }
  process: { eyebrow: string; heading: string; steps: ProcessStep[] }
  price: { eyebrow: string; heading: string; lead: string; tiers: PriceTier[] }
  faq: { eyebrow: string; heading: string; items: FaqItem[] }
}

export type ContactRow = { label: string; value: string; href: string; external?: boolean }

export type ContactContent = {
  eyebrow: string
  heading: string
  lead: string
  listHeading: string
  bullets: string[]
  priceLine: string
  rows: ContactRow[]
  /** Sits under the contact rows: how quickly an answer comes back. */
  responseTime: string
  /** Web3Forms' `source`, so replies can be told apart by landing. */
  source: string
  formHeading: string
  fields: InquiryField[]
  buildSubject: (body: Record<string, string>) => string
  /** The tint behind the contact copy — each trade's own ground colour. */
  glow: string
}

const cardStyle = { background: 'var(--card-bg)', borderColor: 'var(--card-border)' }
const sectionBg = { background: 'var(--page-bg)' }

export function OfferSections({ content, marker }: { content: OfferContent; marker: ReactNode }) {
  const { offer, process, price, faq } = content
  return (
    <>
      <section id="oferta" style={sectionBg} className="px-5 pt-24 pb-16 md:px-10 md:pt-32 md:pb-20">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">{offer.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-semibold text-[var(--cream)] md:text-4xl">{offer.heading}</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-x-12 md:gap-y-12">
            {offer.blocks.map((block) => (
              <div key={block.title} className="flex gap-4">
                {marker}
                <div>
                  <h3 className="font-display text-lg font-semibold text-[var(--cream)]">{block.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--cream-dim)]">{block.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="proces" style={sectionBg} className="px-5 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="hairline" />
          <div className="mt-16 md:mt-20">
            <p className="eyebrow">{process.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--cream)] md:text-4xl">{process.heading}</h2>
            <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
              {process.steps.map((step) => (
                <div key={step.title} className="flex gap-4">
                  <span aria-hidden className="offer-step-num">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-[var(--cream)]">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--cream-dim)]">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="inwestycja" style={sectionBg} className="px-5 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="hairline" />
          <div className="mt-16 md:mt-20">
            <p className="eyebrow">{price.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--cream)] md:text-4xl">{price.heading}</h2>
            <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-[var(--cream-dim)]">{price.lead}</p>

            <div style={cardStyle} className="mt-8 rounded-2xl border px-6 md:px-8">
              {price.tiers.map((tier, i) => (
                <div key={tier.name}>
                  {i > 0 && <div className="hairline" />}
                  <div className="price-ladder-row">
                    <div className="price-ladder-heading">
                      <span className="price-ladder-name">{tier.name}</span>
                      <span className="price-ladder-value">{tier.price}</span>
                    </div>
                    <p className="price-ladder-desc">{tier.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" style={sectionBg} className="px-5 pt-16 pb-24 md:px-10 md:pt-20 md:pb-32">
        <div className="mx-auto max-w-6xl">
          <div className="hairline" />
          <div className="mt-16 md:mt-20">
            <p className="eyebrow">{faq.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--cream)] md:text-4xl">{faq.heading}</h2>

            <div style={cardStyle} className="mt-8 rounded-2xl border">
              {faq.items.map((item, i) => (
                <div key={item.q}>
                  {i > 0 && <div className="hairline" />}
                  <details className="group px-6 py-6 md:px-8">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                      <span className="font-display text-base font-semibold text-[var(--cream)] md:text-lg">
                        {item.q}
                      </span>
                      <span
                        aria-hidden
                        className="relative shrink-0 text-2xl font-light text-[var(--accent-mark)] transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--cream-dim)]">{item.a}</p>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export function ContactSection({ content, marker }: { content: ContactContent; marker: ReactNode }) {
  return (
    <section
      id="kontakt"
      style={{
        // Starts on the colour the stage's closing scrim ends on; the faint
        // lift of the trade's own colour sits behind the copy, clear of the
        // top edge.
        background: content.glow,
      }}
      className="px-5 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-semibold text-[var(--cream)] md:text-4xl">{content.heading}</h2>
          <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-[var(--cream-dim)]">{content.lead}</p>

          <div className="mt-10">
            <p className="eyebrow">{content.listHeading}</p>
            <ul className="mt-4 space-y-3">
              {content.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--cream)]">
                  {marker}
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 text-sm text-[var(--cream-dim)]">{content.priceLine}</p>

          <div className="mt-10">
            <div className="hairline" />
            {content.rows.map((row) => (
              <div key={row.label}>
                <a
                  href={row.href}
                  {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex items-center justify-between gap-4 py-4"
                >
                  <span className="eyebrow">{row.label}</span>
                  <span className="text-sm text-[var(--cream)] transition-transform group-hover:translate-x-1">
                    {row.value}
                  </span>
                </a>
                <div className="hairline" />
              </div>
            ))}
            <p className="mt-4 text-sm text-[var(--cream-dim)]">{content.responseTime}</p>
          </div>
        </div>

        <Inquiry
          source={content.source}
          fields={content.fields}
          heading={content.formHeading}
          buildSubject={content.buildSubject}
        />
      </div>
    </section>
  )
}
