import { useEffect, useMemo, useState } from 'react'
import { useLocale } from '../../i18n'
import { getArchiveUi } from '../../i18n/archive-ui'

export function AgentTerminal() {
  const { locale } = useLocale()
  const lines = getArchiveUi(locale).v2Terminal
  const full = useMemo(() => lines.join('\n'), [lines])
  const reduce = useMemo(
    () =>
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false,
    [],
  )
  const [animatedText, setAnimatedText] = useState('')

  useEffect(() => {
    if (reduce) return
    let i = 0
    let raf = 0
    let last = 0
    const speed = 22
    const step = (t: number) => {
      if (!last) last = t
      if (t - last >= speed) {
        i = Math.min(i + 1, full.length)
        setAnimatedText(full.slice(0, i))
        last = t
      }
      if (i < full.length) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [full, reduce])

  const text = reduce ? full : animatedText

  return (
    <pre className="v2-terminal max-h-[180px] overflow-hidden whitespace-pre-wrap">
      <span>{text}</span>
      <span className="v2-caret" aria-hidden />
    </pre>
  )
}
