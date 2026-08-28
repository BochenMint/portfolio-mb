import { results, resultsDisclaimer, site } from '../../i18n/live'

export function CostLedgerV5() {
  return (
    <section id="volt-ledger" className="volt-ledger" aria-labelledby="volt-ledger-title">
      <div className="volt-ledger-head volt-wrap">
        <p className="volt-mono">{site.footerCta.line1}</p>
        <h2 id="volt-ledger-title" data-volt-split>
          {site.footerCta.line2}
        </h2>
        <p>{site.icpBadge}</p>
      </div>
      <div className="volt-ledger-table">
        {results.map((row) => (
          <article key={row.label} className="volt-ledger-row">
            <div className="volt-ledger-value">{row.value}</div>
            <p className="volt-ledger-label">{row.label}</p>
            {row.hint ? <p className="volt-ledger-hint">{row.hint}</p> : <span />}
          </article>
        ))}
      </div>
      <p className="volt-ledger-disclaimer">{resultsDisclaimer()}</p>
    </section>
  )
}
