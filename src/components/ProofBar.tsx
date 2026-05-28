import { projects, site } from '../data/content'

export function ProofBar() {
  return (
    <section data-section className="editorial-rule border-b px-5 py-8 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <p data-reveal className="text-muted text-center text-xs tracking-[0.2em] uppercase md:text-left">
          {site.role} · {site.location}
        </p>
        <ul
          data-reveal
          className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:justify-start"
        >
          {projects.map((p) => {
            const inner = (
              <>
                <span className="bg-accent h-2 w-2 rounded-full" />
                <span className="font-display text-sm md:text-base">{p.title}</span>
                {p.url !== '#' && (
                  <span className="text-muted text-xs font-normal">· {p.domain}</span>
                )}
              </>
            )
            return (
              <li key={p.id}>
                {p.url !== '#' ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 transition-colors hover:text-accent"
                  >
                    {inner}
                  </a>
                ) : (
                  <span className="flex items-center gap-2">{inner}</span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
