import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocale } from '../i18n/context'
import { Button, ChromeCard } from './primitives'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const formEndpoint = import.meta.env.VITE_FORM_ENDPOINT || ''
const formAccessKey = import.meta.env.VITE_FORM_ACCESS_KEY || ''

function isWeb3Forms(endpoint: string) {
  return endpoint.includes('web3forms.com')
}

/** No usable AJAX endpoint — missing entirely, or Web3Forms without an access key. */
function needsMailtoFallback(endpoint: string, accessKey: string) {
  return !endpoint || (isWeb3Forms(endpoint) && !accessKey)
}

export function LeadForm() {
  const { t: c, content } = useLocale()
  const { qualificationFields, site } = content
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [usedMailto, setUsedMailto] = useState(false)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage('')

    const data = new FormData(e.currentTarget)
    const body = Object.fromEntries(data.entries()) as Record<string, string>

    if (needsMailtoFallback(formEndpoint, formAccessKey)) {
      const subject = `Audyt portfolio — ${body.company || body.name || 'zapytanie'}`
      const lines = qualificationFields.map((field) => `${field.label}: ${body[field.id] || '-'}`)
      const mailto = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
      window.location.href = mailto
      setUsedMailto(true)
      setStatus('success')
      e.currentTarget.reset()
      return
    }

    setStatus('loading')

    const payload: Record<string, string> = {
      subject: `Audyt portfolio — ${body.company ?? 'zapytanie'}`,
      from_name: body.name ?? 'Portfolio brief',
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
      setErrorMessage(err instanceof Error ? err.message : c.form.errorDefault)
    }
  }

  if (status === 'success') {
    return (
      <ChromeCard tone="light" className="p-8 text-center md:p-10">
        <p className="font-display text-xl font-semibold text-ink">{c.form.successTitle}</p>
        <p className="mt-2 text-sm text-ink/70">
          {usedMailto ? c.form.successMailtoNote(site.email) : c.form.successBody(site.responseTime)}
        </p>
        {site.calendly && (
          <a
            href={site.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="chrome-btn mt-6 inline-flex px-6 py-3 text-sm"
          >
            {c.form.successCalendarCta}
          </a>
        )}
      </ChromeCard>
    )
  }

  return (
    <ChromeCard tone="dark" className="p-6 md:p-8">
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <p className="font-display text-lg font-semibold text-white">{c.form.title}</p>
          <p className="mt-1 text-sm text-silver-2">{c.form.subtitle(site.responseTime)}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {qualificationFields.map((field) => (
            <label key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
              <span className="eyebrow mb-2 block">{field.label}</span>
              {field.type === 'select' ? (
                <select name={field.id} required={field.required} disabled={status === 'loading'} className="field">
                  <option value="">{c.form.selectPlaceholder}</option>
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
                  placeholder={c.form.messagePlaceholder}
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
            {errorMessage || c.form.errorDefault}
          </p>
        )}

        <Button type="submit" variant="accent" disabled={status === 'loading'} className="w-full md:w-auto">
          {status === 'loading' ? c.form.submitLoading : c.form.submitIdle}
        </Button>

        <p className="text-[11px] text-muted">{c.form.consent}</p>
      </form>
    </ChromeCard>
  )
}
