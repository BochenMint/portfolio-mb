import { site, results, proofProducts, liveProof } from '../../i18n/live'
import { useLocale } from '../../i18n'
import { getArchiveUi } from '../../i18n/archive-ui'
import { AgentTerminal } from './AgentTerminal'

export function BentoHero() {
  const { locale } = useLocale()
  const ui = getArchiveUi(locale)
  const byName = Object.fromEntries(liveProof.map((p) => [p.name, p]))
  const products = proofProducts.map((p) => ({
    name: p.name,
    url: p.url,
    live: p.live,
    tag: byName[p.name]?.tag ?? 'AI',
    result: byName[p.name]?.result ?? ui.v2AgentFallback,
  }))
  const ctaHref = site.calendly || '#console'

  return (
    <section id="top" className="relative z-10 mx-auto max-w-[1400px] px-5 pt-28 pb-10 md:px-8 md:pt-32">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Operator */}
        <div className="v2-panel v2-hud reveal p-7 md:p-10 lg:col-span-8">
          <p className="v2-label">{site.icpBadge}</p>
          <h1 className="v2-display mt-6 text-[clamp(2.6rem,7vw,5.5rem)]">
            Marcin <span className="text-accent">Bochenek</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--color-paper)]/75 md:text-lg">
            {site.subhead}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={ctaHref}
              className="btn-accent"
              {...(site.calendly ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {site.ctaPrimary}
              <span aria-hidden>→</span>
            </a>
            <a href="#deployments" className="btn-soft border-[var(--v2-line-bright)]">
              {ui.work}
            </a>
          </div>
        </div>

        {/* Portrait */}
        <div className="v2-panel reveal relative min-h-[280px] lg:col-span-4 lg:row-span-2">
          <img
            src={site.photo}
            alt={site.photoAlt}
            className="absolute inset-0 h-full w-full object-cover object-top opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-transparent to-transparent" />
          <span className="v2-pill absolute top-4 right-4">
            <span className="v2-dot" />
            {ui.triCity}
          </span>
          <div className="absolute right-0 bottom-0 left-0 p-5">
            <p className="v2-label">operator</p>
            <p className="font-grotesk mt-1 text-base font-semibold">{site.role}</p>
          </div>
        </div>

        {/* Agent terminal */}
        <div className="v2-panel v2-panel--2 v2-hud reveal p-5 lg:col-span-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="v2-label">agent.log</p>
            <span className="v2-pill">
              <span className="v2-dot" />
              live
            </span>
          </div>
          <AgentTerminal />
        </div>

        {/* Metrics */}
        <div className="v2-panel reveal p-5 lg:col-span-4">
          <p className="v2-label">{ui.recovered}</p>
          <ul className="mt-3 space-y-2.5">
            {results.slice(0, 3).map((r) => (
              <li
                key={r.label}
                className="flex items-baseline justify-between gap-3 border-b border-[var(--v2-line)] pb-2 last:border-0 last:pb-0"
              >
                <span className="v2-metric text-2xl">{r.value}</span>
                <span className="v2-mono max-w-[58%] text-right text-[10px] leading-tight text-[var(--color-ink-muted)]">
                  {r.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Product status strip */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => {
          const live = p.live && p.url.startsWith('http')
          const inner = (
            <>
              <div className="flex items-center justify-between">
                <span className="v2-mono text-[10px] tracking-[0.16em] text-accent uppercase">{p.tag}</span>
                {live ? (
                  <span className="v2-pill">
                    <span className="v2-dot" />
                    live ↗
                  </span>
                ) : (
                  <span className="v2-label">wewnętrzny</span>
                )}
              </div>
              <p className="font-grotesk mt-3 text-lg font-semibold">{p.name}</p>
              <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-paper)]/60">{p.result}</p>
            </>
          )
          return live ? (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="v2-panel v2-panel-link reveal block p-5"
            >
              {inner}
            </a>
          ) : (
            <div key={p.name} className="v2-panel reveal block p-5">
              {inner}
            </div>
          )
        })}
      </div>
    </section>
  )
}
