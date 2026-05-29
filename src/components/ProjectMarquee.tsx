import { projects } from '../data/content'

const labels = projects.map((p) => p.title)

export function ProjectMarquee() {
  const track = [...labels, ...labels]

  return (
    <div
      data-marquee
      className="marquee-wrap relative overflow-hidden border-y border-[var(--color-paper)]/15 py-6 md:py-8"
      aria-hidden
    >
      <div data-marquee-track className="marquee-track flex w-max items-center gap-0">
        {track.map((title, i) => (
          <span
            key={`${title}-${i}`}
            className="font-headline shrink-0 px-6 text-[clamp(2.5rem,8vw,6.5rem)] leading-none tracking-tight text-[var(--color-paper)]/90 md:px-10"
          >
            {title}
            <span className="mx-6 inline-block text-[var(--color-paper)]/25 md:mx-10" aria-hidden>
              —
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
