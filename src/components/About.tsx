import { site } from '../data/content'
import { Portrait } from './Portrait'
import { SectionIntro } from './SectionIntro'

export function About() {
  return (
    <section id="about" data-section className="section-pad">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          num="01"
          title="O mnie"
          lead="Studio produktowe w jednej osobie — proces i liczby przed pikselami."
        />

        <div className="grid items-start gap-10 md:grid-cols-[minmax(200px,300px)_1fr] md:gap-14 lg:gap-20">
          <figure
            data-about-portrait
            className="relative mx-auto aspect-[4/5] w-full max-w-[300px] overflow-hidden border border-[var(--color-paper)]/20 bg-[var(--color-paper)]/5 will-change-transform md:mx-0"
          >
            <Portrait sizes="(min-width: 768px) 300px, 72vw" className="h-full w-full" />
          </figure>

          <div className="min-w-0">
            <blockquote
              data-pull-quote
              className="font-headline border-l border-[var(--color-paper)]/30 pl-6 text-2xl leading-snug md:text-[1.85rem]"
            >
              Buduję produkty, które działają w niedzielę o 23:00.
            </blockquote>
            <div className="mt-8 grid gap-6 md:grid-cols-2 md:gap-10">
              <p data-reveal className="text-base leading-relaxed text-[var(--color-paper)]/85 md:text-lg">
                {site.aboutLead}
              </p>
              <p data-reveal className="text-muted text-base leading-relaxed">
                {site.aboutAside}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
