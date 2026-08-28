import { results, resultsDisclaimer } from '../../i18n/live'

export function ProofV6() {
  return (
    <section id="liczby" className="v6-proof v6-section" aria-labelledby="v6-proof-title">
      <div className="v6-wrap v6-section-rail">
        <p className="v6-section-index" aria-hidden>01</p>
        <div className="v6-section-body">
          <div className="v6-section-head">
            <p className="v6-eyebrow">Koszt bez zmiany</p>
            <h2 id="v6-proof-title" data-v6-split>
              Co ucieka, gdy proces stoi na Excelu i portalach
            </h2>
          </div>

          <div className="v6-proof-grid">
            {results.map((metric) => (
              <article key={metric.label} className="v6-proof-cell">
                <p className="v6-proof-value">{metric.value}</p>
                <p className="v6-proof-label">{metric.label}</p>
                {metric.hint ? <p className="v6-proof-hint">{metric.hint}</p> : null}
              </article>
            ))}
          </div>

          <p className="v6-proof-disclaimer">{resultsDisclaimer()}</p>
          <div className="v6-rule v6-rule-reveal" aria-hidden />
        </div>
      </div>
    </section>
  )
}
