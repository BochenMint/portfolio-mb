import { useState } from 'react'
import type { FormEvent } from 'react'
import { contactFields, leadForm, site } from '../data/content'
import { MagneticButton } from './MagneticButton'

const formEndpoint =
  import.meta.env.VITE_FORM_ENDPOINT || 'https://api.web3forms.com/submit'
const formAccessKey = import.meta.env.VITE_FORM_ACCESS_KEY || ''

function getFieldLabel(id: string) {
  return contactFields.find((field) => field.id === id)?.label ?? id
}

function formatPayload(payload: Record<string, string>) {
  return contactFields
    .map((field) => `${field.label}: ${payload[field.id] || '-'}`)
    .join('\n')
}

export function LeadForm() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const data = new FormData(e.currentTarget)
    const payload = Object.fromEntries(data.entries()) as Record<string, string>
    const formattedMessage = formatPayload(payload)

    if (formAccessKey) {
      setLoading(true)
      try {
        const res = await fetch(formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: formAccessKey,
            subject: `Portfolio — ${payload.company || payload.name || 'zapytanie'}`,
            from_name: payload.name,
            email: payload.email,
            message: formattedMessage,
            company: payload.company,
            project_type: payload.projectType,
            budget: payload.budget,
            timeline: payload.timeline,
          }),
        })
        const json = (await res.json()) as { success?: boolean; message?: string }
        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Nie udało się wysłać formularza.')
        }
        setSent(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Błąd wysyłki.')
      } finally {
        setLoading(false)
      }
      return
    }

    const subject = encodeURIComponent(`Portfolio — ${payload.company || payload.name || 'zapytanie'}`)
    const text = encodeURIComponent(
      Object.entries(payload)
        .map(([key, value]) => `${getFieldLabel(key)}: ${value}`)
        .join('\n'),
    )
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${text}`
    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-[1.8rem] border border-accent/30 bg-accent/5 p-8">
        <p className="font-mono text-[10px] tracking-[0.14em] text-accent uppercase">
          Wysłano
        </p>
        <p className="font-headline mt-3 text-xl">{leadForm.thanksTitle}</p>
        <p className="text-muted mt-2 text-sm leading-relaxed">
          {formAccessKey
            ? leadForm.thanksBody
            : `Jeśli klient maila się nie otworzył, napisz bezpośrednio na ${site.email}`}
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-[1.8rem] border border-[var(--color-paper)]/16 bg-[var(--color-surface)]/70 p-5 shadow-[0_30px_110px_rgba(0,0,0,0.28)] md:p-8"
    >
      <div>
        <p className="font-headline text-lg">{leadForm.title}</p>
        <p className="text-muted mt-2 text-sm leading-relaxed">{leadForm.intro}</p>
      </div>

      {contactFields.map((field) => (
        <label key={field.id} data-form-field className="block">
          <span className="font-mono mb-1.5 block text-[10px] tracking-[0.12em] text-[var(--color-paper)]/50 uppercase">
            {field.label}
          </span>
          {field.type === 'textarea' ? (
            <textarea
              name={field.id}
              required={field.required}
              rows={5}
              className="w-full resize-none rounded-2xl border border-[var(--color-paper)]/18 bg-[var(--color-ink)]/38 px-4 py-3 text-sm text-[var(--color-paper)] outline-none transition-colors placeholder:text-[var(--color-paper)]/25 focus:border-accent"
              placeholder={field.placeholder}
            />
          ) : field.type === 'select' ? (
            <select
              name={field.id}
              required={field.required}
              defaultValue=""
              className="w-full rounded-2xl border border-[var(--color-paper)]/18 bg-[var(--color-ink)] px-4 py-3 text-sm text-[var(--color-paper)] outline-none transition-colors focus:border-accent"
            >
              <option value="" disabled>
                Wybierz opcję
              </option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              name={field.id}
              required={field.required}
              className="w-full rounded-2xl border border-[var(--color-paper)]/18 bg-[var(--color-ink)]/38 px-4 py-3 text-sm text-[var(--color-paper)] outline-none transition-colors placeholder:text-[var(--color-paper)]/25 focus:border-accent"
              placeholder={field.placeholder}
            />
          )}
        </label>
      ))}

      {error ? (
        <p className="font-mono text-[11px] text-[var(--color-coral)]" role="alert">
          {error}
        </p>
      ) : null}

      <MagneticButton
        as="button"
        type="submit"
        disabled={loading}
        className={`btn-accent premium-cta w-full justify-center md:w-auto ${loading ? 'pointer-events-none opacity-70' : ''}`}
      >
        {loading ? leadForm.submitting : leadForm.submit}
      </MagneticButton>

      <p className="font-mono text-[10px] leading-relaxed text-[var(--color-paper)]/30">
        Bez spamu. Jeśli Web3Forms nie jest skonfigurowany, formularz otworzy gotowego maila.
      </p>

      {import.meta.env.DEV && !formAccessKey ? (
        <p className="font-mono text-[10px] text-[var(--color-paper)]/30">
          DEV: Ustaw VITE_FORM_ACCESS_KEY w .env, aby wysyłać przez Web3Forms.
        </p>
      ) : null}
    </form>
  )
}
