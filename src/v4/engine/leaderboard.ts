/**
 * Local-only leaderboard (`localStorage`, key `v4-leaderboard`) — top 10
 * fastest full-discovery runs, per spec section 4. No backend, no
 * cross-device sync ("Ranking lokalny — na tym urządzeniu.").
 */

export type LeaderboardEntry = {
  nick: string
  ms: number
  date: string
}

const STORAGE_KEY = 'v4-leaderboard'
const MAX_ENTRIES = 10

function isEntry(value: unknown): value is LeaderboardEntry {
  if (!value || typeof value !== 'object') return false
  const e = value as Record<string, unknown>
  return typeof e.nick === 'string' && typeof e.ms === 'number' && typeof e.date === 'string'
}

function readAll(): LeaderboardEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isEntry)
  } catch {
    // Corrupt JSON, storage disabled, or private-mode quota — treat as empty.
    return []
  }
}

/** Top entries, fastest (lowest ms) first. */
export function getLeaderboard(): LeaderboardEntry[] {
  return readAll().sort((a, b) => a.ms - b.ms)
}

/** Adds one entry, re-sorts, trims to the top 10, persists, and returns the
 * resulting list (so the caller can re-render immediately without a second
 * read). Nick is trimmed to 16 chars per spec ("Twój znak (max 16)"). */
export function saveLeaderboardEntry(nick: string, ms: number): LeaderboardEntry[] {
  const trimmedNick = nick.trim().slice(0, 16) || 'PILOT'
  const entries = readAll()
  entries.push({ nick: trimmedNick, ms, date: new Date().toISOString() })
  entries.sort((a, b) => a.ms - b.ms)
  const top = entries.slice(0, MAX_ENTRIES)
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(top))
  } catch {
    // Storage unavailable — the run's result just won't persist.
  }
  return top
}
