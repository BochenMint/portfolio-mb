import type { MobileApp, StoreId } from '../data/mobileApps'
import { useLocale } from '../i18n/context'
import { Arrow, LinkButton, SectionHeader } from './primitives'
import { WorkCategories } from './WorkCategories'

const storeLabelKey: Record<StoreId, 'storeAppStore' | 'storePlay'> = {
  'app-store': 'storeAppStore',
  play: 'storePlay',
}

function AppStory({ app }: { app: MobileApp }) {
  const { t: c } = useLocale()
  const story = [
    { label: c.cases.labels.pain, text: app.pain },
    { label: c.cases.labels.approach, text: app.approach },
    { label: c.cases.labels.result, text: app.result },
  ]

  return (
    <article data-card className="py-16 first:pt-0 last:pb-0">
      <ul
        className="app-shots flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-1 lg:justify-center"
        tabIndex={0}
        aria-label={c.apps.shotsLabel(app.title)}
      >
        {app.shots.map((shot) => (
          <li key={shot.src} className="snap-start shrink-0">
            <img
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              loading="lazy"
              decoding="async"
              className="app-shot h-[min(68vh,34rem)] w-auto border border-line"
            />
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p className="eyebrow">{c.apps.platforms}</p>
          <h3 className="chrome-text-soft mt-3 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{app.title}</h3>
          <p className="mt-2 max-w-md text-sm text-silver-2 md:text-base">{app.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {app.stores.map((store) => {
              const label = c.apps[storeLabelKey[store.id]]
              return (
                <LinkButton
                  key={store.id}
                  href={store.href}
                  external
                  size="sm"
                  magnetic={false}
                  aria-label={`${label} · ${app.title}`}
                >
                  {label}
                  <Arrow />
                </LinkButton>
              )
            })}
          </div>
        </div>

        <dl className="flex flex-col gap-4 border-t border-line pt-6 lg:col-span-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          {story.map((item) => (
            <div key={item.label}>
              <dt className="eyebrow">{item.label}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-silver">{item.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  )
}

export function MobileApps() {
  const { t: c, content } = useLocale()

  return (
    <section id="aplikacje" className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <WorkCategories current="apps" />
        <SectionHeader eyebrow={c.apps.eyebrow} title={c.apps.title} lead={c.apps.lead} />

        <div className="mt-14 divide-y divide-line">
          {content.mobileApps.map((app) => (
            <AppStory key={app.id} app={app} />
          ))}
        </div>

        <div data-reveal className="mt-14">
          <LinkButton href="#kontakt" size="sm">
            {c.apps.cta}
            <Arrow />
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
