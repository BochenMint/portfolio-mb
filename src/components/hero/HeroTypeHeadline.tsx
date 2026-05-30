type HeroTypeHeadlineProps = {
  lines: string[]
}

export function HeroTypeHeadline({ lines }: HeroTypeHeadlineProps) {
  return (
    <div className="hero-type-headline relative mt-6">
      <div className="hero-type-glass pointer-events-none absolute -inset-x-4 -inset-y-6 rounded-2xl" aria-hidden />

      <h1 className="hero-type-title relative font-headline text-[clamp(3.25rem,14vw,10rem)] leading-[0.88] tracking-tight">
        {lines.map((line) => (
          <span key={line} data-hero-line className="hero-type-line block overflow-hidden">
            <span data-hero-line-inner className="hero-type-line-inner block">
              {line.split('').map((char, j) => (
                <span
                  key={`${line}-${j}`}
                  data-hero-word
                  data-hero-type-char
                  className="hero-type-char inline-block"
                >
                  {char === ' ' ? '\u00a0' : char}
                </span>
              ))}
            </span>
            <span
              className="hero-type-aberration hero-type-aberration--cyan block"
              aria-hidden
            >
              {line.split('').map((char, j) => (
                <span key={`c-${line}-${j}`} className="inline-block">
                  {char === ' ' ? '\u00a0' : char}
                </span>
              ))}
            </span>
            <span
              className="hero-type-aberration hero-type-aberration--magenta block"
              aria-hidden
            >
              {line.split('').map((char, j) => (
                <span key={`m-${line}-${j}`} className="inline-block">
                  {char === ' ' ? '\u00a0' : char}
                </span>
              ))}
            </span>
          </span>
        ))}
      </h1>
    </div>
  )
}
