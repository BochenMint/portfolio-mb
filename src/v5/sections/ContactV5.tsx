import { useState } from 'react'
import type { FormEvent } from 'react'
import { contactFields, leadForm, sections, site } from '../../i18n/live'
import { ctaHref, isExternalCta } from '../utils'

const formEndpoint = import.meta.env.VITE_FORM_ENDPOINT || 'https://api.web3forms.com/submit'
const formAccessKey = import.meta.env.VITE_FORM_ACCESS_KEY || ''

function getFieldLabel(id: string) {
  return contactFields.find((field) => field.id === id)?.label ?? id
}

function formatPayload(payload: Record<string, string>) {
  return contactFields.map((field) => `${field.label}: ${payload[field.id] || '-'}`).join('\n')
}

export function ContactV5() {
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
            subject: `VOLT V5 — ${payload.company || payload.name || 'zapytanie'}`,
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

    const subject = encodeURIComponent(`VOLT V5 — ${payload.company || payload.name || 'zapytanie'}`)
    const text = encodeURIComponent(
      Object.entries(payload)
        .map(([key, value]) => `${getFieldLabel(key)}: ${value}`)
        .join('\n'),
    )
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${text}`
    setSent(true)
  }

  return (
    <section id="kontakt" className="volt-contact" aria-labelledby="volt-contact-title">
      <div className="volt-contact-layout">
        <div>
          <p className="volt-mono">{sections.contact.num} · kontakt</p>
          <h2 id="volt-contact-title" data-volt-split>
            {sections.contact.title}
          </h2>
          <p className="volt-contact-lead">{sections.contact.lead}</p>
          <a
            href={calHref}
            className="volt-contact-cal"
            {...(calExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            Lub umów audyt w kalendarzu →
          </a>
        </div>

        {sent ? (
          <div className="volt-form-thanks">
            <p className="volt-mono">Wysłano</p>
            <h3>{leadForm.thanksTitle}</h3>
            <p>
              {formAccessKey
                ? leadForm.thanksBody
                : `Jeśli klient maila się nie otworzył, napisz na ${site.email}`}
            </p>
          </div>
        ) : (
          <form className="volt-form" onSubmit={onSubmit}>
            <p className="volt-mono" style={{ margin: '0 0 0.5rem' }}>
              {leadForm.title}
            </p>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', opacity: 0.85 }}>{leadForm.intro}</p>

            {contactFields.map((field) => (
              <label key={field.id}>
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
                    placeholder={field.placeholder}
                  />
                )}
              </label>
            ))}

            {error ? (
              <p className="volt-form-error" role="alert">
                {error}
              </p>
            ) : null}

            <button type="submit" className="volt-btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? leadForm.submitting : leadForm.submit}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
