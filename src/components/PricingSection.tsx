import { pricingPackages, sections, site } from '../data/content'
import { SectionIntro } from './SectionIntro'

export function PricingSection() {
  const ctaHref = site.calendly || '#contact'
  const isExternal = Boolean(site.calendly)

  return (
    <section
      id="pricing"
      data-section
      className="section-pad relative overflow-hidden border-t border-[var(--color-paper)]/12 bg-[radial-gradient(circle_at_76%_14%,rgba(245,165,36,0.13),transparent_24rem),rgba(236,234,228,0.025)]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/55 to-transparent" aria-hidden />
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          num={sections.pricing.num}
          title={sections.pricing.title}
          lead={sections.pricing.lead}
        />

        <div data-reveal className="mb-6 grid gap-3 md:grid-cols-3">
          {['Minimum: ROI lub kontrola operacji', 'Kod i wdrożenie po Twojej stronie', 'Zakres cięty przed budżetem'].map((item) => (
            <div key={item} className="rounded-2xl border border-[var(--color-paper)]/10 bg-[var(--color-paper)]/[0.035] px-4 py-3 font-mono text-[10px] leading-relaxed tracking-[0.12em] text-[var(--color-paper)]/52 uppercase">
              {item}
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3 lg:items-stretch lg:gap-5">
          {pricingPackages.map((pkg) => (
            <article
              key={pkg.name}
              data-reveal
              className={`relative flex min-h-full flex-col overflow-hidden rounded-[1.8rem] border p-6 transition duration-300 hover:-translate-y-1 md:p-7 ${
                pkg.featured
                  ? 'border-accent/55 bg-[radial-gradient(circle_at_50%_0%,rgba(245,165,36,0.2),transparent_18rem),rgba(245,165,36,0.075)] shadow-[0_30px_110px_rgba(0,0,0,0.35)] lg:-mt-4 lg:min-h-[620px]'
                  : 'border-[var(--color-paper)]/14 bg-[var(--color-surface)]/70'
              }`}
            >
              <span className="pointer-events-none absolute -right-12 top-10 h-32 w-32 rounded-full bg-accent/10 blur-3xl" aria-hidden />
              {pkg.featured ? (
                <span className="mb-5 w-fit rounded-full border border-accent/35 bg-accent/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-accent uppercase">
                  Najczęstszy start
                </span>
              ) : null}

              <h3 className="font-headline text-2xl leading-tight">{pkg.name}</h3>
              <p className="text-sunset font-headline mt-4 text-[clamp(2.1rem,4vw,3.35rem)] leading-none">
                {pkg.range}
              </p>
              <p className="font-mono mt-4 text-[11px] leading-relaxed tracking-[0.08em] text-[var(--color-paper)]/55 uppercase">
                {pkg.qualifier}
              </p>
              <p className="text-muted mt-5 text-sm leading-relaxed">{pkg.bestFor}</p>

              <ul className="mt-7 space-y-3 border-t border-[var(--color-paper)]/10 pt-6">
                {pkg.deliverables.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-[var(--color-paper)]/78">
                    <span className="mt-2 h-px w-4 shrink-0 bg-accent/70" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-auto border-t border-[var(--color-paper)]/10 pt-5 text-xs leading-relaxed text-[var(--color-paper)]/45">
                {pkg.proof}
              </p>
            </article>
          ))}
        </div>

        <div
          data-reveal
          className="mt-10 flex flex-col gap-5 rounded-[1.8rem] border border-accent/18 bg-[linear-gradient(135deg,rgba(245,165,36,0.09),rgba(236,234,228,0.025))] p-5 md:flex-row md:items-center md:justify-between md:p-6"
        >
          <div>
            <p className="font-headline text-2xl leading-tight">Nie kupuj wdrożenia, jeśli problem nie ma ekonomii.</p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-paper)]/65">
              Jeśli budżet, dane lub integracje nie dają ROI, powiem to na audycie i zaproponuję mniejszy zakres.
            </p>
          </div>
          <a
            href={ctaHref}
            className="btn-accent premium-cta justify-center whitespace-nowrap"
            {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            Sprawdźmy projekt
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
