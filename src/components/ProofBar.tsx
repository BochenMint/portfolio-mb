import { projects, site } from '../data/content'

export function ProofBar() {
  return (
    <section data-section className="border-line border-b bg-surface/60 px-5 py-8 md:px-10">
      <div className="mx-auto max-w-7xl">
        <p data-reveal className="text-muted text-center text-xs tracking-[0.2em] uppercase md:text-left">
          {site.proofLine}
        </p>
        <ul
          data-reveal
          className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:justify-start"
        >
          {projects.map((p) => (
            <li key={p.id} className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: p.accent, boxShadow: `0 0 12px ${p.accent}66` }}
              />
              <span className="font-display text-sm font-semibold md:text-base">{p.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
