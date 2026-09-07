import { headlineFactsFor } from '../../data/facts'
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
          title={fact.evidence ? `${c.work.factEvidenceLabel}: ${fact.evidence}` : undefined}
        >
          <p className="chrome-text fact-tile__value">{fact.value}</p>
          <p className="eyebrow fact-tile__label">{fact.label[locale]}</p>
        </li>
      ))}
    </ul>
  )
}
