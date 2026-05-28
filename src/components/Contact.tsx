import { site } from '../data/content'

export function Contact() {
  return (
    <section id="kontakt" data-section className="gradient-mesh px-5 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-7xl text-center">
        <p data-reveal className="text-mint text-xs font-semibold tracking-[0.3em] uppercase">
          Następny krok
        </p>
        <h2
          data-reveal
          className="font-display mx-auto mt-6 max-w-4xl text-[clamp(2rem,6vw,4.5rem)] leading-tight font-bold"
        >
          Masz pomysł na produkt albo chcesz podnieść poziom tego, co już masz?
        </h2>
        <p data-reveal className="text-muted mx-auto mt-6 max-w-xl text-lg">
          Napisz w dwóch zdaniach, czym się zajmujesz — odpowiem z konkretną propozycją, nie
          automatycznym PDF-em.
        </p>

        <div data-reveal className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={`mailto:${site.email}`}
            className="font-display inline-flex rounded-full bg-mint px-10 py-4 text-lg font-bold text-ink transition-transform hover:scale-[1.02]"
          >
            {site.email}
          </a>
        </div>

        <p data-reveal className="text-muted mt-16 text-xs tracking-wide">
          © {new Date().getFullYear()} {site.name} — szkic portfolio · web · automatyzacja · AI
        </p>
      </div>
    </section>
  )
}
