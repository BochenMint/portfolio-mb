import { useState } from 'react'
import type { FormEvent } from 'react'
import { qualificationFields, site } from '../data/content'

type FormStatus = 'idle' | 'loading' | 'success' | 'error' | 'unconfigured'

const formEndpoint = import.meta.env.VITE_FORM_ENDPOINT || ''
const formAccessKey = import.meta.env.VITE_FORM_ACCESS_KEY || ''

function isWeb3Forms(endpoint: string) {
  return endpoint.includes('web3forms.com')
}

export function LeadForm() {
  const [status, setStatus] = useState<FormStatus>(
    formEndpoint ? 'idle' : 'unconfigured',
  )
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formEndpoint) {
      setStatus('unconfigured')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    const data = new FormData(e.currentTarget)
    const body = Object.fromEntries(data.entries()) as Record<string, string>

    const payload: Record<string, string> = {
      subject: `Audyt portfolio — ${body.company ?? 'zapytanie'}`,
      from_name: body.name ?? 'Portfolio brief',
      ...body,
    }

    if (isWeb3Forms(formEndpoint)) {
      if (!formAccessKey) {
        setStatus('error')
        setErrorMessage('Brak VITE_FORM_ACCESS_KEY w .env (wymagane dla Web3Forms).')
        return
      }
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
        throw new Error(
          (err as { message?: string }).message || `HTTP ${res.status}`,
        )
      }

      setStatus('success')
      e.currentTarget.reset()
    } catch (err) {
      setStatus('error')
      setErrorMessage(
        err instanceof Error ? err.message : 'Nie udało się wysłać formularza.',
      )
    }
  }

  if (status === 'success') {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="font-display text-xl font-bold text-mint">Dzięki — brief wysłany</p>
        <p className="text-muted mt-2 text-sm">
          Odpowiem w ciągu {site.responseTime.toLowerCase()}. Sprawdź skrzynkę (także spam).
        </p>
        {site.calendly && (
          <a
            href={site.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-mint px-6 py-3 text-sm font-bold text-ink"
          >
            Albo od razu wybierz termin w kalendarzu →
          </a>
        )}
      </div>
    )
  }

  if (status === 'unconfigured') {
    return (
      <div className="glass space-y-4 rounded-2xl p-6 md:p-8">
        <p className="font-display text-lg font-bold">Brief kwalifikacyjny</p>
        <p className="text-muted text-sm">
          Formularz wymaga konfiguracji: skopiuj <code className="text-mint">.env.example</code>{' '}
          do <code className="text-mint">.env</code> i uzupełnij{' '}
          <code className="text-mint">VITE_FORM_ENDPOINT</code>
          {isWeb3Forms(formEndpoint) || !formEndpoint ? ' oraz VITE_FORM_ACCESS_KEY' : ''}.
        </p>
        {site.calendly ? (
          <a
            href={site.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-mint px-6 py-3 text-sm font-bold text-ink"
          >
            Umów audyt w kalendarzu →
          </a>
        ) : (
          <p className="text-muted text-xs">
            Ustaw też <code className="text-mint">VITE_CALENDLY_URL</code> dla CTA kalendarza.
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="glass space-y-4 rounded-2xl p-6 md:p-8">
      <p className="font-display text-lg font-bold">Brief kwalifikacyjny (3 min)</p>
      <p className="text-muted text-sm">
        Wypełnij pola — dostanę wiadomość na skrzynkę. {site.responseTime}. Bez spamu.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {qualificationFields.map((field) => (
          <label
            key={field.id}
            className={field.type === 'textarea' ? 'md:col-span-2' : ''}
          >
            <span className="text-muted mb-1.5 block text-xs uppercase">{field.label}</span>
            {field.type === 'select' ? (
              <select
                name={field.id}
                required={field.required}
                disabled={status === 'loading'}
                className="w-full rounded-xl border border-line bg-ink/80 px-4 py-3 text-sm outline-none focus:border-mint disabled:opacity-60"
              >
                <option value="">Wybierz…</option>
                {field.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                name={field.id}
                required={field.required}
                rows={4}
                disabled={status === 'loading'}
                className="w-full resize-none rounded-xl border border-line bg-ink/80 px-4 py-3 text-sm outline-none focus:border-mint disabled:opacity-60"
                placeholder="Np. faktury w Excelu, rezerwacje z Booking…"
              />
            ) : (
              <input
                type={field.type}
                name={field.id}
                required={field.required}
                disabled={status === 'loading'}
                className="w-full rounded-xl border border-line bg-ink/80 px-4 py-3 text-sm outline-none focus:border-mint disabled:opacity-60"
              />
            )}
          </label>
        ))}
      </div>

      {status === 'error' && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage || 'Błąd wysyłki. Spróbuj ponownie lub napisz bezpośrednio.'}
        </p>
      )}

      <button
        type="submit"
        data-magnetic
        disabled={status === 'loading'}
        className="w-full rounded-full bg-mint py-4 text-sm font-bold text-ink transition-transform hover:scale-[1.01] disabled:cursor-wait disabled:opacity-70 md:w-auto md:px-10"
      >
        {status === 'loading' ? 'Wysyłanie…' : 'Wyślij brief →'}
      </button>
      <p className="text-muted text-[11px]">
        Wysyłając, zgadzasz się na kontakt w sprawie projektu. Dane trafiają wyłącznie do
        skonfigurowanego endpointu formularza (Web3Forms / Formspree).
      </p>
    </form>
  )
}
