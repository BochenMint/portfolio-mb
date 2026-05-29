import { useState } from 'react'
import type { FormEvent } from 'react'
import { contactFields, site } from '../data/content'

const formEndpoint =
  import.meta.env.VITE_FORM_ENDPOINT || 'https://api.web3forms.com/submit'
const formAccessKey = import.meta.env.VITE_FORM_ACCESS_KEY || ''

export function LeadForm() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const data = new FormData(e.currentTarget)
    const payload = Object.fromEntries(data.entries()) as Record<string, string>

    if (formAccessKey) {
      setLoading(true)
      try {
        const res = await fetch(formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: formAccessKey,
            subject: `Portfolio — ${payload.name ?? 'zapytanie'}`,
            from_name: payload.name,
            email: payload.email,
            message: payload.message,
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

    const subject = encodeURIComponent(`Portfolio — ${payload.name ?? 'zapytanie'}`)
    const text = encodeURIComponent(
      Object.entries(payload)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n'),
    )
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${text}`
    setSent(true)
  }

  if (sent) {
    return (
      <div className="border-rule border p-8">
        <p className="font-display text-xl">Dzięki za wiadomość</p>
        <p className="text-muted mt-2 text-sm">
          {formAccessKey
            ? 'Odezwę się w ciągu jednego dnia roboczego.'
            : `Jeśli klient maila się nie otworzył, napisz na ${site.email}`}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="border-rule space-y-4 border p-6 md:p-8">
      <p className="font-display text-lg">Krótki formularz</p>

      {contactFields.map((field) => (
        <label key={field.id} className="block">
          <span className="text-muted mb-1.5 block text-[10px] tracking-[0.12em] uppercase">
            {field.label}
          </span>
          {field.type === 'textarea' ? (
            <textarea
              name={field.id}
              required={field.required}
              rows={4}
              className="border-rule w-full resize-none border bg-transparent px-4 py-3 text-sm outline-none focus:border-accent"
              placeholder="Co dziś nie działa?"
            />
          ) : (
            <input
              type={field.type}
              name={field.id}
              required={field.required}
              className="border-rule w-full border bg-transparent px-4 py-3 text-sm outline-none focus:border-accent"
            />
          )}
        </label>
      ))}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button type="submit" disabled={loading} className="btn-fill w-full md:w-auto">
        {loading ? 'Wysyłam…' : 'Wyślij'}
      </button>
      {!formAccessKey ? (
        <p className="text-muted text-[11px]">
          Ustaw VITE_FORM_ACCESS_KEY w .env, aby wysyłać przez Web3Forms.
        </p>
      ) : null}
    </form>
  )
}
