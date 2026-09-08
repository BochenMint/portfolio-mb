type SectionIntroProps = {
  num: string
  title: string
  lead?: string
}

export function SectionIntro({ num, title, lead }: SectionIntroProps) {
  return (
    <header className="mb-14 md:mb-18">
      {/* mono section number */}
      <p data-reveal className="font-mono text-[11px] font-semibold tracking-[0.18em] uppercase text-accent mb-5">
        <span className="tabular-nums">{num}</span>
      </p>

      {/* accent hairline above title */}
      <div className="accent-hairline mb-6 w-14" aria-hidden />

      <h2
        data-reveal
        className="font-headline text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.0] tracking-tight text-balance"
      >
        {title}
      </h2>

      {lead ? (
        <p
          data-reveal
          className="text-muted mt-5 max-w-[58ch] text-base leading-relaxed md:text-lg"
        >
          {lead}
        </p>
      ) : null}
    </header>
  )
}
