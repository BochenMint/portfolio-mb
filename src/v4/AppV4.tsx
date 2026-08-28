import { useState } from 'react'
import { ArchiveLang } from '../i18n'
import { GameShell } from './GameShell'
import { FallbackScreen } from './FallbackScreen'

function detectCanRunGame(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    return !!gl
  } catch {
    return false
  }
}

export function AppV4() {
  const [canRunGame] = useState(detectCanRunGame)
  return (
    <>
      <div className="v4-lang-slot">
        <ArchiveLang />
      </div>
      {canRunGame ? <GameShell /> : <FallbackScreen />}
    </>
  )
}
