import { site } from '../../chrome/data/content'

export function Footer() {
  return (
    <footer style={{ background: 'var(--moss-950)' }} className="px-5 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="hairline" />
        <div className="flex flex-col gap-3 pt-6 font-mono text-[11px] tracking-[0.05em] text-[var(--cream-dim)] md:flex-row md:items-center md:justify-between md:text-xs">
          <p>© 2026 Marcin Bochenek</p>
          <div className="flex items-center gap-5">
            <a href={`mailto:${site.email}`} className="transition-colors hover:text-[var(--cream)]">
              {site.email}
            </a>
            <a
              href="https://marcinbochenek.com/"
              className="transition-colors hover:text-[var(--cream)]"
            >
              marcinbochenek.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
