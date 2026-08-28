import { services, sections } from '../../i18n/live'

export function OfferV6() {
  return (
    <section id="uslugi" className="v6-offer v6-section" aria-labelledby="v6-offer-title">
      <div className="v6-wrap v6-section-rail">
        <p className="v6-section-index" aria-hidden>{sections.services.num}</p>
        <div className="v6-section-body">
          <div className="v6-section-head">
            <p className="v6-eyebrow">Oferta</p>
            <h2 id="v6-offer-title" data-v6-split>{sections.services.title}</h2>
            <p className="v6-section-lead">{sections.services.lead}</p>
          </div>

          <div className="v6-offer-table-wrap">
            <table className="v6-offer-table">
              <thead>
                <tr>
                  <th scope="col">Usługa</th>
                  <th scope="col">Efekt</th>
                  <th scope="col">Czas</th>
                  <th scope="col">Widełki</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.num}>
                    <td>
                      <span className="v6-offer-num">{service.num}</span>
                      <strong>{service.title}</strong>
                      <p className="v6-offer-desc">{service.description}</p>
                    </td>
                    <td data-label="Efekt">{service.outcome}</td>
                    <td data-label="Czas">{service.timeline}</td>
                    <td data-label="Widełki" className="v6-offer-price">{service.from}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="v6-rule v6-rule-reveal" aria-hidden />
        </div>
      </div>
    </section>
  )
}
