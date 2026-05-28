import { projects, site } from '../data/content'
import { ProjectImage } from './ProjectImage'

const accentProject = projects[1]

export function About() {
  return (
    <section id="o-mnie" data-about className="section-pad editorial-rule border-t">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p data-reveal className="section-label">
            02 — O mnie
          </p>
          <h2 data-reveal className="font-display mt-4 text-4xl leading-tight md:text-5xl">
            Produktowiec, nie agencja z dziesięcioma slajdami.
          </h2>
        </div>
        <div className="lg:col-span-7">
          <p data-reveal className="text-lg leading-relaxed">
            {site.aboutLead}
          </p>
          <p data-reveal className="text-muted mt-6 leading-relaxed">
            {site.aboutAside}
          </p>
          <blockquote data-reveal className="border-rule mt-10 border-l-2 py-2 pl-6">
            <p className="font-display text-xl italic leading-snug md:text-2xl">
              „Lepiej jeden system, który działa w niedzielę o 23:00, niż pięć ładnych mockupów.”
            </p>
          </blockquote>
        </div>
      </div>

      <div data-reveal className="mx-auto mt-16 max-w-[1400px]">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="border-rule aspect-[16/9] overflow-hidden border">
            <ProjectImage project={projects[0]} variant="card" className="rounded-none" />
          </div>
          <div className="border-rule aspect-[3/4] overflow-hidden border md:-mt-12">
            <ProjectImage project={accentProject} variant="card" className="rounded-none" />
          </div>
        </div>
      </div>
    </section>
  )
}
