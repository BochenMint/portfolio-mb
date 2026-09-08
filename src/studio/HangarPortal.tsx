import { useEffect, useState } from 'react'
import { useStudioUi } from '../i18n'
import { HangarShipPreview } from './HangarShipPreview'
import { useTheme } from './useTheme'

export function HangarPortal({ variant = 'inline' }: { variant?: 'inline' | 'hero' }) {
  const { theme } = useTheme()
  const ui = useStudioUi()
  const [open, setOpen] = useState(false)
  const [warping, setWarping] = useState(false)
  const [prevTheme, setPrevTheme] = useState(theme)

  if (theme !== prevTheme) {
    setPrevTheme(theme)
    if (theme !== 'massive') {
      setOpen(false)
      setWarping(false)
    }
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey, true)
    document.documentElement.classList.add('studio-hangar-lock')
    return () => {
      window.removeEventListener('keydown', onKey, true)
      document.documentElement.classList.remove('studio-hangar-lock')
    }
  }, [open])

  const enter = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setOpen(true)
      return
    }
    setWarping(true)
    window.setTimeout(() => {
      setWarping(false)
      setOpen(true)
    }, 920)
  }

  if (theme !== 'massive') return null

  const isHero = variant === 'hero'

  return (
    <>
      <div className={`studio-cockpit-wrap${isHero ? ' studio-cockpit-wrap-hero' : ''}`}>
        <button
          type="button"
          className={`studio-cockpit${isHero ? ' studio-cockpit-hero' : ''}`}
          onClick={enter}
          aria-expanded={open}
          aria-controls="studio-hangar-stage"
        >
          {isHero ? (
            <span className="studio-hangar-ship-bay" aria-hidden>
              <HangarShipPreview loadingLabel={ui.hangarShipLoading} />
            </span>
          ) : null}
          <span className="studio-cockpit-chrome">
            <span className="studio-cockpit-beam" aria-hidden />
            <span className="studio-cockpit-copy">
              <span className="studio-cockpit-alert">{ui.hangarAlert}</span>
              <span className="studio-cockpit-title">{ui.hangarCta}</span>
              <span className="studio-cockpit-hint">{ui.hangarLead}</span>
            </span>
            <span className="studio-cockpit-action" aria-hidden>
              {ui.hangarConfirm}
            </span>
          </span>
        </button>
      </div>

      {warping ? (
        <div className="studio-warp" aria-hidden>
          <span className="studio-warp-core" />
        </div>
      ) : null}

      {open ? (
        <div id="studio-hangar-stage" className="studio-hangar-stage" role="dialog" aria-modal="true" aria-label={ui.hangarDialog}>
          <button type="button" className="studio-hangar-exit" onClick={() => setOpen(false)}>
            {ui.hangarExit}
          </button>
          <iframe title={ui.hangarIframe} src="/gra.html" className="studio-hangar-frame" />
        </div>
      ) : null}
    </>
  )
}
