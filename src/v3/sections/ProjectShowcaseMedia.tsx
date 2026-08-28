import type { Project } from '../../i18n/live'
import { showcaseShotsForProject } from '../../data/gallery'
import { AgenticSwarmCanvas } from '../AgenticSwarmCanvas'

type ProjectShowcaseMediaProps = {
  project: Project
  className?: string
}

function ShowcaseShotImg({
  shot,
  parallaxClass,
  loading,
}: {
  shot: ReturnType<typeof showcaseShotsForProject>[number]
  parallaxClass: string
  loading: 'eager' | 'lazy'
}) {
  return (
    <img
      src={shot.srcSmall}
      srcSet={`${shot.srcSmall} 1200w, ${shot.src} 2400w`}
      sizes="(min-width: 768px) 45vw, 88vw"
      width={shot.width}
      height={shot.height}
      alt={shot.alt}
      loading={loading}
      decoding="async"
      className={parallaxClass}
    />
  )
}

export function ProjectShowcaseMedia({ project, className = '' }: ProjectShowcaseMediaProps) {
  const shots = showcaseShotsForProject(project.id, 3)
  const [primary, secondaryA, secondaryB] = shots
  const useSwarm = project.id === 'agentic'

  if (!primary) return null

  return (
    <div className={['v3-showcase-media', className].filter(Boolean).join(' ')}>
      {/* Desktop: layered composition */}
      <div className="v3-showcase-media--desktop absolute inset-0 hidden md:block">
        <div className="v3-showcase-shot v3-showcase-shot--primary">
          {useSwarm ? (
            <AgenticSwarmCanvas
              className="h-full w-full"
              imgProps={{
                src: primary.srcSmall,
                alt: primary.alt,
                loading: 'lazy',
                className: 'v3-showcase-shot-img v3-parallax-img v3-parallax-img--primary',
              }}
            />
          ) : (
            <ShowcaseShotImg
              shot={primary}
              parallaxClass="v3-showcase-shot-img v3-parallax-img v3-parallax-img--primary"
              loading="lazy"
            />
          )}
        </div>

        {secondaryA && (
          <div className="v3-showcase-shot v3-showcase-shot--secondary v3-showcase-shot--a">
            <ShowcaseShotImg
              shot={secondaryA}
              parallaxClass="v3-showcase-shot-img v3-parallax-img v3-parallax-img--secondary"
              loading="lazy"
            />
          </div>
        )}

        {secondaryB && (
          <div className="v3-showcase-shot v3-showcase-shot--secondary v3-showcase-shot--b">
            <ShowcaseShotImg
              shot={secondaryB}
              parallaxClass="v3-showcase-shot-img v3-parallax-img v3-parallax-img--secondary"
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* Mobile: horizontal filmstrip */}
      <div className="v3-showcase-strip md:hidden" data-lenis-prevent>
        {shots.map((shot, i) => (
          <figure key={shot.src} className="v3-showcase-strip-item">
            {useSwarm && i === 0 ? (
              <AgenticSwarmCanvas
                className="h-full w-full"
                imgProps={{
                  src: shot.srcSmall,
                  alt: shot.alt,
                  loading: i === 0 ? 'eager' : 'lazy',
                  className: 'h-full w-full object-cover object-top',
                }}
              />
            ) : (
              <img
                src={shot.srcSmall}
                srcSet={`${shot.srcSmall} 1200w, ${shot.src} 2400w`}
                sizes="88vw"
                width={shot.width}
                height={shot.height}
                alt={shot.alt}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            )}
          </figure>
        ))}
      </div>
    </div>
  )
}
