import { useEffect, useRef } from 'react'

/**
 * Parses a metric string like "8–15 h", "10–15%", "300–600 zł"
 * Returns segments: alternating text/number pieces and whether each is a number.
 */
type Segment = { text: string; isNumber: boolean; value: number }

function parseSegments(raw: string): Segment[] {
  // Match integers (no decimals in our data)
  const regex = /(\d+)/g
  const segments: Segment[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: raw.slice(lastIndex, match.index), isNumber: false, value: 0 })
    }
    segments.push({ text: match[0], isNumber: true, value: parseInt(match[0], 10) })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < raw.length) {
    segments.push({ text: raw.slice(lastIndex), isNumber: false, value: 0 })
  }
  return segments
}

function renderSegments(segments: Segment[], progress: number): string {
  return segments
    .map((seg) => {
      if (!seg.isNumber) return seg.text
      return String(Math.round(seg.value * progress))
    })
    .join('')
}

/** Ease-out quad: t in [0,1] → eased value */
function easeOut(t: number): number {
  return 1 - (1 - t) * (1 - t)
}

const DURATION_MS = 1200

/**
 * Animates numbers inside a span from 0 to their final value when the element
 * enters the viewport. Respects prefers-reduced-motion.
 *
 * @param ref - ref to the <span> containing the metric text
 * @param rawValue - original metric string, e.g. "8–15 h"
 */
export function useCountUp(
  ref: React.RefObject<HTMLElement | null>,
  rawValue: string,
): void {
  const reduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)
  const hasRunRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const segments = parseSegments(rawValue)
    const hasNumbers = segments.some((s) => s.isNumber)

    // If no numbers or reduced motion, just set final text immediately
    if (!hasNumbers || reduced) {
      el.textContent = rawValue
      return
    }

    function tick(now: number) {
      if (!startRef.current) startRef.current = now
      const elapsed = now - startRef.current
      const t = Math.min(elapsed / DURATION_MS, 1)
      const eased = easeOut(t)

      el!.textContent = renderSegments(segments, eased)

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        el!.textContent = rawValue // ensure exact final text
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasRunRef.current) {
          hasRunRef.current = true
          observer.disconnect()
          startRef.current = null
          rafRef.current = requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
    // rawValue is stable (from static data), ref is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawValue])
}
