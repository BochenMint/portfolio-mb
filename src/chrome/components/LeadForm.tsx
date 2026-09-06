import { useState } from 'react'
import type { FormEvent } from 'react'
import { qualificationFields, site } from '../../data/content'
import { Button, ChromeCard } from './primitives'

type FormStatus = 'idle' | 'loading' | 'success' | 'error' | 'unconfigured'

const formEndpoint = import.meta.env.VITE_FORM_ENDPOINT || ''
const formAccessKey = import.meta.env.VITE_FORM_ACCESS_KEY || ''

function isWeb3Forms(endpoint: string) {
  return endpoint.includes('web3forms.com')
}

export function LeadForm() {
  const [status, setStatus] = useState<FormStatus>(formEndpoint ? 'idle' : 'unconfigured')
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
        throw new Error((err as { message?: string }).message || `HTTP ${res.status}`)
      }

      setStatus('success')
      e.currentTarget.reset()
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Nie udało się wysłać formularza.')
    }
  }

  if (status === 'success') {
    return (
      <ChromeCard tone="light" className="p-8 text-center md:p-10">
        <p className="font-display text-xl font-semibold text-ink">Dzięki — brief wysłany</p>
        <p className="mt-2 text-sm text-ink/70">
          Odpowiem w ciągu {site.responseTime.toLowerCase()}. Sprawdź skrzynkę (także spam).
        </p>
        {site.calendly && (
          <a
            href={site.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="chrome-btn mt-6 inline-flex px-6 py-3 text-sm"
          >
            Albo od razu wybierz termin w kalendarzu →
          </a>
        )}
      </ChromeCard>
    )
  }

  if (status === 'unconfigured') {
    return (
      <ChromeCard tone="dark" className="space-y-4 p-6 md:p-8">
        <p className="font-display text-lg font-semibold text-white">Brief kwalifikacyjny</p>
        <p className="text-sm text-silver-2">
          Formularz wymaga konfiguracji: skopiuj <code className="text-white">.env.example</code> do{' '}
          <code className="text-white">.env</code> i uzupełnij <code className="text-white">VITE_FORM_ENDPOINT</code>
          {isWeb3Forms(formEndpoint) || !formEndpoint ? ' oraz VITE_FORM_ACCESS_KEY' : ''}.
        </p>
        {site.calendly ? (
          <a href={site.calendly} target="_blank" rel="noopener noreferrer" className="chrome-btn inline-flex px-6 py-3 text-sm">
            Umów audyt w kalendarzu →
          </a>
        ) : (
          <p className="text-xs text-muted">
            Ustaw też <code className="text-white">VITE_CALENDLY_URL</code> dla CTA kalendarza.
          </p>
        )}
      </ChromeCard>
    )
  }

  return (
    <ChromeCard tone="dark" className="p-6 md:p-8">
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <p className="font-display text-lg font-semibold text-white">Brief kwalifikacyjny (3 min)</p>
          <p className="mt-1 text-sm text-silver-2">
            Wypełnij pola — dostanę wiadomość na skrzynkę. {site.responseTime}. Bez spamu.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {qualificationFields.map((field) => (
            <label key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
              <span className="eyebrow mb-2 block">{field.label}</span>
              {field.type === 'select' ? (
                <select name={field.id} required={field.required} disabled={status === 'loading'} className="field">
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
                  className="field resize-none"
                  placeholder="Np. faktury w Excelu, rezerwacje z Booking…"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.id}
                  required={field.required}
                  disabled={status === 'loading'}
                  className="field"
                />
              )}
            </label>
          ))}
        </div>

        {status === 'error' && (
          <p className="rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-silver">
            {errorMessage || 'Błąd wysyłki. Spróbuj ponownie lub napisz bezpośrednio.'}
          </p>
        )}

        <Button type="submit" disabled={status === 'loading'} className="w-full md:w-auto">
          {status === 'loading' ? 'Wysyłanie…' : 'Wyślij brief →'}
        </Button>

        <p className="text-[11px] text-muted">
          Wysyłając, zgadzasz się na kontakt w sprawie projektu. Dane trafiają wyłącznie do
          skonfigurowanego endpointu formularza (Web3Forms / Formspree).
        </p>
      </form>
    </ChromeCard>
  )
}
