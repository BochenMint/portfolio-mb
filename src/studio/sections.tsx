import { useState, type FormEvent, type ReactNode } from 'react'
import { LanguageSwitcher, articleIndexPath, useContent, useLocale, useStudioUi } from '../i18n'
import type { ContactField, PricingPackage } from '../data/content'
import { StyleSelector } from './StyleSelector'
import { useTheme } from './ThemeContext'
import { HangarPortal } from './HangarPortal'
import { themeKicker } from './ThemeChrome'
import {
  hasArchiveRhythm,
  layoutFamily,
  sectionRhythmClass,
  type LayoutFamily,
} from './layoutFamily'
import { ctaHref, formAccessKey, formEndpoint, isExternalCta, projectImage, projectLiveUrl } from './utils'

function useOrderedProjects() {
  const { projects } = useContent()
  return [...projects].sort((a, b) => Number(b.flagship) - Number(a.flagship))
}

function useFeaturedIndex() {
  const { pricingPackages } = useContent()
  return Math.max(0, pricingPackages.findIndex((p) => p.featured))
}

function CtaLink({ className = 'studio-cta', large = false }: { className?: string; large?: boolean }) {
  const { site } = useContent()
  return (
    <a
      href={ctaHref}
      className={`${className}${large ? ' studio-cta-lg' : ''}`}
      {...(isExternalCta ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {site.ctaPrimary}
    </a>
  )
}

export function NavStudio() {
  const { locale, ui } = useLocale()
  return (
    <header className="studio-nav">
      <a href="#top" className="studio-mark">
        <span>MB</span>
        <span className="studio-mark-label">Marcin Bochenek</span>
      </a>
      <StyleSelector />
      <nav className="studio-nav-links" aria-label={ui.navAria}>
        <a href="#realizacje">{ui.navWork}</a>
        <a href="#oferta">{ui.navOffer}</a>
        <a href="#cennik">{ui.navPackages}</a>
        <a href="#kontakt">{ui.navContact}</a>
      </nav>
      <LanguageSwitcher locale={locale} ariaLabel={ui.langAria} />
      <CtaLink />
    </header>
  )
}

function HeroEditorial({ kicker, children }: { kicker: string; children: ReactNode }) {
  return (
    <section className="studio-hero studio-hero-editorial" id="top" aria-labelledby="studio-hero-title">
      <p className="studio-kicker">{kicker}</p>
      {children}
    </section>
  )
}

function HeroOptical({ kicker, children }: { kicker: string; children: ReactNode }) {
  return (
    <section className="studio-hero studio-hero-optical" id="top" aria-labelledby="studio-hero-title">
      <div className="studio-hero-optical-inner">
        <p className="studio-kicker">{kicker}</p>
        {children}
      </div>
    </section>
  )
}

function HeroDashboard({ kicker }: { kicker: string }) {
  const { results, site } = useContent()
  const ui = useStudioUi()
  return (
    <section className="studio-hero studio-hero-dashboard" id="top" aria-labelledby="studio-hero-title">
      <div className="studio-hero-dashboard-main">
        <p className="studio-kicker">{kicker}</p>
        <HeroGlassHead />
      </div>
      <aside className="studio-hero-dashboard-aside" aria-label={ui.metricsAria}>
        {results.slice(0, 3).map((row) => (
          <div key={row.label} className="studio-hero-metric">
            <p className="studio-hero-metric-value">{row.value}</p>
            <p className="studio-hero-metric-label">{row.label}</p>
          </div>
        ))}
        <div className="studio-hero-dashboard-cta">
          <p className="studio-hero-band-copy">{site.icpBadge}</p>
          <CtaLink large />
        </div>
      </aside>
    </section>
  )
}

function HeroWorkstation({ kicker, children }: { kicker: string; children: ReactNode }) {
  return (
    <section className="studio-hero studio-hero-workstation" id="top" aria-labelledby="studio-hero-title">
      <p className="studio-kicker studio-workstation-prompt">{kicker}</p>
      {children}
    </section>
  )
}

function HeroCockpit({ kicker }: { kicker: string }) {
  const { site } = useContent()
  const ui = useStudioUi()
  return (
    <section className="studio-hero studio-hero-cockpit" id="top" aria-labelledby="studio-hero-title">
      <div className="studio-hero-cockpit-stage">
        <p className="studio-kicker studio-hero-cockpit-kicker">{kicker}</p>
        <HangarPortal variant="hero" />
      </div>
      <div className="studio-hero-cockpit-hud">
        <h1 id="studio-hero-title" className="studio-hero-name studio-hero-name-hud">
          <span>{site.headline[0]}</span>
          <span>{site.headline[1]}</span>
        </h1>
        <p className="studio-hero-lead studio-hero-lead-hud">{ui.heroLead}</p>
      </div>
    </section>
  )
}

function HeroAtmospheric({ kicker, children }: { kicker: string; children: ReactNode }) {
  return (
    <section className="studio-hero studio-hero-atmospheric" id="top" aria-labelledby="studio-hero-title">
      <p className="studio-kicker">{kicker}</p>
      {children}
    </section>
  )
}

function HeroCampaign({ kicker, children }: { kicker: string; children: ReactNode }) {
  return (
    <section className="studio-hero studio-hero-campaign" id="top" aria-labelledby="studio-hero-title">
      <div className="studio-hero-campaign-inner">
        <p className="studio-kicker">{kicker}</p>
        {children}
      </div>
    </section>
  )
}

function HeroGlassHead() {
  const { site } = useContent()
  const ui = useStudioUi()
  return (
    <>
      <h1 id="studio-hero-title" className="studio-hero-name">
        <span>{site.headline[0]}</span>
        <span>{site.headline[1]}</span>
      </h1>
      <p className="studio-hero-lead">{ui.heroLead}</p>
    </>
  )
}

function HeroLiquidBody() {
  const { site } = useContent()
  const ui = useStudioUi()
  return (
    <>
      <div className="studio-hero-editorial-row">
        <h1 id="studio-hero-title" className="studio-hero-name">
          <span>{site.headline[0]}</span>
          <span>{site.headline[1]}</span>
        </h1>
        <p className="studio-hero-lead studio-hero-lead-row">{ui.heroLead}</p>
      </div>
      <div className="studio-hero-band">
        <p className="studio-hero-band-copy">{site.icpBadge}</p>
        <CtaLink large />
      </div>
    </>
  )
}

function HeroCore() {
  const { site } = useContent()
  return (
    <>
      <HeroGlassHead />
      <div className="studio-hero-band">
        <p className="studio-hero-band-copy">{site.icpBadge}</p>
        <CtaLink large />
      </div>
    </>
  )
}

export function HeroStudio() {
  const { theme } = useTheme()
  const ui = useStudioUi()
  const kicker = themeKicker(theme, ui.kicker)
  const family = layoutFamily(theme)

  if (family === 'cockpit') return <HeroCockpit kicker={kicker} />
  if (family === 'optical') return <HeroOptical kicker={kicker}><HeroLiquidBody /></HeroOptical>
  if (family === 'dashboard') return <HeroDashboard kicker={kicker} />

  const core = <HeroCore />

  switch (family) {
    case 'workstation':
      return <HeroWorkstation kicker={kicker}>{core}</HeroWorkstation>
    case 'atmospheric':
      return <HeroAtmospheric kicker={kicker}>{core}</HeroAtmospheric>
    case 'campaign':
      return <HeroCampaign kicker={kicker}>{core}</HeroCampaign>
    default:
      return <HeroEditorial kicker={kicker}>{core}</HeroEditorial>
  }
}

export function ProofStudio() {
  const { theme } = useTheme()
  const { results, resultsDisclaimer } = useContent()
  const ui = useStudioUi()
  const rhythm = sectionRhythmClass(theme)

  return (
    <section className={`studio-section studio-section-proof ${rhythm}`} id="metryki" aria-labelledby="studio-proof-title">
      <p className="studio-kicker">{ui.proofKicker}</p>
      <h2 id="studio-proof-title">{ui.proofTitle}</h2>
      <p className="studio-lead">{ui.proofLead}</p>
      <div className="studio-proof-grid">
        {results.map((row) => (
          <article key={row.label} className="studio-proof-cell">
            <p className="studio-proof-value">{row.value}</p>
            <p className="studio-proof-label">{row.label}</p>
            {row.hint ? <p className="studio-proof-hint">{row.hint}</p> : null}
          </article>
        ))}
      </div>
      <p className="studio-disclaimer">{resultsDisclaimer}</p>
    </section>
  )
}

function WorkEditorial() {
  const orderedProjects = useOrderedProjects()
  const ui = useStudioUi()
  return (
    <div className="studio-work-list studio-work-editorial">
      {orderedProjects.map((project, index) => {
        const live = projectLiveUrl(project.id)
        return (
          <article
            key={project.id}
            className="studio-work-item"
            data-flagship={Boolean(project.flagship)}
            style={{ ['--work-i' as string]: String(index) }}
          >
            <p className="studio-work-hang" aria-hidden>
              {String(index + 1).padStart(2, '0')}
            </p>
            <div className="studio-work-media">
              <img src={projectImage(project.id)} alt={`${project.title} — ${project.tagline}`} width={1600} height={900} />
            </div>
            <div className="studio-work-copy">
              <p className="studio-work-meta">
                {project.domain}
                {project.flagship ? ui.flagshipSuffix : ''}
              </p>
              <h3>{project.title}</h3>
              <p className="studio-work-tag">{project.tagline}</p>
              <p className="studio-work-pain">{project.pain}</p>
              <p className="studio-work-out">{project.outcome}</p>
              {live.live && live.url ? (
                <a className="studio-text-link" href={live.url} target="_blank" rel="noopener noreferrer">
                  {ui.publicSite}
                </a>
              ) : (
                <p className="studio-work-status">{ui.noPublicUrl}</p>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}

function WorkOptical() {
  const orderedProjects = useOrderedProjects()
  const ui = useStudioUi()
  return (
    <div className="studio-work-lenses">
      {orderedProjects.map((project, index) => {
        const live = projectLiveUrl(project.id)
        return (
          <article
            key={project.id}
            className="studio-work-lens"
            data-flagship={Boolean(project.flagship)}
            style={{ ['--lens-i' as string]: String(index) }}
          >
            <div className="studio-work-lens-frame">
              <div className="studio-work-media">
                <img src={projectImage(project.id)} alt={`${project.title} — ${project.tagline}`} width={1600} height={900} />
              </div>
            </div>
            <div className="studio-work-copy">
              <p className="studio-work-meta">{project.domain}</p>
              <h3>{project.title}</h3>
              <p className="studio-work-tag">{project.tagline}</p>
              <p className="studio-work-out">{project.outcome}</p>
              {live.live && live.url ? (
                <a className="studio-text-link" href={live.url} target="_blank" rel="noopener noreferrer">
                  {ui.publicSite}
                </a>
              ) : (
                <p className="studio-work-status">{ui.noPublicUrl}</p>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}

function WorkDashboard() {
  const orderedProjects = useOrderedProjects()
  const ui = useStudioUi()
  return (
    <div className="studio-work-modules">
      {orderedProjects.map((project) => {
        const live = projectLiveUrl(project.id)
        return (
          <article key={project.id} className="studio-work-module" data-flagship={Boolean(project.flagship)}>
            <div className="studio-work-module-head">
              <h3>{project.title}</h3>
              <span className="studio-work-module-status">{live.live ? ui.statusLive : ui.statusInternal}</span>
            </div>
            <div className="studio-work-media">
              <img src={projectImage(project.id)} alt={`${project.title} — ${project.tagline}`} width={1600} height={900} />
            </div>
            <div className="studio-work-module-body">
              <p className="studio-work-meta">{project.domain}</p>
              <p>{project.outcome}</p>
              {live.live && live.url ? (
                <a className="studio-text-link" href={live.url} target="_blank" rel="noopener noreferrer">
                  {ui.publicSite}
                </a>
              ) : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}

function WorkWorkstation() {
  const orderedProjects = useOrderedProjects()
  const ui = useStudioUi()
  return (
    <div className="studio-work-slots">
      {orderedProjects.map((project, index) => {
        const live = projectLiveUrl(project.id)
        return (
          <article key={project.id} className="studio-work-slot" data-flagship={Boolean(project.flagship)}>
            <p className="studio-work-slot-label">
              {ui.workSlot} {String(index + 1).padStart(2, '0')}
            </p>
            <div className="studio-work-slot-media">
              <img src={projectImage(project.id)} alt={`${project.title} — ${project.tagline}`} width={1600} height={900} />
            </div>
            <div className="studio-work-slot-copy">
              <h3>{project.title}</h3>
              <p className="studio-work-meta">{project.domain}</p>
              <p className="studio-work-out">{project.outcome}</p>
              {live.live && live.url ? (
                <a className="studio-text-link" href={live.url} target="_blank" rel="noopener noreferrer">
                  →
                </a>
              ) : (
                <p className="studio-work-status">{ui.statusOffline}</p>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}

function WorkCockpit() {
  const orderedProjects = useOrderedProjects()
  const ui = useStudioUi()
  return (
    <div className="studio-work-briefs">
      {orderedProjects.map((project, index) => {
        const live = projectLiveUrl(project.id)
        return (
          <article key={project.id} className="studio-work-brief" data-flagship={Boolean(project.flagship)}>
            <header className="studio-work-brief-head">
              <p className="studio-work-brief-id">BRIEF-{String(index + 1).padStart(2, '0')}</p>
              <p className="studio-work-brief-domain">{project.domain}</p>
            </header>
            <div className="studio-work-brief-grid">
              <div className="studio-work-media">
                <img src={projectImage(project.id)} alt={`${project.title} — ${project.tagline}`} width={1600} height={900} />
              </div>
              <div className="studio-work-copy">
                <h3>{project.title}</h3>
                <dl className="studio-work-brief-spec">
                  <div>
                    <dt>{ui.briefGoal}</dt>
                    <dd>{project.tagline}</dd>
                  </div>
                  <div>
                    <dt>{ui.briefResult}</dt>
                    <dd>{project.outcome}</dd>
                  </div>
                  <div>
                    <dt>{ui.briefStatus}</dt>
                    <dd>{live.live ? ui.statusProduction : ui.statusNoPublicUrl}</dd>
                  </div>
                </dl>
                {live.live && live.url ? (
                  <a className="studio-text-link" href={live.url} target="_blank" rel="noopener noreferrer">
                    {ui.openSite}
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function WorkAtmospheric() {
  const orderedProjects = useOrderedProjects()
  const ui = useStudioUi()
  return (
    <div className="studio-work-transmission">
      {orderedProjects.map((project, index) => {
        const live = projectLiveUrl(project.id)
        const flip = index % 2 === 1
        return (
          <article
            key={project.id}
            className="studio-work-signal"
            data-flip={flip}
            data-flagship={Boolean(project.flagship)}
          >
            <div className="studio-work-signal-frame">
              <div className="studio-work-media">
                <img src={projectImage(project.id)} alt={`${project.title} — ${project.tagline}`} width={1600} height={900} />
              </div>
            </div>
            <div className="studio-work-copy">
              <p className="studio-work-meta">{project.domain}</p>
              <h3>{project.title}</h3>
              <p className="studio-work-tag">{project.tagline}</p>
              <p className="studio-work-out">{project.outcome}</p>
              {live.live && live.url ? (
                <a className="studio-text-link" href={live.url} target="_blank" rel="noopener noreferrer">
                  {ui.publicSite}
                </a>
              ) : (
                <p className="studio-work-status">{ui.noPublicUrl}</p>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}

function WorkByFamily({ family }: { family: LayoutFamily }) {
  switch (family) {
    case 'optical':
      return <WorkOptical />
    case 'dashboard':
      return <WorkDashboard />
    case 'workstation':
      return <WorkWorkstation />
    case 'cockpit':
      return <WorkCockpit />
    case 'atmospheric':
      return <WorkAtmospheric />
    default:
      return <WorkEditorial />
  }
}

function WorkV1() {
  const orderedProjects = useOrderedProjects()
  const ui = useStudioUi()
  return (
    <div className="studio-work-reel">
      {orderedProjects.map((project, index) => {
        const live = projectLiveUrl(project.id)
        return (
          <article key={project.id} className="studio-work-reel-item" data-flagship={Boolean(project.flagship)}>
            <div className="studio-work-media">
              <img src={projectImage(project.id)} alt={`${project.title} — ${project.tagline}`} width={1600} height={900} />
            </div>
            <div className="studio-work-copy">
              <p className="studio-work-meta">{ui.chapter} {String(index + 1).padStart(2, '0')}</p>
              <h3>{project.title}</h3>
              <p className="studio-work-tag">{project.tagline}</p>
              <p>{project.outcome}</p>
              {live.live && live.url ? (
                <a className="studio-text-link" href={live.url} target="_blank" rel="noopener noreferrer">
                  {ui.publicSite}
                </a>
              ) : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}

function WorkV2() {
  const orderedProjects = useOrderedProjects()
  const ui = useStudioUi()
  return (
    <div className="studio-work-dense">
      <div className="studio-work-dense-head" aria-hidden>
        <span>{ui.colProject}</span>
        <span>{ui.colDomain}</span>
        <span>{ui.colResult}</span>
        <span>{ui.colStatus}</span>
      </div>
      {orderedProjects.map((project) => {
        const live = projectLiveUrl(project.id)
        return (
          <article key={project.id} className="studio-work-dense-row" data-flagship={Boolean(project.flagship)}>
            <h3>{project.title}</h3>
            <p>{project.domain}</p>
            <p>{project.outcome}</p>
            <p>{live.live ? ui.statusLive : ui.statusInternal}</p>
          </article>
        )
      })}
    </div>
  )
}

function WorkV3() {
  const orderedProjects = useOrderedProjects()
  const ui = useStudioUi()
  return (
    <div className="studio-work-pleats">
      {orderedProjects.map((project, index) => {
        const live = projectLiveUrl(project.id)
        const flip = index % 2 === 1
        return (
          <article
            key={project.id}
            className="studio-work-pleat"
            data-flip={flip}
            data-flagship={Boolean(project.flagship)}
          >
            <div className="studio-work-media">
              <img src={projectImage(project.id)} alt={`${project.title} — ${project.tagline}`} width={1600} height={900} />
            </div>
            <div className="studio-work-copy">
              <h3>{project.title}</h3>
              <p className="studio-work-tag">{project.tagline}</p>
              <p>{project.pain}</p>
              <p className="studio-work-out">{project.outcome}</p>
              {live.live && live.url ? (
                <a className="studio-text-link" href={live.url} target="_blank" rel="noopener noreferrer">
                  {ui.publicSite}
                </a>
              ) : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}

function WorkV5() {
  const orderedProjects = useOrderedProjects()
  const ui = useStudioUi()
  return (
    <div className="studio-work-slabs">
      {orderedProjects.map((project, index) => {
        const live = projectLiveUrl(project.id)
        return (
          <article key={project.id} className="studio-work-slab" data-index={index}>
            <p className="studio-work-slab-num">{String(index + 1).padStart(2, '0')}</p>
            <div className="studio-work-media">
              <img src={projectImage(project.id)} alt={`${project.title} — ${project.tagline}`} width={1600} height={900} />
            </div>
            <div className="studio-work-copy">
              <h3>{project.title}</h3>
              <p>{project.tagline}</p>
              <p className="studio-work-out">{project.outcome}</p>
              {live.live && live.url ? (
                <a className="studio-text-link" href={live.url} target="_blank" rel="noopener noreferrer">
                  {ui.see}
                </a>
              ) : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}

export function WorkStudio() {
  const { theme } = useTheme()
  const ui = useStudioUi()
  const family = layoutFamily(theme)

  return (
    <section
      className={`studio-section studio-section-work studio-family-${family}`}
      id="realizacje"
      aria-labelledby="studio-work-title"
    >
      <p className="studio-kicker">{ui.workKicker}</p>
      <h2 id="studio-work-title">{ui.workTitle}</h2>
      <p className="studio-lead">{ui.workLead}</p>
      {theme === 'v1' ? <WorkV1 /> : null}
      {theme === 'v2' ? <WorkV2 /> : null}
      {theme === 'v3' ? <WorkV3 /> : null}
      {theme === 'v5' ? <WorkV5 /> : null}
      {!hasArchiveRhythm(theme) ? <WorkByFamily family={family} /> : null}
    </section>
  )
}

function OfferEditorial() {
  const { services } = useContent()
  return (
    <div className="studio-offer-table studio-offer-editorial">
      {services.map((service) => (
        <article key={service.num} className="studio-offer-row">
          <p className="studio-offer-num">{service.num}</p>
          <div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
          <p className="studio-offer-meta">
            <strong>{service.from}</strong>
            <span>{service.timeline}</span>
          </p>
        </article>
      ))}
    </div>
  )
}

function OfferOptical() {
  const { services } = useContent()
  return (
    <ul className="studio-offer-quiet">
      {services.map((service) => (
        <li key={service.num} className="studio-offer-quiet-item">
          <div className="studio-offer-quiet-head">
            <h3>{service.title}</h3>
            <p className="studio-offer-quiet-meta">
              {service.from} · {service.timeline}
            </p>
          </div>
          <p>{service.description}</p>
        </li>
      ))}
    </ul>
  )
}

function OfferDashboard() {
  const { services } = useContent()
  return (
    <div className="studio-offer-modules">
      {services.map((service) => (
        <article key={service.num} className="studio-offer-module">
          <p className="studio-offer-module-id">{service.num}</p>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          <footer className="studio-offer-module-foot">
            <span>{service.from}</span>
            <span>{service.timeline}</span>
          </footer>
        </article>
      ))}
    </div>
  )
}

function OfferWorkstation() {
  const { services } = useContent()
  return (
    <div className="studio-offer-sysrows">
      {services.map((service) => (
        <article key={service.num} className="studio-offer-sysrow">
          <p className="studio-offer-sysrow-num">{service.num}</p>
          <div className="studio-offer-sysrow-main">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
          <p className="studio-offer-sysrow-meta">
            {service.from}
            <span>{service.timeline}</span>
          </p>
        </article>
      ))}
    </div>
  )
}

function OfferCockpit() {
  const { services } = useContent()
  const ui = useStudioUi()
  return (
    <div className="studio-offer-specs">
      {services.map((service) => (
        <article key={service.num} className="studio-offer-spec">
          <p className="studio-offer-spec-line">
            <span className="studio-offer-spec-key">{ui.moduleLabel} {service.num}</span>
            <span className="studio-offer-spec-val">{service.timeline}</span>
          </p>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          <p className="studio-offer-spec-budget">{service.from}</p>
        </article>
      ))}
    </div>
  )
}

function OfferAtmospheric() {
  const { services } = useContent()
  return (
    <div className="studio-offer-signals">
      {services.map((service) => (
        <article key={service.num} className="studio-offer-signal">
          <p className="studio-offer-num">{service.num}</p>
          <div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
          <p className="studio-offer-meta">
            <strong>{service.from}</strong>
            <span>{service.timeline}</span>
          </p>
        </article>
      ))}
    </div>
  )
}

function OfferByFamily({ family }: { family: LayoutFamily }) {
  switch (family) {
    case 'optical':
      return <OfferOptical />
    case 'dashboard':
      return <OfferDashboard />
    case 'workstation':
      return <OfferWorkstation />
    case 'cockpit':
      return <OfferCockpit />
    case 'atmospheric':
      return <OfferAtmospheric />
    default:
      return <OfferEditorial />
  }
}

function OfferV1() {
  const { services } = useContent()
  return (
    <div className="studio-offer-prose">
      {services.map((service) => (
        <article key={service.num} className="studio-offer-prose-item">
          <h3>
            {service.num}. {service.title}
          </h3>
          <p>{service.description}</p>
          <p className="studio-offer-meta">
            <strong>{service.from}</strong> · {service.timeline}
          </p>
        </article>
      ))}
    </div>
  )
}

function OfferV2() {
  const { services } = useContent()
  return (
    <div className="studio-offer-grid">
      {services.map((service) => (
        <article key={service.num} className="studio-offer-grid-cell">
          <p className="studio-offer-num">{service.num}</p>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          <p className="studio-offer-meta">
            {service.from} · {service.timeline}
          </p>
        </article>
      ))}
    </div>
  )
}

function OfferV3() {
  const { services } = useContent()
  return (
    <div className="studio-offer-pleats">
      {services.map((service) => (
        <article key={service.num} className="studio-offer-pleat">
          <p className="studio-offer-num">{service.num}</p>
          <div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
          <p className="studio-offer-meta">
            <strong>{service.from}</strong>
            <span>{service.timeline}</span>
          </p>
        </article>
      ))}
    </div>
  )
}

function OfferV5() {
  const { services } = useContent()
  return (
    <div className="studio-offer-campaign">
      {services.map((service) => (
        <article key={service.num} className="studio-offer-campaign-block">
          <p className="studio-offer-num">{service.num}</p>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          <p className="studio-offer-meta">
            {service.from} · {service.timeline}
          </p>
        </article>
      ))}
    </div>
  )
}

export function OfferStudio() {
  const { theme } = useTheme()
  const ui = useStudioUi()
  const family = layoutFamily(theme)

  return (
    <section
      className={`studio-section studio-section-offer studio-family-${family}`}
      id="oferta"
      aria-labelledby="studio-offer-title"
    >
      <p className="studio-kicker">{ui.offerKicker}</p>
      <h2 id="studio-offer-title">{ui.offerTitle}</h2>
      {theme === 'v1' ? <OfferV1 /> : null}
      {theme === 'v2' ? <OfferV2 /> : null}
      {theme === 'v3' ? <OfferV3 /> : null}
      {theme === 'v5' ? <OfferV5 /> : null}
      {!hasArchiveRhythm(theme) ? <OfferByFamily family={family} /> : null}
    </section>
  )
}

function PackagePanel({ pkg }: { pkg: PricingPackage }) {
  return (
      <div className="studio-pkg-panel" role="tabpanel" data-featured={Boolean(pkg.featured)}>
        <p className="studio-pkg-range">{pkg.range}</p>
        <h3>{pkg.name}</h3>
        <p className="studio-pkg-q">{pkg.qualifier}</p>
        <p>{pkg.bestFor}</p>
        <ul>
          {pkg.deliverables.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <p className="studio-pkg-proof">{pkg.proof}</p>
        <CtaLink />
      </div>
  )
}

function PackagesEditorial() {
  const { pricingPackages } = useContent()
  const ui = useStudioUi()
  const featuredIndex = useFeaturedIndex()
  const [active, setActive] = useState(featuredIndex)
  const pkg = pricingPackages[active]!

  return (
    <div className="studio-pkg studio-pkg-editorial">
      <div className="studio-pkg-tabs" role="tablist" aria-label={ui.packagesAria}>
        {pricingPackages.map((item, index) => (
          <button
            key={item.name}
            type="button"
            role="tab"
            aria-selected={active === index}
            data-active={active === index}
            className="studio-pkg-tab"
            onClick={() => setActive(index)}
          >
            <span>{item.name}</span>
            <em>{item.range}</em>
          </button>
        ))}
      </div>
      <PackagePanel pkg={pkg} />
    </div>
  )
}

function PackagesOptical() {
  const { pricingPackages } = useContent()
  const featuredIndex = useFeaturedIndex()
  const [active, setActive] = useState(featuredIndex)

  return (
    <div className="studio-pkg-lenses">
      {pricingPackages.map((pkg, index) => (
        <article
          key={pkg.name}
          className="studio-pkg-lens"
          data-active={active === index}
          data-featured={Boolean(pkg.featured)}
        >
          <button type="button" className="studio-pkg-lens-trigger" onClick={() => setActive(index)}>
            <span className="studio-pkg-range">{pkg.range}</span>
            <h3>{pkg.name}</h3>
            <p className="studio-pkg-q">{pkg.qualifier}</p>
          </button>
          {active === index ? (
            <div className="studio-pkg-lens-body">
              <p>{pkg.bestFor}</p>
              <ul>
                {pkg.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <p className="studio-pkg-proof">{pkg.proof}</p>
              <CtaLink />
            </div>
          ) : null}
        </article>
      ))}
    </div>
  )
}

function PackagesDashboard() {
  const { pricingPackages } = useContent()
  return (
    <div className="studio-pkg-modules">
      {pricingPackages.map((pkg) => (
        <article key={pkg.name} className="studio-pkg-module" data-featured={Boolean(pkg.featured)}>
          <header>
            <p className="studio-pkg-range">{pkg.range}</p>
            <h3>{pkg.name}</h3>
            <p className="studio-pkg-q">{pkg.qualifier}</p>
          </header>
          <p>{pkg.bestFor}</p>
          <ul>
            {pkg.deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className="studio-pkg-proof">{pkg.proof}</p>
          <CtaLink className="studio-cta studio-cta-inline" />
        </article>
      ))}
    </div>
  )
}

function PackagesWorkstation() {
  const { pricingPackages } = useContent()
  return (
    <div className="studio-pkg-sysrows">
      {pricingPackages.map((pkg, index) => (
        <article key={pkg.name} className="studio-pkg-sysrow" data-featured={Boolean(pkg.featured)}>
          <p className="studio-pkg-sysrow-id">PKG-{String(index + 1).padStart(2, '0')}</p>
          <div className="studio-pkg-sysrow-main">
            <h3>{pkg.name}</h3>
            <p className="studio-pkg-q">{pkg.qualifier}</p>
            <p>{pkg.bestFor}</p>
          </div>
          <div className="studio-pkg-sysrow-side">
            <p className="studio-pkg-range">{pkg.range}</p>
            <ul>
              {pkg.deliverables.slice(0, 4).map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  )
}

function PackagesCockpit() {
  const { pricingPackages } = useContent()
  const featuredIndex = useFeaturedIndex()
  const [active, setActive] = useState(featuredIndex)
  const pkg = pricingPackages[active]!

  return (
    <div className="studio-pkg-loadout">
      <div className="studio-pkg-loadout-bar" role="tablist" aria-label="Loadout">
        {pricingPackages.map((item, index) => (
          <button
            key={item.name}
            type="button"
            role="tab"
            aria-selected={active === index}
            data-active={active === index}
            className="studio-pkg-loadout-slot"
            onClick={() => setActive(index)}
          >
            <span className="studio-pkg-loadout-id">L{index + 1}</span>
            <span>{item.name}</span>
            <em>{item.range}</em>
          </button>
        ))}
      </div>
      <div className="studio-pkg-loadout-panel">
        <PackagePanel pkg={pkg} />
      </div>
    </div>
  )
}

function PackagesAtmospheric() {
  const { pricingPackages } = useContent()
  const featured = pricingPackages.find((p) => p.featured) ?? pricingPackages[0]!
  const rest = pricingPackages.filter((p) => p !== featured)

  return (
    <div className="studio-pkg-signal">
      <PackagePanel pkg={featured} />
      <div className="studio-pkg-signal-rest">
        {rest.map((pkg) => (
          <article key={pkg.name} className="studio-pkg-signal-mini">
            <h3>{pkg.name}</h3>
            <p className="studio-pkg-range">{pkg.range}</p>
            <p>{pkg.qualifier}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

function PackagesByFamily({ family }: { family: LayoutFamily }) {
  switch (family) {
    case 'optical':
      return <PackagesOptical />
    case 'dashboard':
      return <PackagesDashboard />
    case 'workstation':
      return <PackagesWorkstation />
    case 'cockpit':
      return <PackagesCockpit />
    case 'atmospheric':
      return <PackagesAtmospheric />
    default:
      return <PackagesEditorial />
  }
}

function PackagesV1() {
  const { pricingPackages } = useContent()
  return (
    <div className="studio-pkg-stack">
      {pricingPackages.map((pkg) => (
        <article key={pkg.name} className="studio-pkg-stack-item" data-featured={Boolean(pkg.featured)}>
          <header>
            <p className="studio-pkg-range">{pkg.range}</p>
            <h3>{pkg.name}</h3>
            <p className="studio-pkg-q">{pkg.qualifier}</p>
          </header>
          <p>{pkg.bestFor}</p>
          <ul>
            {pkg.deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className="studio-pkg-proof">{pkg.proof}</p>
        </article>
      ))}
    </div>
  )
}

function PackagesV2() {
  const { pricingPackages } = useContent()
  const ui = useStudioUi()
  return (
    <div className="studio-pkg-matrix">
      <div className="studio-pkg-matrix-head" aria-hidden>
        <span>{ui.colPackage}</span>
        <span>{ui.colScope}</span>
        <span>{ui.colFor}</span>
      </div>
      {pricingPackages.map((pkg) => (
        <article key={pkg.name} className="studio-pkg-matrix-row" data-featured={Boolean(pkg.featured)}>
          <h3>{pkg.name}</h3>
          <p className="studio-pkg-range">{pkg.range}</p>
          <p>{pkg.bestFor}</p>
        </article>
      ))}
    </div>
  )
}

function PackagesV3() {
  const { pricingPackages } = useContent()
  const featured = pricingPackages.find((p) => p.featured) ?? pricingPackages[0]!
  const rest = pricingPackages.filter((p) => p !== featured)

  return (
    <div className="studio-pkg-featured">
      <PackagePanel pkg={featured} />
      <div className="studio-pkg-featured-rest">
        {rest.map((pkg) => (
          <article key={pkg.name} className="studio-pkg-mini">
            <h3>{pkg.name}</h3>
            <p className="studio-pkg-range">{pkg.range}</p>
            <p>{pkg.qualifier}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

function PackagesV5() {
  const { pricingPackages } = useContent()
  return (
    <div className="studio-pkg-slabs">
      {pricingPackages.map((pkg, index) => (
        <article key={pkg.name} className="studio-pkg-slab" data-featured={Boolean(pkg.featured)} data-index={index}>
          <p className="studio-pkg-range">{pkg.range}</p>
          <h3>{pkg.name}</h3>
          <p className="studio-pkg-q">{pkg.qualifier}</p>
          <p>{pkg.bestFor}</p>
          <ul>
            {pkg.deliverables.slice(0, 3).map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <CtaLink className="studio-cta studio-cta-inline" />
        </article>
      ))}
    </div>
  )
}

export function PackagesStudio() {
  const { theme } = useTheme()
  const ui = useStudioUi()
  const family = layoutFamily(theme)

  return (
    <section
      className={`studio-section studio-section-pkg studio-family-${family}`}
      id="cennik"
      aria-labelledby="studio-pkg-title"
    >
      <p className="studio-kicker">{ui.packagesKicker}</p>
      <h2 id="studio-pkg-title">{ui.packagesTitle}</h2>
      {theme === 'v1' ? <PackagesV1 /> : null}
      {theme === 'v2' ? <PackagesV2 /> : null}
      {theme === 'v3' ? <PackagesV3 /> : null}
      {theme === 'v5' ? <PackagesV5 /> : null}
      {!hasArchiveRhythm(theme) ? <PackagesByFamily family={family} /> : null}
    </section>
  )
}

export function TrustStudio() {
  const { theme } = useTheme()
  const { liveProof, trustPoints } = useContent()
  const ui = useStudioUi()
  const rhythm = sectionRhythmClass(theme)

  return (
    <section className={`studio-section studio-section-trust ${rhythm}`} id="dowod" aria-labelledby="studio-trust-title">
      <p className="studio-kicker">{ui.trustKicker}</p>
      <h2 id="studio-trust-title">{ui.trustTitle}</h2>
      <div className="studio-trust-live">
        {liveProof.map((item) => (
          <a key={item.name} className="studio-trust-card" href={item.url} target="_blank" rel="noopener noreferrer">
            <p>{item.tag}</p>
            <h3>{item.name}</h3>
            <p>{item.result}</p>
          </a>
        ))}
      </div>
      <div className="studio-trust-grid">
        {trustPoints.map((point) => (
          <article key={point.title}>
            <h3>{point.title}</h3>
            <p>{point.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function FaqStudio() {
  const { theme } = useTheme()
  const { faq } = useContent()
  const ui = useStudioUi()
  const rhythm = sectionRhythmClass(theme)

  return (
    <section className={`studio-section studio-section-faq ${rhythm}`} id="faq" aria-labelledby="studio-faq-title">
      <p className="studio-kicker">{ui.faqKicker}</p>
      <h2 id="studio-faq-title">{ui.faqTitle}</h2>
      <div className="studio-faq">
        {faq.map((item) => (
          <details key={item.question} className="studio-faq-item">
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function ContactStudio() {
  const { theme } = useTheme()
  const { site, contactFields, leadForm } = useContent()
  const ui = useStudioUi()
  const { locale } = useLocale()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const autoCompleteFor = (id: string, type: ContactField['type']) => {
    if (id === 'name') return 'name'
    if (id === 'email') return 'email'
    if (id === 'company') return 'organization'
    if (type === 'textarea') return 'off'
    return undefined
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const data = new FormData(e.currentTarget)
    const payload = Object.fromEntries(data.entries()) as Record<string, string>
    const formatted = [`locale: ${locale}`, ...contactFields.map((f) => `${f.label}: ${payload[f.id] || '-'}`)].join('\n')
    const who = payload.company || payload.name || ui.enquiryFallback

    if (formAccessKey) {
      setLoading(true)
      try {
        const res = await fetch(formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: formAccessKey,
            subject: `Brief — ${who}`,
            from_name: payload.name,
            email: payload.email,
            message: formatted,
          }),
        })
        const json = (await res.json()) as { success?: boolean; message?: string }
        if (!res.ok || !json.success) throw new Error(json.message || ui.sendFail)
        setSent(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : ui.sendError)
      } finally {
        setLoading(false)
      }
      return
    }

    const subject = encodeURIComponent(`Brief — ${who}`)
    const text = encodeURIComponent(formatted)
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${text}`
    setSent(true)
  }

  const rhythm = sectionRhythmClass(theme)

  return (
    <section className={`studio-section studio-section-contact ${rhythm}`} id="kontakt" aria-labelledby="studio-contact-title">
      <p className="studio-kicker">{ui.contactKicker}</p>
      <h2 id="studio-contact-title">{ui.contactTitle}</h2>
      <p className="studio-lead">{ui.contactLead}</p>
      <div className="studio-contact">
        <div>
          <p>
            {site.email}
            <br />
            {site.responseTime}
          </p>
          <a href={ctaHref} className="studio-text-link" {...(isExternalCta ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {ui.auditCalendar}
          </a>
        </div>
        {sent ? (
          <div className="studio-thanks">
            <h3>{leadForm.thanksTitle}</h3>
            <p>
              {formAccessKey
                ? leadForm.thanksBody
                : ui.mailFallback.replace('{email}', site.email)}
            </p>
          </div>
        ) : (
          <form className="studio-form" onSubmit={onSubmit}>
            {contactFields.map((field) => (
              <label key={field.id}>
                <span>{field.label}</span>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.id}
                    required={field.required}
                    rows={5}
                    placeholder={field.placeholder}
                    autoComplete={autoCompleteFor(field.id, field.type)}
                  />
                ) : field.type === 'select' ? (
                  <select name={field.id} required={field.required} defaultValue="" autoComplete="off">
                    <option value="" disabled>
                      {ui.selectPlaceholder}
                    </option>
                    {field.options?.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.id}
                    required={field.required}
                    placeholder={field.placeholder}
                    autoComplete={autoCompleteFor(field.id, field.type)}
                  />
                )}
              </label>
            ))}
            {error ? <p className="studio-form-error">{error}</p> : null}
            <button type="submit" className="studio-cta studio-cta-lg" disabled={loading}>
              {loading ? leadForm.submitting : leadForm.submit}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export function FooterStudio() {
  const { site } = useContent()
  const { locale, ui } = useLocale()
  return (
    <footer className="studio-footer">
      <p className="studio-footer-name">Marcin Bochenek</p>
      <div className="studio-footer-links">
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <a href={articleIndexPath(locale)}>{ui.articlesNav}</a>
        <a href={site.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <LanguageSwitcher locale={locale} ariaLabel={ui.langAria} />
      </div>
    </footer>
  )
}

export function StickyCtaStudio() {
  const { site } = useContent()
  return (
    <div className="studio-sticky">
      <a href={ctaHref} {...(isExternalCta ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {site.ctaPrimary}
      </a>
    </div>
  )
}

export function ShellStudio() {
  return (
    <>
      <NavStudio />
      <main>
        <HeroStudio />
        <ProofStudio />
        <WorkStudio />
        <OfferStudio />
        <PackagesStudio />
        <TrustStudio />
        <FaqStudio />
        <ContactStudio />
      </main>
      <FooterStudio />
      <StickyCtaStudio />
    </>
  )
}
