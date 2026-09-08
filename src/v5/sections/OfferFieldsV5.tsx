import { sections, services } from '../../i18n/live'

export function OfferFieldsV5() {
  return (
    <section id="volt-offer" className="volt-offer" aria-labelledby="volt-offer-title">
      <div className="volt-offer-head volt-wrap">
        <p className="volt-mono">{sections.services.num} · oferta</p>
        <h2 id="volt-offer-title" data-volt-split>
          {sections.services.title}
        </h2>
        <p>{sections.services.lead}</p>
      </div>
      <div className="volt-offer-track">
        {services.map((service) => (
          <article key={service.num} className="volt-offer-field">
            <span className="volt-offer-num" aria-hidden>
              {service.num}
            </span>
            <div className="volt-offer-content">
              <h3 data-volt-split>{service.title}</h3>
              <p>{service.description}</p>
              <p>
                <strong>{service.outcome}</strong>
              </p>
              <div className="volt-offer-meta">
                <span>{service.from}</span>
                <span>{service.timeline}</span>
                <span>{service.tags.join(' · ')}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
