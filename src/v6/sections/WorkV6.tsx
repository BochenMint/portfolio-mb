import { useRef } from 'react'
import { projects, sections } from '../../i18n/live'
import { useWorkMotion } from '../useWorkMotion'
import { WorkStageV6 } from './WorkStageV6'

export function WorkV6() {
  const sectionRef = useRef<HTMLElement>(null)
  useWorkMotion(sectionRef)

  const ordered = [...projects].sort((a, b) => {
    if (a.flagship && !b.flagship) return -1
    if (!a.flagship && b.flagship) return 1
    return 0
  })

  return (
    <section
      id="realizacje"
      ref={sectionRef}
      className="v6-work v6-section"
      aria-labelledby="v6-work-title"
    >
      <div className="v6-wrap v6-section-rail">
        <p className="v6-section-index" aria-hidden>{sections.work.num}</p>
        <div className="v6-section-body">
          <div className="v6-section-head">
            <p className="v6-eyebrow">LOAD CARTRIDGE</p>
            <h2 id="v6-work-title" data-v6-split>{sections.work.title}</h2>
            <p className="v6-section-lead">{sections.work.lead}</p>
          </div>
        </div>
      </div>

      <div className="v6-work-deck">
        {ordered.map((project, index) => (
          <WorkStageV6
            key={project.id}
            project={project}
            index={index}
            total={ordered.length}
            variant="desktop"
          />
        ))}
      </div>

      <div className="v6-work-mobile" data-lenis-prevent>
        {ordered.map((project, index) => (
          <WorkStageV6
            key={`${project.id}-m`}
            project={project}
            index={index}
            total={ordered.length}
            variant="mobile"
          />
        ))}
      </div>
    </section>
  )
}
