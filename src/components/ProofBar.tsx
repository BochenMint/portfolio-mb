import { proofProducts } from '../i18n/live'

export function ProofBar() {
  return (
    <div
      className="border-b border-[var(--color-paper)]/10 bg-[var(--color-paper)]/[0.018] py-6"
      aria-label="Produkty w produkcji"
    >
      <div className="mx-auto grid max-w-6xl gap-4 px-6 md:grid-cols-[minmax(12rem,0.8fr)_1.2fr] md:items-center md:px-10 lg:px-16">
        <div>
          <span className="font-mono text-[10px] font-semibold tracking-[0.16em] uppercase text-accent">
            Weryfikowalne wdrożenia
          </span>
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-paper)]/58">
            Zero fikcyjnych opinii. Klikalne produkty i uczciwe sygnały zaufania.
          </p>
        </div>

        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {proofProducts.map((product) =>
            product.live ? (
              <li key={product.name}>
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-[var(--color-paper)]/10 bg-[var(--color-paper)]/[0.035] px-3 py-3 font-mono text-xs font-medium text-[var(--color-paper)]/74 transition duration-300 hover:border-accent/35 hover:bg-accent/[0.06] hover:text-accent"
                >
                  <span>{product.name}</span>
                  <span
                    className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-1 font-mono text-[9px] font-semibold tracking-[0.12em] uppercase text-accent transition-colors duration-200 group-hover:bg-accent/20"
                    aria-label="live"
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
                      aria-hidden
                    />
                    LIVE
                  </span>
                </a>
              </li>
            ) : (
              <li
                key={product.name}
                className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-[var(--color-paper)]/8 bg-[var(--color-paper)]/[0.02] px-3 py-3 font-mono text-xs text-[var(--color-paper)]/35"
              >
                <span>{product.name}</span>
                <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-[var(--color-paper)]/25">
                  wewnętrzny
                </span>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  )
}
