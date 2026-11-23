import { useLocale } from '../i18n/context'

export function WorkCategories({ current }: { current: 'systems' | 'apps' }) {
  const { t } = useLocale()
  const items = [
    { id: 'systems' as const, href: '#realizacje', label: t.apps.categorySystems },
    { id: 'apps' as const, href: '#aplikacje', label: t.apps.categoryMobile },
  ]

  return (
    <div data-reveal className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-6">
      <p className="eyebrow">{t.apps.categoryKicker}</p>
      <nav aria-label={t.apps.categoriesLabel} className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
        {items.map((item) => {
          const on = item.id === current
          return (
            <a
              key={item.id}
              href={item.href}
              aria-current={on ? 'location' : undefined}
              className={`border-b pb-1 text-sm font-medium tracking-[-0.01em] ${
                on ? 'border-white text-white' : 'border-transparent text-muted hover:text-white'
              }`}
            >
              {item.label}
            </a>
          )
        })}
      </nav>
    </div>
  )
}
