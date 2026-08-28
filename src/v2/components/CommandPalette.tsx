import { useEffect, useMemo, useRef, useState } from 'react'
import { homePath, useLocale } from '../../i18n'
import { getArchiveUi } from '../../i18n/archive-ui'
import { site } from '../../i18n/live'

type Cmd = { id: string; label: string; hint?: string; run: () => void }

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { locale } = useLocale()
  const ui = getArchiveUi(locale)
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const cmds: Cmd[] = useMemo(() => {
    const jump = (hash: string) => () => {
      onClose()
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    }
    return ui.v2Cmds.map((item) => {
      if (item.id === 'audit') {
        return {
          ...item,
          hint: site.calendly ? 'calendly' : item.hint,
          run: () => {
            onClose()
            if (site.calendly) window.open(site.calendly, '_blank')
            else document.querySelector('#console')?.scrollIntoView({ behavior: 'smooth' })
          },
        }
      }
      if (item.id === 'mail') {
        return { ...item, hint: site.email, run: () => { window.location.href = `mailto:${site.email}` } }
      }
      if (item.id === 'gh') {
        return { ...item, run: () => window.open(site.github, '_blank') }
      }
      if (item.id === 'v1') {
        return { ...item, run: () => { window.location.href = homePath(locale) } }
      }
      const hash =
        item.id === 'cap' ? '#capabilities' :
        item.id === 'dep' ? '#deployments' :
        item.id === 'pipe' ? '#pipeline' :
        item.id === 'proof' ? '#proof' :
        '#console'
      return { ...item, run: jump(hash) }
    })
  }, [onClose, ui, locale])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return s ? cmds.filter((c) => (c.label + ' ' + (c.hint || '')).toLowerCase().includes(s)) : cmds
  }, [q, cmds])

  useEffect(() => {
    if (open) {
      setQ('')
      setActive(0)
      const t = setTimeout(() => inputRef.current?.focus(), 20)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => setActive(0), [q])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)) }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
      else if (e.key === 'Enter') { e.preventDefault(); filtered[active]?.run() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, filtered, active, onClose])

  if (!open) return null

  return (
    <div className="v2-cmdk-backdrop flex justify-center pt-[14vh]" onClick={onClose}>
      <div className="v2-cmdk" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Paleta poleceń">
        <div className="flex items-center gap-3 border-b border-[var(--v2-line)] px-4 py-3">
          <span className="text-accent" aria-hidden>⌘</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Szukaj sekcji lub akcji…"
            className="v2-mono w-full bg-transparent text-sm text-[var(--color-paper)] outline-none placeholder:text-[var(--color-ink-muted)]"
          />
          <span className="v2-kbd">esc</span>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto py-2">
          {filtered.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                data-active={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={c.run}
                className="v2-cmdk-item flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-2.5 text-left"
              >
                <span className="text-sm text-[var(--color-paper)]/90">{c.label}</span>
                {c.hint ? <span className="v2-mono text-[11px] text-[var(--color-ink-muted)]">{c.hint}</span> : null}
              </button>
            </li>
          ))}
          {filtered.length === 0 ? (
            <li className="v2-mono px-4 py-3 text-xs text-[var(--color-ink-muted)]">Brak wyników</li>
          ) : null}
        </ul>
      </div>
    </div>
  )
}
