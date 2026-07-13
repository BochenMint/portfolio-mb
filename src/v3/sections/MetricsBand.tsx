import { useRef } from 'react'
import { results, resultsDisclaimer } from '../../data/content'
import { useCountUp } from '../useCountUp'

function MetricValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useCountUp(ref, value)

  return (
    <span ref={ref} className="v3-metric text-3xl md:text-4xl leading-none">
      {value}
    </span>
  )
}

export function MetricsBand() {
  return (
    <div className="border-b border-[var(--v3-line)]">
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {results.map((metric, i) => (
            <div
              key={metric.label}
              className={[
                'flex flex-col gap-1 px-4 py-4 md:py-6',
                i !== 0 ? 'border-l border-[var(--v3-line)] md:border-l md:border-[var(--v3-line)]' : '',
                // on mobile hide the border between col 2 and col 3 (they're on separate rows)
                i === 2 ? 'border-t border-[var(--v3-line)] md:border-t-0' : '',
                i === 3 ? 'border-t border-[var(--v3-line)] md:border-t-0' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <MetricValue value={metric.value} />
              <span className="text-muted text-[11px] leading-snug max-w-[160px]">{metric.label}</span>
            </div>
          ))}
        </div>
        <p className="v3-mono text-[10px] text-muted/60 mt-4 px-4 leading-relaxed">
          {resultsDisclaimer}
        </p>
      </div>
    </div>
  )
}
