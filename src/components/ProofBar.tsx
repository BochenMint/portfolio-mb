import { proofProducts } from '../data/content'

export function ProofBar() {
  return (
    <div
      className="border-b border-[var(--color-paper)]/12 py-6"
      aria-label="Produkty w produkcji"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-6 md:px-10 lg:px-16">
        <span className="text-muted text-[10px] tracking-[0.14em] uppercase">W produkcji</span>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-[var(--color-paper)]/70">
          {proofProducts.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
