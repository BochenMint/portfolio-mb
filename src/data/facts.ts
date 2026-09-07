export type Fact = {
  id: string
  value: string
  label: { pl: string; en: string }
  evidence: string
}

type RawFact = {
  id?: string
  value?: string | number
  label?: { pl?: string; en?: string }
  evidence?: string
}

type RawFactsFile = { facts?: RawFact[] } | RawFact[]

// Eager glob keeps this working even when a project's facts file doesn't
// exist yet (e.g. plumm.json) — the map simply won't have that key.
const modules = import.meta.glob<{ default: RawFactsFile }>('./facts/*.json', { eager: true })

const registry: Record<string, Fact[]> = {}

for (const path in modules) {
  const match = /\/([a-z0-9-]+)\.json$/i.exec(path)
  if (!match) continue
  const projectId = match[1]
  const mod = modules[path]?.default
  const rawFacts = Array.isArray(mod) ? mod : mod?.facts ?? []

  registry[projectId] = rawFacts
    .filter((f): f is Required<Pick<RawFact, 'id' | 'value' | 'label'>> & RawFact =>
      Boolean(f && f.id && f.value != null && f.label?.pl && f.label?.en),
    )
    .map((f) => ({
      id: f.id!,
      value: String(f.value),
      label: { pl: f.label!.pl!, en: f.label!.en! },
      evidence: f.evidence ?? '',
    }))
}

/** All normalized facts for a project id (empty array if none exist). */
export function factsFor(projectId: string): Fact[] {
  return registry[projectId] ?? []
}

/**
 * The 3 most impressive, independently-verifiable facts per project,
 * curated by hand from each facts/*.json file — prefers concrete counts
 * (locales, tests, endpoints, articles, agents, tools) over soft or
 * "confirmed"-only claims.
 */
export const headlineFactIds: Record<string, string[]> = {
  mint: ['locales', 'blog-posts', 'tests'],
  idrive: ['mdx-articles', 'brands', 'published-tests'],
  agentic: ['agents', 'agent-tools', 'api-endpoints'],
  plumm: [],
}

/** The curated headline facts for a project, in `headlineFactIds` order. */
export function headlineFactsFor(projectId: string): Fact[] {
  const ids = headlineFactIds[projectId] ?? []
  const all = factsFor(projectId)
  return ids
    .map((id) => all.find((f) => f.id === id))
    .filter((f): f is Fact => Boolean(f))
}
