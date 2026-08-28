import { useStudioUi } from '../i18n'
import { themes, type ThemeGroup } from './themes'
import { useTheme } from './ThemeContext'

const GROUP_IDS: ThemeGroup[] = ['now', 'signature', 'archive']

export function StyleSelector() {
  const { theme, setTheme } = useTheme()
  const ui = useStudioUi()
  const current = themes.find((t) => t.id === theme)!
  const groups = GROUP_IDS.map((id) => ({ id, label: ui.styleGroups[id] }))

  return (
    <details className="studio-nav-style">
      <summary aria-label={ui.styleLabel}>
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
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={theme === item.id}
                    className="studio-nav-style-option"
                    data-active={theme === item.id}
                    title={note}
                    onClick={() => setTheme(item.id)}
                  >
                    {ui.themeLabels[item.id] ?? item.label}
                  </button>
                )
              })}
          </div>
        ))}
      </div>
    </details>
  )
}
