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
      `Audyt portfolio — ${String(body.company ?? 'zapytanie')}`,
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
      <div className="glass rounded-2xl p-8 text-center">
        <p className="font-display text-xl font-bold text-mint">Dzięki — otwórz klienta maila</p>
        <p className="text-muted mt-2 text-sm">
          Jeśli okno się nie otworzyło, napisz na {site.email}
        </p>
        {site.calendly && (
          <a
            href={site.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-sm text-mint underline"
          >
            Albo od razu wybierz termin w kalendarzu →
          </a>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="glass space-y-4 rounded-2xl p-6 md:p-8">
      <p className="font-display text-lg font-bold">Brief kwalifikacyjny (3 min)</p>
      <p className="text-muted text-sm">
        Po wysłaniu otworzy się mail — {site.responseTime}. Bez spamu.
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
                className="w-full rounded-xl border border-line bg-ink/80 px-4 py-3 text-sm outline-none focus:border-mint"
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
                className="w-full resize-none rounded-xl border border-line bg-ink/80 px-4 py-3 text-sm outline-none focus:border-mint"
                placeholder="Np. faktury w Excelu, rezerwacje z Booking…"
              />
            ) : (
              <input
                type={field.type}
                name={field.id}
                required={field.required}
                className="w-full rounded-xl border border-line bg-ink/80 px-4 py-3 text-sm outline-none focus:border-mint"
              />
            )}
          </label>
        ))}
      </div>

      <button
        type="submit"
        data-magnetic
        className="w-full rounded-full bg-mint py-4 text-sm font-bold text-ink transition-transform hover:scale-[1.01] md:w-auto md:px-10"
      >
        Wyślij brief →
      </button>
      <p className="text-muted text-[11px]">
        Wysyłając, zgadzasz się na kontakt w sprawie projektu. Dane nie trafiają na serwer — mailto
        (do czasu podpięcia form backendu).
      </p>
    </form>
  )
}
