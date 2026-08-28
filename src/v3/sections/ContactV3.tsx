import { useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'
import '../intake.css'
import { site, sections, intakeSteps, intakeCopy, type IntakeField } from '../../i18n/live'
import { useLocale } from '../../i18n'
import { getArchiveUi } from '../../i18n/archive-ui'

type IntakeState = Record<string, string>
type SubmitStatus = 'idle' | 'submitting' | 'error'

const TOTAL_STEPS = intakeSteps.length

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const formEndpoint = import.meta.env.VITE_FORM_ENDPOINT || 'https://api.web3forms.com/submit'

function normalizeFormAccessKey(raw: string | undefined): string {
  const key = (raw || '').trim()
  if (!key) return ''
  if (/^your-web3forms-access-key$/i.test(key)) return ''
  return key
}

function isFieldEmpty(value: string | undefined) {
  return !value || value.trim().length === 0
}

function validateStep(stepIndex: number, values: IntakeState): Record<string, string> {
  const errors: Record<string, string> = {}
  const step = intakeSteps[stepIndex]

  for (const field of step.fields) {
    if (!field.required) continue
    const value = values[field.id]

    if (isFieldEmpty(value)) {
      errors[field.id] = 'To pole jest wymagane.'
      continue
    }

    if (field.type === 'email' && !EMAIL_RE.test(value.trim())) {
      errors[field.id] = 'Podaj poprawny adres e-mail.'
    }
  }

  return errors
}

function buildPayload(values: IntakeState) {
  return {
    source: 'portfolio-mb/v3',
    company: {
      name: values.companyName ?? '',
      industry: values.industry ?? '',
      teamSize: values.teamSize ?? '',
    },
    project: {
      type: values.projectType ?? '',
      pain: values.pain ?? '',
      currentTools: values.currentTools ?? '',
      successMetric: values.successMetric ?? '',
      budget: values.budget ?? '',
      timeline: values.timeline ?? '',
    },
    contact: {
      name: values.name ?? '',
      email: values.email ?? '',
      phone: values.phone ?? '',
    },
  }
}

function buildSummary(values: IntakeState): string {
  const lines: string[] = []
  for (const step of intakeSteps) {
    for (const field of step.fields) {
      const value = values[field.id]
      if (isFieldEmpty(value)) continue
      lines.push(`${field.label}: ${value}`)
    }
  }
  return lines.join('\n')
}

function buildMessageBody(values: IntakeState): string {
  const payload = buildPayload(values)
  const summary = buildSummary(values)
  return `${summary}\n\n---BRIEF_JSON---\n${JSON.stringify(payload, null, 2)}\n---END_BRIEF_JSON---`
}

/** Radio-card grid used for select-type fields (industry, budget, timeline, ...). */
function OptionGrid({
  field,
  value,
  onChange,
}: {
  field: IntakeField
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="v3-intake-options" role="radiogroup" aria-label={field.label}>
      {field.options?.map((opt) => (
        <button
          key={opt}
          type="button"
          role="radio"
          aria-checked={value === opt}
          data-selected={value === opt}
          className="v3-intake-option"
          onClick={() => onChange(opt)}
        >
          <span className="v3-intake-option-dot" aria-hidden />
          <span>{opt}</span>
        </button>
      ))}
    </div>
  )
}

function IntakeFieldControl({
  field,
  value,
  error,
  onChange,
}: {
  field: IntakeField
  value: string
  error?: string
  onChange: (value: string) => void
}) {
  return (
    <div className={`v3-intake-field ${error ? 'v3-intake-field-error' : ''}`}>
      <label htmlFor={field.id} className="v3-label">
        {field.label}
        {field.required && (
          <span className="text-accent ml-1" aria-hidden>
            *
          </span>
        )}
      </label>

      {field.type === 'select' ? (
        <OptionGrid field={field} value={value} onChange={onChange} />
      ) : field.type === 'textarea' ? (
        <textarea
          id={field.id}
          name={field.id}
          rows={5}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="v3-intake-textarea"
        />
      ) : (
        <input
          id={field.id}
          name={field.id}
          type={field.type}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="v3-intake-input"
        />
      )}

      {error && <p className="v3-intake-error-text">{error}</p>}
      {field.hint && !error && <p className="v3-intake-step-hint !mt-0">{field.hint}</p>}
    </div>
  )
}

export function ContactV3() {
  const { locale } = useLocale()
  const ui = getArchiveUi(locale)
  const [values, setValues] = useState<IntakeState>({})
  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const ctaHref = site.calendly || '#kontakt'
  const step = intakeSteps[stepIndex]
  const isLastStep = stepIndex === TOTAL_STEPS - 1
  const progressPct = useMemo(() => ((stepIndex + 1) / TOTAL_STEPS) * 100, [stepIndex])

  function handleChange(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }))
    setErrors((prev) => {
      if (!prev[id]) return prev
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  function goNext() {
    const stepErrors = validateStep(stepIndex, values)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }
    setErrors({})

    if (isLastStep) {
      void submitBrief()
      return
    }

    setDirection('forward')
    setStepIndex((i) => Math.min(i + 1, TOTAL_STEPS - 1))
  }

  function goBack() {
    if (stepIndex === 0) return
    setErrors({})
    setDirection('back')
    setStepIndex((i) => Math.max(i - 1, 0))
  }

  async function submitBrief() {
    setStatus('submitting')

    const accessKey = normalizeFormAccessKey(import.meta.env.VITE_FORM_ACCESS_KEY)
    const subject = `[BRIEF] ${values.companyName ?? 'Brief'} · ${values.projectType ?? ''}`
    const message = buildMessageBody(values)

    if (accessKey) {
      try {
        const res = await fetch(formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: accessKey,
            subject,
            from_name: values.name ?? '',
            replyto: values.email ?? '',
            botcheck: '',
            message,
          }),
        })

        const data = await res.json().catch(() => null)
        if (!res.ok || !data?.success) {
          throw new Error('web3forms submission failed')
        }

        setStatus('idle')
        setSent(true)
      } catch {
        setStatus('error')
      }
      return
    }

    // Fallback: mailto with the same subject + body
    const mailto = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
    window.location.href = mailto
    setStatus('idle')
    setSent(true)
  }

  function handleFormKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    if (e.key !== 'Enter') return
    const target = e.target as HTMLElement
    if (target.tagName === 'TEXTAREA') return
    e.preventDefault()
    goNext()
  }

  function resetWizard() {
    setValues({})
    setErrors({})
    setStepIndex(0)
    setDirection('forward')
    setSent(false)
    setStatus('idle')
  }

  const mailtoFallback = `mailto:${site.email}?subject=${encodeURIComponent(
    `[BRIEF] ${values.companyName ?? 'Brief'} · ${values.projectType ?? ''}`
  )}&body=${encodeURIComponent(buildMessageBody(values))}`

  return (
    <section id="kontakt" className="mx-auto max-w-6xl px-5 py-24 md:py-32 md:px-8">
      {/* Section header */}
      <div className="mb-16">
        <p className="v3-label mb-4">
          {sections.contact.num} / {sections.contact.title}
        </p>
        <h2 className="v3-display text-[clamp(2rem,5vw,3.5rem)] text-balance mb-5">
          {ui.v3ContactTitleBefore}
          <em className="v3-serif-accent">{ui.v3ContactTitleEm}</em>
        </h2>
        <p className="text-muted max-w-2xl text-base leading-relaxed">
          {sections.contact.lead}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        {/* Left: contact info */}
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-muted text-sm mb-2 leading-relaxed">{ui.v3ContactAside}</p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={`mailto:${site.email}`}
              className="font-grotesk text-xl text-accent hover:opacity-70 transition-opacity break-all"
            >
              {site.email}
            </a>
            <p className="v3-mono text-[11px] text-muted">
              {site.responseTime} · {site.location}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="v3-mono text-[11px] text-muted hover:text-accent transition-colors inline-flex items-center gap-1"
            >
              GitHub ↗
            </a>
          </div>

          <div>
            <a
              href={ctaHref}
              {...(site.calendly ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="btn-accent inline-flex items-center gap-2"
            >
              {site.ctaPrimary}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        {/* Right: discovery wizard */}
        <div className="v3-card v3-intake-card p-7">
          {sent ? (
            <div className="v3-intake-thanks">
              <h3 className="font-grotesk font-semibold text-[var(--color-paper)] text-xl">
                {intakeCopy.thanksTitle}
              </h3>
              <p className="text-muted text-sm leading-relaxed">{intakeCopy.thanksBody}</p>

              <div className="v3-intake-timeline">
                <div className="v3-intake-timeline-item">
                  <span className="v3-intake-timeline-num">1</span>
                  <span>{ui.v3Thanks1}</span>
                </div>
                <div className="v3-intake-timeline-item">
                  <span className="v3-intake-timeline-num">2</span>
                  <span>{ui.v3Thanks2}</span>
                </div>
                <div className="v3-intake-timeline-item">
                  <span className="v3-intake-timeline-num">3</span>
                  <span>{ui.v3Thanks3}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-col items-center gap-3">
                <a
                  href={ctaHref}
                  className="btn-accent justify-center"
                  {...(site.calendly ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {site.ctaPrimary}
                  <span aria-hidden>→</span>
                </a>
                <button type="button" onClick={resetWizard} className="btn-soft">
                  Wyślij kolejny brief
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="v3-intake-progress-head">
                <h3 className="font-grotesk font-semibold text-[var(--color-paper)] text-base">
                  {intakeCopy.title}
                </h3>
                <span className="v3-mono text-[11px] text-muted">
                  {String(stepIndex + 1).padStart(2, '0')} / {String(TOTAL_STEPS).padStart(2, '0')}
                </span>
              </div>

              <div className="v3-intake-progress-track">
                <div className="v3-intake-progress-fill" style={{ width: `${progressPct}%` }} />
              </div>

              <form
                className="flex flex-col flex-1"
                noValidate
                onKeyDown={handleFormKeyDown}
                onSubmit={(e) => e.preventDefault()}
              >
                <div key={step.id} data-dir={direction} className="v3-intake-step">
                  <div>
                    <p className="v3-intake-step-title">{step.title}</p>
                    {step.hint && <p className="v3-intake-step-hint">{step.hint}</p>}
                  </div>

                  {step.fields.map((field) => (
                    <IntakeFieldControl
                      key={field.id}
                      field={field}
                      value={values[field.id] ?? ''}
                      error={errors[field.id]}
                      onChange={(v) => handleChange(field.id, v)}
                    />
                  ))}
                </div>

                {status === 'error' && (
                  <p className="v3-intake-submit-error mt-4">
                    Coś poszło nie tak przy wysyłce.{' '}
                    <a href={mailtoFallback} className="text-accent underline">
                      Napisz bezpośrednio na {site.email}
                    </a>
                    .
                  </p>
                )}

                <div className="v3-intake-nav">
                  {stepIndex > 0 ? (
                    <button type="button" onClick={goBack} className="btn-soft">
                      {intakeCopy.back}
                    </button>
                  ) : (
                    <span />
                  )}

                  <button
                    type="button"
                    onClick={goNext}
                    disabled={status === 'submitting'}
                    className="btn-accent justify-center disabled:opacity-60"
                  >
                    {isLastStep
                      ? status === 'submitting'
                        ? intakeCopy.submitting
                        : intakeCopy.submit
                      : intakeCopy.next}
                    {!isLastStep && <span aria-hidden>→</span>}
                  </button>
                </div>

                {isLastStep && (
                  <p className="v3-intake-consent">
                    Wysyłając brief zgadzasz się na kontakt w sprawie wyceny. Żadnego newslettera.
                  </p>
                )}
              </form>
            </>
          )}

          <p className="v3-mono mt-6 text-[10px] leading-relaxed text-muted">
            Dane z formularza służą wyłącznie do odpowiedzi na Twoje zapytanie — nie sprzedaję list
            mailingowych ani nie przekazuję danych podmiotom trzecim.
          </p>
        </div>
      </div>
    </section>
  )
}
