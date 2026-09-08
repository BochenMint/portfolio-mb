import { AgenticSwarmCanvas } from '../../v3/AgenticSwarmCanvas'
import { projectImageTextureUrl } from '../../lib/projectImageUrl'
import { useContent, useMbAiCopy } from '../../i18n'
import { projects } from '../../data/content'

const agenticProject = projects.find((p) => p.id === 'agentic')!

export function HeroMbAi() {
  const { site } = useContent()
  const copy = useMbAiCopy()
  const ctaHref = site.calendly || '#kontakt'

  return (
    <section id="top" className="relative min-h-[100dvh] overflow-hidden">
      <div className="absolute inset-0 md:left-[38%]" aria-hidden>
        <div className="mbai-hero-atmo absolute inset-0 md:hidden" />
        <AgenticSwarmCanvas
          className="absolute inset-0 h-full w-full"
          imgProps={{
            src: projectImageTextureUrl(agenticProject, 'hero'),
            alt: '',
            className: 'h-full w-full object-cover object-center',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-center px-5 pt-28 pb-20 md:px-8">
        <div className="max-w-xl md:max-w-[28rem]">
          <img
            src="/brand/logo-mb-ai.svg"
            alt="MB AI"
            width={148}
            height={36}
            className="mbai-fade-up mb-6 h-9 w-auto"
            style={{ animationDelay: '0.05s' }}
          />

          <h1
            className="mbai-display text-[clamp(2.4rem,6.5vw,4.5rem)] text-balance mbai-fade-up"
            style={{ animationDelay: '0.12s' }}
          >
            {copy.heroTitleBefore}
            <em className="mbai-serif-accent">{copy.heroTitleEm}</em>
            {copy.heroTitleAfter}
          </h1>

          <p
            className="mbai-fade-up mt-6 text-base leading-relaxed text-[var(--color-paper)]/72 md:text-lg"
            style={{ animationDelay: '0.22s' }}
          >
            {copy.heroLead}
          </p>

          <div className="mbai-fade-up mt-10" style={{ animationDelay: '0.32s' }}>
            <a
              href={ctaHref}
              className="btn-accent text-base"
              {...(site.calendly ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {site.ctaCalendly}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
