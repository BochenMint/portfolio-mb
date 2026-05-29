type SectionIntroProps = {
  num: string
  title: string
  lead?: string
}

export function SectionIntro({ num, title, lead }: SectionIntroProps) {
  return (
    <header className="mb-12 md:mb-16">
      <p data-reveal className="section-label flex items-center gap-4">
        <span className="tabular-nums">{num}</span>
        <span className="h-px w-12 bg-[var(--color-paper)]/25" aria-hidden />
      </p>
      <h2
        data-reveal
        className="font-headline mt-5 text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[1.02] tracking-tight"
      >
        {title}
      </h2>
      {lead ? (
        <p data-reveal className="text-muted mt-5 max-w-2xl text-base leading-relaxed md:text-lg">
          {lead}
        </p>
      ) : null}
    </header>
  )
}
