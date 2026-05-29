import { projects } from '../data/content'
import { ProjectImage } from './ProjectImage'

function padIndex(n: number) {
  return String(n).padStart(2, '0')
}

export function ProjectStories() {
  return (
    <section
      id="case-studies"
      data-section
      className="section-pad border-t border-rule bg-paper-bright"
    >
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="section-label">
          Case studies
        </p>
        <h2 data-reveal className="font-headline mt-3 text-3xl leading-tight md:text-4xl">
          Wynik → problem → wkład → decyzje
        </h2>

        <div className="mt-16 space-y-20 md:space-y-24">
          {projects.map((project, index) => (
            <article
              key={project.id}
              id={`project-${project.id}`}
              data-reveal
              className="scroll-mt-28 border-t border-rule pt-14 first:border-t-0 first:pt-0 md:scroll-mt-32"
            >
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
                <div className="aspect-[16/10] overflow-hidden border border-rule bg-surface lg:min-h-[360px]">
                  <ProjectImage project={project} variant="hero" className="rounded-none" />
                </div>

                <div>
                  <span className="project-index inline-block px-2.5 py-1">{padIndex(index + 1)}</span>
                  <h3 className="font-headline mt-4 text-3xl md:text-4xl">{project.title}</h3>
                  <p className="text-muted mt-1 text-sm">{project.client}</p>

                  <dl className="mt-8 space-y-5 text-sm leading-relaxed md:text-base">
                    <div>
                      <dt className="section-label text-[10px]">Wynik</dt>
                      <dd className="text-accent mt-2 font-medium">{project.outcome}</dd>
                    </div>
                    <div>
                      <dt className="section-label text-[10px]">Problem</dt>
                      <dd className="mt-2">{project.pain}</dd>
                    </div>
                    <div>
                      <dt className="section-label text-[10px]">Mój wkład</dt>
                      <dd className="mt-2">{project.contribution}</dd>
                    </div>
                    <div>
                      <dt className="section-label text-[10px]">Kluczowe decyzje</dt>
                      <dd className="mt-2">
                        <ul className="text-muted space-y-2">
                          {project.decisions.map((d) => (
                            <li key={d} className="flex gap-2">
                              <span className="text-accent" aria-hidden>
                                ·
                              </span>
                              {d}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </dl>

                  {project.url.startsWith('http') ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-fill mt-8 inline-flex"
                    >
                      {project.domain}
                      <span aria-hidden>↗</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
