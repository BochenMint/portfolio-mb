import { sections, services, site } from '../../data/content'

export function Capabilities() {
  return (
    <section id="capabilities" className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
      {/* Section header */}
      <div className="reveal mb-14">
        <p className="v2-label">01 / MOŻLIWOŚCI</p>
        <h2 className="v2-display mt-4 text-[clamp(2rem,5vw,3.75rem)]">
          {sections.services.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-paper)]/60 md:text-lg">
          {sections.services.lead}
        </p>
      </div>

      {/* Service cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {services.map((svc) => (
          <div key={svc.num} className="v2-panel v2-hud v2-panel-link reveal flex flex-col p-7 md:p-8">
            {/* Number */}
            <span className="v2-mono text-[11px] tracking-[0.2em] text-accent">{svc.num}</span>

            {/* Outcome — bold lead */}
            <p className="font-grotesk mt-5 text-xl font-semibold leading-snug tracking-tight">
              {svc.outcome}
            </p>

            {/* Description */}
            <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-[var(--color-paper)]/60">
              {svc.description}
            </p>

            {/* Tags */}
            <div className="mt-5 flex flex-wrap gap-1.5">
              {svc.tags.map((tag) => (
                <span
                  key={tag}
                  className="v2-mono rounded border border-[var(--v2-line-bright)] px-2 py-0.5 text-[10px] tracking-[0.12em] text-[var(--color-paper)]/50 uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Meta line */}
            <p className="v2-mono mt-4 border-t border-[var(--v2-line)] pt-4 text-[10px] tracking-[0.12em] text-[var(--color-paper)]/40">
              {svc.timeline}
              <span className="mx-1 opacity-40">·</span>
              <span className="text-accent">{svc.from}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Solo builder callout */}
      <div className="v2-panel v2-hud reveal mt-4 p-7 md:p-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr]">
          <div>
            <p className="v2-label">// OPERATOR</p>
          </div>
          <div>
            <p className="font-grotesk text-xl font-semibold leading-snug tracking-tight md:text-2xl">
              Solo builder = supermoc
            </p>
            <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-[var(--color-paper)]/60">
              {site.aboutLead}{' '}
              <span className="text-[var(--color-paper)]/80">
                Jeden człowiek odpowiada za całość — brak „telephone game" między designem, devem i PM.
                Szybciej, spójniej, bez tracenia kontekstu między spotkaniami.
              </span>
            </p>
            <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-[var(--color-paper)]/45">
              {site.aboutAside}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
