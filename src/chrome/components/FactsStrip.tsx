import { headlineFactsFor } from '../data/facts'
import { pick } from '../i18n/pick'
import { useLocale } from '../i18n/context'

/** A row of curated "stat tile" facts for a project, with evidence on hover. */
export function FactsStrip({ projectId }: { projectId: string }) {
  const { locale, t: c } = useLocale()
  const facts = headlineFactsFor(projectId)
  if (facts.length === 0) return null

  return (
    <ul className="grid grid-cols-3 gap-4">
      {facts.map((fact) => (
        <li
          key={fact.id}
          className="fact-tile"
          title={
            fact.evidence
              ? `${pick(fact.label, locale)} — ${c.work.factEvidenceLabel}: ${fact.evidence}`
              : pick(fact.label, locale)
          }
        >
          <p className="chrome-text fact-tile__value" style={{ fontSize: '1.05rem' }}>
            {fact.value}
          </p>
          <p className="eyebrow fact-tile__label">{pick(fact.short ?? fact.label, locale)}</p>
        </li>
      ))}
    </ul>
  )
}
