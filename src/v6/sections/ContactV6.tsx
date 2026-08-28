import { useState } from 'react'
import type { FormEvent } from 'react'
import { contactFields, leadForm, sections, site } from '../../i18n/live'
import { ctaHref, formAccessKey, formEndpoint, isExternalCta } from '../utils'

function getFieldLabel(id: string) {
  return contactFields.find((field) => field.id === id)?.label ?? id
}

function formatPayload(payload: Record<string, string>) {
  return contactFields.map((field) => `${field.label}: ${payload[field.id] || '-'}`).join('\n')
}

export function ContactV6() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const calHref = ctaHref(site.calendly)
  const calExternal = isExternalCta(site.calendly)

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
            subject: `V6 — ${payload.company || payload.name || 'zapytanie'}`,
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

    const subject = encodeURIComponent(`V6 — ${payload.company || payload.name || 'zapytanie'}`)
    const text = encodeURIComponent(
      Object.entries(payload)
        .map(([key, value]) => `${getFieldLabel(key)}: ${value}`)
        .join('\n'),
    )
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${text}`
    setSent(true)
  }

  return (
    <section id="kontakt" className="v6-contact v6-section" aria-labelledby="v6-contact-title">
      <div className="v6-wrap v6-section-rail">
        <p className="v6-section-index" aria-hidden>{sections.contact.num}</p>
        <div className="v6-section-body">
          <div className="v6-contact-grid">
            <div>
              <p className="v6-eyebrow">Kontakt</p>
              <h2 id="v6-contact-title" data-v6-split>{sections.contact.title}</h2>
              <p className="v6-section-lead">{sections.contact.lead}</p>
              <p className="v6-contact-meta">
                {site.responseTime} · {site.location}
              </p>
              <a
                href={calHref}
                className="v6-contact-cal"
                {...(calExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                Lub umów audyt w kalendarzu →
              </a>
            </div>

            {sent ? (
              <div className="v6-form-thanks">
                <p className="v6-eyebrow">Wysłano</p>
                <h3>{leadForm.thanksTitle}</h3>
                <p>
                  {formAccessKey
                    ? leadForm.thanksBody
                    : `Jeśli klient maila się nie otworzył, napisz na ${site.email}`}
                </p>
              </div>
            ) : (
              <form className="v6-form" onSubmit={onSubmit}>
                <p className="v6-form-title">{leadForm.title}</p>
                <p className="v6-form-intro">{leadForm.intro}</p>

                {contactFields.map((field) => (
                  <label key={field.id} className="v6-field">
                    <span>{field.label}</span>
                    {field.type === 'textarea' ? (
                      <textarea
                        name={field.id}
                        required={field.required}
                        rows={5}
                        placeholder={field.placeholder}
                      />
                    ) : field.type === 'select' ? (
                      <select name={field.id} required={field.required} defaultValue="">
                        <option value="" disabled>Wybierz opcję</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.id}
                        required={field.required}
                        placeholder={field.placeholder}
                      />
                    )}
                  </label>
                ))}

                {error ? (
                  <p className="v6-form-error" role="alert">{error}</p>
                ) : null}

                <button type="submit" className="v6-cta-primary v6-cta-full" disabled={loading}>
                  {loading ? leadForm.submitting : leadForm.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
