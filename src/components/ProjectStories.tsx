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
      className="border-t border-rule bg-[var(--color-chapter)]"
    >
      <div className="section-pad mx-auto max-w-6xl pb-8">
        <p data-reveal className="section-label">
          Case studies
        </p>
        <h2
          data-reveal
          className="font-headline mt-4 text-[clamp(2.25rem,5vw,4rem)] leading-[0.95]"
        >
          Wynik → problem → wkład → decyzje
        </h2>
      </div>

      <div className="flex flex-col">
        {projects.map((project, index) => {
          const next = projects[index + 1]
          return (
            <article
              key={project.id}
              id={`project-${project.id}`}
              data-case-study
              className="scroll-mt-28 border-t border-rule md:scroll-mt-32"
            >
              <div
                data-case-image
                className="bleed-full relative aspect-[16/9] overflow-hidden bg-[var(--color-surface)] md:aspect-[21/9]"
              >
                <ProjectImage
                  project={project}
                  variant="hero"
                  className="h-[115%] w-full max-w-none rounded-none object-cover"
                />
                <span className="project-index absolute top-6 left-6 z-10 px-3 py-1.5 md:left-10 lg:left-16">
                  {padIndex(index + 1)}
                </span>
              </div>

              <div className="section-pad-tight mx-auto max-w-6xl">
                <h3 data-case-line className="font-headline mt-2 text-[clamp(2rem,4vw,3.25rem)] leading-tight">
                  {project.title}
                </h3>
                <p data-case-line className="text-muted mt-2 text-sm md:text-base">
                  {project.client}
                </p>

                <dl className="mt-10 grid gap-8 md:grid-cols-2 md:gap-12 lg:mt-14">
                  <div data-case-line>
                    <dt className="section-label text-[10px]">Wynik</dt>
                    <dd className="text-accent mt-3 text-base font-medium leading-relaxed md:text-lg">
                      {project.outcome}
                    </dd>
                  </div>
                  <div data-case-line>
                    <dt className="section-label text-[10px]">Problem</dt>
                    <dd className="mt-3 leading-relaxed">{project.pain}</dd>
                  </div>
                  <div data-case-line>
                    <dt className="section-label text-[10px]">Mój wkład</dt>
                    <dd className="mt-3 leading-relaxed">{project.contribution}</dd>
                  </div>
                  <div data-case-line>
                    <dt className="section-label text-[10px]">Kluczowe decyzje</dt>
                    <dd className="mt-3">
                      <ul className="text-muted space-y-2 leading-relaxed">
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
                    data-case-line
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-fill mt-10 inline-flex"
                  >
                    {project.domain}
                    <span aria-hidden>↗</span>
                  </a>
                ) : null}

                {next ? (
                  <a
                    data-case-next
                    href={`#project-${next.id}`}
                    className="project-next mt-16 block border-t border-rule pt-10"
                  >
                    <span className="section-label text-[10px]">Następny projekt</span>
                    <span className="font-headline mt-3 block text-[clamp(1.5rem,3vw,2.5rem)] leading-tight">
                      {next.title}
                    </span>
                    <span aria-hidden className="text-accent text-2xl">
                      →
                    </span>
                  </a>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
