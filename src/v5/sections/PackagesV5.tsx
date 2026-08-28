import { useState } from 'react'
import { pricingPackages, sections, site } from '../../i18n/live'
import { ctaHref, isExternalCta } from '../utils'

const featuredIndex = pricingPackages.findIndex((p) => p.featured)

export function PackagesV5() {
  const [active, setActive] = useState(featuredIndex >= 0 ? featuredIndex : 0)
  const pkg = pricingPackages[active]!
  const href = ctaHref(site.calendly)
  const external = isExternalCta(site.calendly)

  return (
    <section id="volt-packages" className="volt-packages volt-wrap" aria-labelledby="volt-packages-title">
      <p className="volt-mono">{sections.pricing.num} · pakiety</p>
      <h2 id="volt-packages-title" data-volt-split>
        {sections.pricing.title}
      </h2>
      <p className="volt-packages-lead">{sections.pricing.lead}</p>

      <div className="volt-packages-layout">
        <div className="volt-packages-tabs" role="tablist" aria-label="Pakiety">
          {pricingPackages.map((item, index) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={active === index}
              data-active={active === index}
              data-featured={item.featured ?? false}
              className="volt-packages-tab"
              onClick={() => setActive(index)}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div
          className="volt-package-panel"
          role="tabpanel"
          data-featured={pkg.featured ?? false}
          aria-live="polite"
        >
          <p className="volt-package-range">{pkg.range}</p>
          <h3 className="volt-package-name">{pkg.name}</h3>
          <p className="volt-package-qualifier">{pkg.qualifier}</p>
          <p className="volt-package-best">{pkg.bestFor}</p>
          <ul className="volt-package-list">
            {pkg.deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className="volt-package-proof">{pkg.proof}</p>
          <a
            href={href}
            className="volt-btn-primary volt-package-cta"
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {site.ctaPrimary}
            <span className="volt-btn-arrow" aria-hidden>
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
