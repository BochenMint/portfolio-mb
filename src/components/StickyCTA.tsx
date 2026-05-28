import { site } from '../data/content'

export function StickyCTA() {
  const href = site.calendly || '#kontakt'

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-rule bg-paper/95 p-3 backdrop-blur-sm md:hidden">
      <a
        href={href}
        className="btn-fill flex w-full justify-center"
        {...(site.calendly ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {site.ctaSticky}
      </a>
    </div>
  )
}
