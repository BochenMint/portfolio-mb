import { site } from '../data/content'

export function StickyCTA() {
  const href = site.calendly || '#kontakt'

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-rule bg-paper/95 p-3 backdrop-blur-sm md:hidden">
      <div className="mx-auto flex max-w-lg gap-2">
        <a
          href={href}
          className="btn-fill flex flex-1 justify-center text-sm"
          {...(site.calendly ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {site.ctaSticky}
        </a>
        <a
          href="https://mintapartments.pl"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-soft flex flex-1 justify-center text-sm"
        >
          Mint live
        </a>
      </div>
    </div>
  )
}
