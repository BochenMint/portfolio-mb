type HeroDefaultHeadlineProps = {
  lines: string[]
  className?: string
}

export function HeroDefaultHeadline({ lines, className = '' }: HeroDefaultHeadlineProps) {
  return (
    <h1
      className={`font-headline mt-6 text-[clamp(3.25rem,14vw,10rem)] leading-[0.88] tracking-tight ${className}`}
    >
      {lines.map((line) => (
        <span key={line} data-hero-line className="block overflow-hidden">
          <span data-hero-line-inner className="block">
            {line.split('').map((char, j) => (
              <span key={`${line}-${j}`} data-hero-word className="inline-block">
                {char}
              </span>
            ))}
          </span>
        </span>
      ))}
    </h1>
  )
}
