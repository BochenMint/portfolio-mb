import { projects } from '../data/content'

/**
 * Elegant static fallback for touch/coarse-pointer devices and browsers
 * without WebGL2 — the flight-sim experience needs a keyboard, so this stands
 * in with the same v3 typography tokens and a direct path to the real work.
 *
 * Note: project links target `/#realizacje` — the section id of the v3
 * Showcase, which is what `/` serves now (`#work` exists only in the legacy
 * v1 app living at /v1.html).
 */
export function FallbackScreen() {
  return (
    <div className="v4-fallback">
      <div className="v4-fallback__card">
        <p className="v4-fallback__eyebrow">Misja: nowa strona</p>
        <h1 className="v4-fallback__title">Ta misja wymaga klawiatury.</h1>
        <p className="v4-fallback__lead">
          Ta wersja portfolio to gra kosmiczna sterowana klawiaturą — na telefonie czy tablecie tego
          nie poczujesz. Zamiast tego, oto cztery systemy, które już pracują w produkcji:
        </p>
        <div className="v4-fallback__list">
          {projects.map((project) => (
            <a key={project.id} className="v4-fallback__item" href="/#realizacje">
              <span className="v4-fallback__item-title">{project.title}</span>
              <span className="v4-fallback__item-tagline">{project.tagline}</span>
            </a>
          ))}
        </div>
        <a className="v4-fallback__back" href="/">
          &larr; klasyczne portfolio
        </a>
      </div>
    </div>
  )
}
