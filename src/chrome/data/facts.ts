import type { Bag } from '../i18n/pick'
export type Fact = {
  id: string
  value: string
  label: Bag
  /** Curated ≤2-word label for tight stat-tile layouts; falls back to `label`. */
  short?: Bag
  evidence: string
}

type RawFact = {
  id?: string
  value?: string | number
  label?: { pl?: string; en?: string; uk?: string }
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
  plumm: ['xsd-validated-formats', 'test-cases', 'api-routes'],
}

/**
 * ≤2-word short labels for every headline fact, keyed by fact id — keeps
 * stat tiles from wrapping to 3 lines of uppercase mono text. Falls back to
 * the full `label` when a fact id has no entry here.
 */
const shortLabelsById: Record<string, { pl: string; en: string }> = {
  locales: { pl: 'języków', en: 'locales' },
  'blog-posts': { pl: 'wpisów bloga', en: 'blog posts' },
  tests: { pl: 'plików testów', en: 'test files' },
  'mdx-articles': { pl: 'artykułów MDX', en: 'MDX articles' },
  brands: { pl: 'marek aut', en: 'car brands' },
  'published-tests': { pl: 'testów aut', en: 'car tests' },
  agents: { pl: 'agentów', en: 'agents' },
  'agent-tools': { pl: 'narzędzi', en: 'tools' },
  'api-endpoints': { pl: 'endpointów API', en: 'API endpoints' },
  'xsd-validated-formats': { pl: 'silników XSD', en: 'XSD engines' },
  'test-cases': { pl: 'scenariuszy testowych', en: 'test scenarios' },
  'api-routes': { pl: 'endpointów API', en: 'API endpoints' },
}

/** The curated headline facts for a project, in `headlineFactIds` order. */
export function headlineFactsFor(projectId: string): Fact[] {
  const ids = headlineFactIds[projectId] ?? []
  const all = factsFor(projectId)
  return ids
    .map((id) => all.find((f) => f.id === id))
    .filter((f): f is Fact => Boolean(f))
    .map((f) => (shortLabelsById[f.id] ? { ...f, short: shortLabelsById[f.id] } : f))
}
