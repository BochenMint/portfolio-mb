import { useState } from 'react'
import type { FormEvent } from 'react'
import { qualificationFields, site } from '../data/content'

export function LeadForm() {
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const body = Object.fromEntries(data.entries())
    const subject = encodeURIComponent(
      `Portfolio — ${String(body.company ?? 'zapytanie')}`,
    )
    const text = encodeURIComponent(
      Object.entries(body)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n'),
    )
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${text}`
    setSent(true)
  }

  if (sent) {
    return (
      <div className="border-rule border p-8">
        <p className="font-display text-xl">Dzięki — otwórz klienta maila</p>
        <p className="text-muted mt-2 text-sm">
          Jeśli okno się nie otworzyło, napisz na {site.email}
        </p>
        {site.calendly && (
          <a
            href={site.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent mt-6 inline-block text-sm underline"
          >
            Albo wybierz termin w kalendarzu →
          </a>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="border-rule space-y-4 border p-6 md:p-8">
      <p className="font-display text-lg">Brief (ok. 3 min)</p>
      <p className="text-muted text-sm">
        Po wysłaniu otworzy się mail — {site.responseTime}. Bez newslettera.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {qualificationFields.map((field) => (
          <label
            key={field.id}
            className={field.type === 'textarea' ? 'md:col-span-2' : ''}
          >
            <span className="text-muted mb-1.5 block text-[10px] tracking-[0.15em] uppercase">
              {field.label}
            </span>
            {field.type === 'select' ? (
              <select
                name={field.id}
                required={field.required}
                className="border-rule w-full border bg-transparent px-4 py-3 text-sm outline-none focus:border-accent"
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
                className="border-rule w-full resize-none border bg-transparent px-4 py-3 text-sm outline-none focus:border-accent"
                placeholder="Np. faktury w Excelu, rezerwacje z Booking…"
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
      </div>

      <button type="submit" className="btn-fill w-full md:w-auto">
        Wyślij brief →
      </button>
      <p className="text-muted text-[11px]">
        Dane nie trafiają na serwer — mailto (do czasu backendu formularza).
      </p>
    </form>
  )
}
