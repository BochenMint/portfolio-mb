import { useState } from 'react'
import { pricingPackages, sections, site } from '../../i18n/live'
import { ctaHref, isExternalCta } from '../utils'

const featuredIndex = pricingPackages.findIndex((p) => p.featured)

export function PackagesV6() {
  const [active, setActive] = useState(featuredIndex >= 0 ? featuredIndex : 0)
  const pkg = pricingPackages[active]!
  const href = ctaHref(site.calendly)
  const external = isExternalCta(site.calendly)

  return (
    <section id="pakiety" className="v6-packages v6-section" aria-labelledby="v6-packages-title">
      <div className="v6-wrap v6-section-rail">
        <p className="v6-section-index" aria-hidden>{sections.pricing.num}</p>
        <div className="v6-section-body">
          <div className="v6-section-head">
            <p className="v6-eyebrow">Pakiety</p>
            <h2 id="v6-packages-title" data-v6-split>{sections.pricing.title}</h2>
            <p className="v6-section-lead">{sections.pricing.lead}</p>
          </div>

          <div className="v6-packages-layout">
            <div className="v6-packages-rail" role="tablist" aria-label="Pakiety cenowe">
              {pricingPackages.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  role="tab"
                  aria-selected={active === index}
                  className="v6-packages-tab"
                  data-active={active === index}
                  data-featured={item.featured ?? false}
                  onClick={() => setActive(index)}
                >
                  <span className="v6-packages-tab-num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="v6-packages-tab-name">{item.name}</span>
                  <span className="v6-packages-tab-range">{item.range}</span>
                </button>
              ))}
            </div>

            <div
              className="v6-package-detail"
              role="tabpanel"
              aria-live="polite"
              data-featured={pkg.featured ?? false}
            >
              <p className="v6-package-range">{pkg.range}</p>
              <h3 className="v6-package-name">{pkg.name}</h3>
              <p className="v6-package-qualifier">{pkg.qualifier}</p>
              <p className="v6-package-best">{pkg.bestFor}</p>

              <ul className="v6-package-list">
                {pkg.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className="v6-package-proof">{pkg.proof}</p>

              <a
                href={href}
                className="v6-cta-primary"
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {site.ctaPrimary}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
