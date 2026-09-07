import { useLocale } from '../i18n/context'

export function Band() {
  const { t: c } = useLocale()
  const items = c.band

  return (
    <div data-chrome className="brushed brushed-band overflow-hidden py-5">
      <div className="flex w-max animate-marquee items-center gap-8">
        {[...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-8" aria-hidden={i >= items.length}>
            <span className="engraved font-display text-sm font-semibold tracking-[0.18em] uppercase">
              {item}
            </span>
            <span className="engraved text-sm">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
