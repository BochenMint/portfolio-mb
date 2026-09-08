import { liveProof, sections, trustPoints } from '../../i18n/live'

export function ProofV5() {
  return (
    <section id="volt-proof" className="volt-proof volt-wrap" aria-labelledby="volt-proof-title">
      <p className="volt-mono">{sections.testimonials.num} · dowód</p>
      <h2 id="volt-proof-title" data-volt-split>
        {sections.testimonials.title}
      </h2>
      <p style={{ margin: '0 0 2rem', maxWidth: '48ch', opacity: 0.85 }}>{sections.testimonials.lead}</p>

      <div className="volt-proof-live">
        {liveProof.map((item) => (
          <a
            key={item.name}
            href={item.url}
            className="volt-proof-card"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="volt-proof-tag">{item.tag}</p>
            <h3>{item.name}</h3>
            <p className="volt-proof-result">{item.result}</p>
          </a>
        ))}
      </div>

      <div className="volt-trust-grid">
        {trustPoints.map((point) => (
          <article key={point.title} className="volt-trust-item">
            <h4>{point.title}</h4>
            <p>{point.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
