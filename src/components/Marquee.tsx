import { projects } from '../data/content'

export function Marquee() {
  const items = projects.flatMap((p) => [p.title, p.domain])
  const loop = [...items, ...items]

  return (
    <div data-marquee className="editorial-rule overflow-hidden border-y py-5">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-display text-sm tracking-wide text-muted uppercase md:text-base"
          >
            {item}
            <span className="text-accent mx-10">◆</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee { animation: none; }
        }
      `}</style>
    </div>
  )
}
