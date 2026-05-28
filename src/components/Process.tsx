import { process } from '../data/content'

export function Process() {
  return (
    <section id="proces" data-section className="border-line border-t bg-surface/40 px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <p data-reveal className="text-mint text-xs font-semibold tracking-[0.3em] uppercase">
          Jak pracuję
        </p>
        <h2 data-reveal className="font-display mt-4 max-w-2xl text-4xl font-bold md:text-5xl">
          Od rozmowy do efektu wow — bez chaosu w środku.
        </h2>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4">
          {process.map((item) => (
            <li
              key={item.step}
              data-reveal
              className="bg-surface-2 flex flex-col p-8 transition-colors hover:bg-surface"
            >
              <span className="font-display text-mint text-4xl font-bold">{item.step}</span>
              <h3 className="font-display mt-6 text-xl font-bold">{item.title}</h3>
              <p className="text-muted mt-3 text-sm leading-relaxed">{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
