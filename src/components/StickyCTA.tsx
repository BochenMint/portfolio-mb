import { site } from '../data/content'

export function StickyCTA() {
  const href = site.calendly || '#kontakt'

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-line bg-ink/90 p-3 backdrop-blur-xl md:hidden">
      <a
        href={href}
        className="flex w-full items-center justify-center rounded-full bg-mint py-3.5 text-sm font-bold text-ink"
        {...(site.calendly ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {site.ctaSticky}
      </a>
    </div>
  )
}
