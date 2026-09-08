import { useEffect, useRef } from 'react'
import { useStudioUi } from '../i18n'
import { themes, type ThemeGroup, type ThemeId } from './themes'
import { useTheme } from './useTheme'

const GROUP_IDS: ThemeGroup[] = ['now', 'signature', 'archive']

export function StyleSelector() {
  const { theme, setTheme } = useTheme()
  const ui = useStudioUi()
  const current = themes.find((t) => t.id === theme)!
  const groups = GROUP_IDS.map((id) => ({ id, label: ui.styleGroups[id] }))
  const detailsRef = useRef<HTMLDetailsElement>(null)

  const close = () => {
    const el = detailsRef.current
    if (el?.open) el.open = false
  }

  const onSelect = (id: ThemeId) => {
    setTheme(id)
    close()
  }

  useEffect(() => {
    const el = detailsRef.current
    if (!el) return

    const onPointerDown = (e: PointerEvent) => {
      if (!el.open) return
      if (el.contains(e.target as Node)) return
      close()
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !el.open) return
      close()
      el.querySelector('summary')?.focus()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <details ref={detailsRef} className="studio-nav-style">
      <summary aria-label={`${ui.styleLabel}: ${ui.themeLabels[current.id] ?? current.label}`}>
        <span className="studio-nav-style-label">{ui.themeLabels[current.id] ?? current.label}</span>
        <span className="studio-nav-style-caret" aria-hidden />
      </summary>
      <div className="studio-nav-style-menu" role="listbox" aria-label={ui.styleLabel}>
        {groups.map((group) => (
          <div key={group.id} className="studio-nav-style-group">
            <p className="studio-nav-style-group-label">{group.label}</p>
            {themes
              .filter((t) => t.group === group.id)
              .map((item) => {
                const note = ui.themeNotes[item.id]?.note ?? item.note
                const noteId = `studio-style-note-${item.id}`
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={theme === item.id}
                    aria-describedby={noteId}
                    className="studio-nav-style-option"
                    data-active={theme === item.id}
                    onClick={() => onSelect(item.id)}
                  >
                    <span className="studio-nav-style-option-label">
                      {ui.themeLabels[item.id] ?? item.label}
                    </span>
                    <span id={noteId} className="studio-nav-style-option-note">
                      {note}
                    </span>
                  </button>
                )
              })}
          </div>
        ))}
      </div>
    </details>
  )
}
