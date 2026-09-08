import { useMbAiCopy } from '../../i18n'

export function ProofStripMbAi() {
  const copy = useMbAiCopy()

  const shotFor = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes('plumm')) return '/projects/plumm/hero-hero.webp'
    if (n.includes('mint')) return '/projects/mint/hero-card.webp'
    if (n.includes('agentic')) return '/projects/agentic/hero-hero.webp'
    return ''
  }

  return (
    <section id="wdrozenia" className="mbai-proof-strip" aria-label={copy.proofAria}>
      <div className="mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3">
          {copy.proof.map((item) => {
            const src = shotFor(item.name)
            return (
              <article key={item.name} className="mbai-proof-item">
                {src ? (
                  <img
                    className="mbai-proof-shot"
                    src={src}
                    alt=""
                    width={1200}
                    height={675}
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                <p className="mbai-mono text-[10px] tracking-[0.18em] text-accent uppercase mb-2">
                  {item.tag}
                </p>
                <h2 className="font-[family-name:var(--font-grotesk)] text-[15px] font-semibold leading-snug text-[var(--color-paper)] mb-2">
                  {item.name}
                </h2>
                <p className="text-muted text-[13px] leading-relaxed mb-3">{item.detail}</p>
                <p className="mbai-mono text-[11px] text-[var(--color-paper)]/50">{item.metric}</p>
              </article>
            )
          })}
        </div>
      </div>
      <p className="mbai-mono text-center text-[10px] text-muted py-3 border-t border-[var(--mbai-line)]">
        {copy.proofDisclaimer}
      </p>
    </section>
  )
}
