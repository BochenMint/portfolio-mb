import { projects } from '../data/content'

const LIVE_IDS = ['mint', 'plumm'] as const

export function LiveSitesRibbon() {
  const live = projects.filter((p) => LIVE_IDS.includes(p.id as (typeof LIVE_IDS)[number]))

  return (
    <aside
      data-live-ribbon
      className="editorial-rule border-t bg-surface section-pad py-10 md:py-12"
      aria-label="Produkty na produkcji"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-label">Na produkcji</p>
          <p className="font-display mt-2 text-2xl leading-tight md:text-3xl">
            Zobacz systemy, które już zarabiają
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {live.map((p) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              data-contact-cta
              className={
                p.id === 'mint'
                  ? 'btn-fill text-sm'
                  : 'btn-soft border-accent/40 text-sm'
              }
            >
              {p.domain}
              <span aria-hidden>↗</span>
            </a>
          ))}
          <a href="#kontakt" className="btn-soft text-sm">
            Brief projektu
          </a>
        </div>
      </div>
    </aside>
  )
}
