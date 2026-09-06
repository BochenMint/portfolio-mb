import { projects } from '../../data/content'
import { chromeCopy as c } from '../copy'
import { ChromeCard, SectionHeader } from './primitives'

function Block({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="engraved eyebrow opacity-70">{label}</p>
      <p className="engraved mt-3 text-[15px] leading-relaxed md:text-base">{text}</p>
    </div>
  )
}

export function CaseStudies() {
  return (
    <section id="case-studies" className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow={c.cases.eyebrow} title={c.cases.title} lead={c.cases.lead} />

        <div className="mt-14 flex flex-col gap-6">
          {projects.map((project, i) => (
            <ChromeCard
              key={project.id}
              as="article"
              data-card
              tone="brushed"
              className="grid gap-8 p-6 md:p-10 lg:grid-cols-12 lg:items-start lg:gap-10"
            >
              <div className="lg:col-span-5">
                <p className="engraved font-mono text-sm tracking-[0.1em] opacity-60">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="engraved mt-3 text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
                  {project.title}
                </h3>
                <p className="engraved mt-2 text-sm opacity-70 md:text-base">{project.client}</p>
              </div>

              <div className="hidden justify-center lg:col-span-1 lg:flex">
                <div className="hairline-v h-full" />
              </div>

              <div className="flex flex-col gap-6 lg:col-span-6">
                <Block label={c.cases.labels.pain} text={project.pain} />
                <div className="hairline opacity-40" />
                <Block label={c.cases.labels.approach} text={project.approach} />
                <div className="hairline opacity-40" />
                <Block label={c.cases.labels.result} text={project.result} />
              </div>
            </ChromeCard>
          ))}
        </div>
      </div>
    </section>
  )
}
