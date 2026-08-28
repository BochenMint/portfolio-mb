import { projects, sections } from '../../i18n/live'
import { projectImage, projectLiveUrl } from '../utils'

const sorted = [...projects].sort(
  (a, b) => Number(b.flagship ?? false) - Number(a.flagship ?? false),
)

export function WorkSlabsV5() {
  return (
    <section id="volt-work" className="volt-work" aria-labelledby="volt-work-title">
      <div className="volt-work-intro volt-wrap">
        <p className="volt-mono">{sections.work.num} · realizacje</p>
        <h2 id="volt-work-title" data-volt-split>
          {sections.work.title}
        </h2>
        <p>{sections.work.lead}</p>
      </div>
      {sorted.map((project, index) => {
        const live = projectLiveUrl(project.id)
        const bg = projectImage(project.id)
        const showLink = live.live && live.url

        return (
          <article
            key={project.id}
            id={`project-${project.id}`}
            className="volt-slab"
            style={{ backgroundImage: `url(${bg})` }}
          >
            <div className="volt-slab-inner">
              <p className="volt-slab-num">
                {String(index + 1).padStart(2, '0')} · {project.domain}
              </p>
              <h3 className="volt-slab-title">{project.title}</h3>
              <p className="volt-slab-tagline">{project.tagline}</p>
              <p className="volt-slab-pain">{project.pain}</p>
              <p className="volt-slab-outcome">{project.outcome}</p>
              <div className="volt-slab-actions">
                {project.flagship ? <span className="volt-slab-badge">Flagship</span> : null}
                {showLink ? (
                  <a
                    href={live.url}
                    className="volt-slab-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Zobacz na żywo →
                  </a>
                ) : (
                  <span className="volt-slab-link volt-slab-link--muted">
                    Wdrożenie wewnętrzne / przed startem
                  </span>
                )}
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}
