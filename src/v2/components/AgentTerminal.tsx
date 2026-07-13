import { useEffect, useState } from 'react'

const LINES = [
  '$ init operator.mb',
  '✓ direct booking — rezerwacje bez prowizji OTA',
  '✓ panel + integracje — KSeF · PMS · smart-lock',
  '✓ AI concierge 24/7 — z audytem każdego kroku',
  '→ szacowany odzysk: 8–15 h / mies.',
  '_ gotowy na Twój proces.',
]

export function AgentTerminal() {
  const [text, setText] = useState('')

  useEffect(() => {
    const full = LINES.join('\n')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setText(full)
      return
    }
    let i = 0
    let raf = 0
    let last = 0
    const speed = 22
    const step = (t: number) => {
      if (!last) last = t
      if (t - last >= speed) {
        i = Math.min(i + 1, full.length)
        setText(full.slice(0, i))
        last = t
      }
      if (i < full.length) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <pre className="v2-terminal max-h-[180px] overflow-hidden whitespace-pre-wrap">
      <span>{text}</span>
      <span className="v2-caret" aria-hidden />
    </pre>
  )
}
