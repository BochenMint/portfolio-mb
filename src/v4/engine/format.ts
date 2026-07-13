/**
 * Small formatting helpers shared by the HUD, the crew comm panel, and the
 * game-over / completion overlays — kept in one place so the mission-clock
 * format (MM:SS.d) and leaderboard date format stay identical everywhere
 * they're rendered.
 */

/** `MM:SS.d` — tenths of a second, not hundredths, to match the spec's HUD
 * format exactly (`CZAS MISJI MM:SS.d`). */
export function formatMissionTime(ms: number): string {
  const safeMs = Math.max(0, ms)
  const totalTenths = Math.floor(safeMs / 100)
  const tenths = totalTenths % 10
  const totalSeconds = Math.floor(totalTenths / 10)
  const seconds = totalSeconds % 60
  const minutes = Math.floor(totalSeconds / 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`
}

/** `DD.MM` for the local leaderboard table. */
export function formatShortDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '--.--'
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`
}

/** Trims a longer project description down to its first N sentences for the
 * compact discovery panel — splits on sentence-ending punctuation, which
 * works fine for the Polish copy in src/data/content.ts (no abbreviation
 * edge cases in that copy). Falls back to the full trimmed string if no
 * sentence boundary is found. */
export function trimToSentences(text: string, maxSentences: number): string {
  const sentences = text.match(/[^.!?]+[.!?]+(\s+|$)/g)
  if (!sentences || sentences.length === 0) return text.trim()
  return sentences.slice(0, maxSentences).join('').trim()
}

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

/** User-supplied leaderboard nicks are persisted to localStorage and later
 * rendered via innerHTML (for the comm-panel mini board / leaderboard
 * table) — escape them so a nick can't inject markup. */
export function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch] ?? ch)
}
