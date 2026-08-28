import { useLocale } from '../i18n'
import { getArchiveUi } from '../i18n/archive-ui'
import { projects, site } from '../i18n/live'
import { isExternalLiveUrl } from './engine/format'

const portfolio = site.portfolioUrl.replace(/\/$/, '')
const caseStudies = `${portfolio}/#realizacje`

/**
 * Elegant static fallback for browsers without WebGL2 — the flight-sim needs
 * WebGL; on touch devices with WebGL2 the full game runs with virtual controls.
 */
export function FallbackScreen() {
  const { locale } = useLocale()
  const ui = getArchiveUi(locale).v4Fallback
  return (
    <div className="v4-fallback">
      <div className="v4-fallback__card">
        <p className="v4-fallback__eyebrow">{ui.eyebrow}</p>
        <h1 className="v4-fallback__title">{ui.title}</h1>
        <p className="v4-fallback__lead">{ui.lead}</p>
        <div className="v4-fallback__list">
          {projects.map((project) => (
            <a
              key={project.id}
              className="v4-fallback__item"
              href={isExternalLiveUrl(project.url) ? project.url : caseStudies}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="v4-fallback__item-title">{project.title}</span>
              <span className="v4-fallback__item-tagline">{project.tagline}</span>
            </a>
          ))}
        </div>
        <div className="v4-fallback__actions">
          <a className="v4-fallback__cta" href={caseStudies}>
            {ui.seeWork}
          </a>
          <a className="v4-fallback__back" href={portfolio}>
            {ui.back}
          </a>
        </div>
        <p className="v4-fallback__hint">
          {ui.hintBefore}
          <a href={site.gameUrl} rel="noopener">
            {site.gameUrl.replace(/^https?:\/\//, '')}
          </a>
          {ui.hintAfter}
        </p>
      </div>
    </div>
  )
}
