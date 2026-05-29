import { site } from '../data/content'

type Props = {
  className?: string
  sizes?: string
  priority?: boolean
  rounded?: 'soft' | 'full'
}

const BASE = '/images/marcin-bochenek'

export function Portrait({
  className = '',
  sizes = '(min-width: 768px)  min(42vw, 420px), 72vw',
  priority = false,
  rounded = 'soft',
}: Props) {
  const radius =
    rounded === 'full' ? 'rounded-full' : 'rounded-2xl md:rounded-3xl'

  return (
    <picture className={`block overflow-hidden ${radius} ${className}`}>
      <source
        type="image/webp"
        srcSet={`${BASE}-400w.webp 400w, ${BASE}-800w.webp 800w, ${BASE}.webp ${site.photoWidth}w`}
        sizes={sizes}
      />
      <img
        src={`${BASE}.webp`}
        alt={site.photoAlt}
        width={site.photoWidth}
        height={site.photoHeight}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className="h-full w-full object-cover object-[center_18%]"
      />
    </picture>
  )
}
