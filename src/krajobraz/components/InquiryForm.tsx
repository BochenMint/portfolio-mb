import { useState } from 'react'
import type { FormEvent } from 'react'
import { site } from '../../chrome/data/content'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

type Field = {
  id: string
  label: string
  type: 'text' | 'email' | 'textarea'
  required?: boolean
  placeholder?: string
}

const fields: Field[] = [
  { id: 'name', label: 'Imię', type: 'text', required: true },
  { id: 'email', label: 'E-mail', type: 'email', required: true },
  { id: 'company', label: 'Pracownia / firma', type: 'text' },
  { id: 'website', label: 'Obecna strona (jeśli jest)', type: 'text', placeholder: 'np. twojapracownia.pl' },
  {
    id: 'message',
    label: 'Czego potrzebujesz?',
    type: 'textarea',
    placeholder: 'Kilka zdań: czym się zajmujecie i co ma robić nowa strona.',
  },
]

const formEndpoint = import.meta.env.VITE_FORM_ENDPOINT || ''
const formAccessKey = import.meta.env.VITE_FORM_ACCESS_KEY || ''

function isWeb3Forms(endpoint: string) {
  return endpoint.includes('web3forms.com')
}

/** No usable AJAX endpoint — missing entirely, or Web3Forms without an access key. */
function needsMailtoFallback(endpoint: string, accessKey: string) {
  return !endpoint || (isWeb3Forms(endpoint) && !accessKey)
}

export function InquiryForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [usedMailto, setUsedMailto] = useState(false)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage('')

    const data = new FormData(e.currentTarget)
    const body = Object.fromEntries(data.entries()) as Record<string, string>

    if (needsMailtoFallback(formEndpoint, formAccessKey)) {
      const subject = `Strona dla pracowni krajobrazu — ${body.company || body.name || 'zapytanie'}`
      const lines = fields.map((field) => `${field.label}: ${body[field.id] || '-'}`)
      const mailto = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
      window.location.href = mailto
      setUsedMailto(true)
      setStatus('success')
      e.currentTarget.reset()
      return
    }

    setStatus('loading')

    const payload: Record<string, string> = {
      subject: `Strona dla pracowni krajobrazu — ${body.company || body.name || 'zapytanie'}`,
      from_name: body.name || 'Zapytanie z /krajobraz',
      ...body,
    }

    if (isWeb3Forms(formEndpoint)) {
      payload.access_key = formAccessKey
    }

    try {
      const res = await fetch(formEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { message?: string }).message || `HTTP ${res.status}`)
      }

      setUsedMailto(false)
      setStatus('success')
      e.currentTarget.reset()
    } catch (err) {
      setStatus('error')
      setErrorMessage(
        err instanceof Error ? err.message : `Nie udało się wysłać. Napisz proszę bezpośrednio na ${site.email}.`,
      )
    }
  }

  if (status === 'success') {
    return (
      <div
        aria-live="polite"
        style={{ background: 'var(--moss-900)', borderColor: 'rgba(244, 237, 220, 0.14)' }}
        className="rounded-2xl border p-8 text-center md:p-10"
      >
        <p className="font-display text-xl font-semibold text-[var(--cream)]">Dziękuję!</p>
        <p className="mt-2 text-sm text-[var(--cream-dim)]">
          {usedMailto
            ? `Otworzyłem Twój program pocztowy — wyślij wiadomość na ${site.email}.`
            : `Odezwę się — ${site.responseTime.toLowerCase()}.`}
        </p>
        {site.calendly && (
          <a
            href={site.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-red mt-6 inline-flex px-6 py-3 text-sm"
          >
            Albo od razu umów rozmowę
          </a>
        )}
      </div>
    )
  }

  return (
    <div
      style={{ background: 'var(--moss-900)', borderColor: 'rgba(244, 237, 220, 0.14)' }}
      className="rounded-2xl border p-6 md:p-8"
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <p className="font-display text-lg font-semibold text-[var(--cream)]">Opowiedz o{' '}swojej pracowni</p>
          <p className="mt-1 text-sm text-[var(--cream-dim)]">{`${site.responseTime}.`}</p>
        </div>

        <input type="hidden" name="source" value="krajobraz" />

        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
              <span className="eyebrow mb-2 block">{field.label}</span>
              {field.type === 'textarea' ? (
                <textarea
                  name={field.id}
                  required={field.required}
                  rows={4}
                  disabled={status === 'loading'}
                  placeholder={field.placeholder}
                  className="field resize-none"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.id}
                  required={field.required}
                  disabled={status === 'loading'}
                  placeholder={field.placeholder}
                  className="field"
                />
              )}
            </label>
          ))}
        </div>

        <div aria-live="polite">
          {status === 'error' && (
            <p
              style={{ borderColor: 'rgba(244, 237, 220, 0.2)', background: 'rgba(244, 237, 220, 0.05)' }}
              className="rounded-2xl border px-4 py-3 text-sm text-[var(--cream)]"
            >
              {errorMessage || `Nie udało się wysłać. Napisz proszę bezpośrednio na ${site.email}.`}
            </p>
          )}
        </div>

        <button type="submit" disabled={status === 'loading'} className="cta-red w-full px-6 py-3 text-sm md:w-auto">
          {status === 'loading' ? 'Wysyłam…' : 'Wyślij zapytanie'}
        </button>

        <p className="text-[11px] text-[var(--cream-dim)]">
          Dane z{' '}formularza wykorzystam wyłącznie do odpowiedzi na to zapytanie.
        </p>
      </form>
    </div>
  )
}
