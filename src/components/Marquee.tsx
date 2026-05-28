import { marqueeItems } from '../data/content'

export function Marquee() {
  const items = [...marqueeItems, ...marqueeItems]

  return (
    <div data-marquee className="border-line border-y bg-surface/50 py-5 overflow-hidden">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-display text-sm font-semibold tracking-wide text-cream/70 uppercase md:text-base"
          >
            {item}
            <span className="text-mint mx-10">◆</span>
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
