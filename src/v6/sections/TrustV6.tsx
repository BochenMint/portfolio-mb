import { liveProof, sections, trustPoints } from '../../i18n/live'

export function TrustV6() {
  return (
    <section id="zaufanie" className="v6-trust v6-section" aria-labelledby="v6-trust-title">
      <div className="v6-wrap v6-section-rail">
        <p className="v6-section-index" aria-hidden>{sections.testimonials.num}</p>
        <div className="v6-section-body">
          <div className="v6-section-head">
            <p className="v6-eyebrow">Dowód</p>
            <h2 id="v6-trust-title" data-v6-split>{sections.testimonials.title}</h2>
            <p className="v6-section-lead">{sections.testimonials.lead}</p>
          </div>

          <div className="v6-live-grid">
            {liveProof.map((item) => (
              <article key={item.name} className="v6-live-card">
                <p className="v6-live-tag">{item.tag}</p>
                <h3>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.name}
                  </a>
                </h3>
                <p>{item.result}</p>
                <a
                  href={item.url}
                  className="v6-live-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sprawdź na żywo →
                </a>
              </article>
            ))}
          </div>

          <div className="v6-trust-grid">
            {trustPoints.map((point) => (
              <article key={point.title} className="v6-trust-point">
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </article>
            ))}
          </div>

          <div className="v6-rule v6-rule-reveal" aria-hidden />
        </div>
      </div>
    </section>
  )
}
