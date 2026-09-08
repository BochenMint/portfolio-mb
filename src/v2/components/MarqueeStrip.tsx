const ITEMS = [
  'Direct booking',
  'KSeF',
  'AI concierge 24/7',
  'PMS · channel manager',
  'Smart-lock',
  'Automatyzacje',
  'Next.js',
  'Astro',
  'React',
  'Audyt kroków',
]

export function MarqueeStrip() {
  const row = [...ITEMS, ...ITEMS]
  return (
    <div className="relative z-10 overflow-hidden border-y border-[var(--v2-line)] bg-[var(--v2-surface)]/40 py-4">
      <div className="v2-marquee">
        {row.map((t, i) => (
          <span
            key={i}
            className="v2-mono mx-6 text-sm tracking-[0.18em] text-[var(--color-paper)]/45 uppercase"
          >
            {t} <span className="text-accent">/</span>
          </span>
        ))}
      </div>
    </div>
  )
}
