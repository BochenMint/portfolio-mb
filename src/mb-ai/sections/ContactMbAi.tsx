import { useState } from 'react'
import type { FormEvent } from 'react'
import { useContent, useMbAiCopy } from '../../i18n'

const formEndpoint = import.meta.env.VITE_FORM_ENDPOINT || 'https://api.web3forms.com/submit'
const formAccessKey = import.meta.env.VITE_FORM_ACCESS_KEY || ''

type FormState = {
  name: string
  email: string
  company: string
  message: string
}

const EMPTY: FormState = { name: '', email: '', company: '', message: '' }

export function ContactMbAi() {
  const [values, setValues] = useState<FormState>(EMPTY)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { site } = useContent()
  const copy = useMbAiCopy()

  const ctaHref = site.calendly || '#kontakt'

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const payload = {
      source: 'mb-ai',
      contact: {
        name: values.name,
        email: values.email,
        company: values.company,
      },
      message: values.message,
    }

    const formattedMessage = [
      `${copy.formSource}: mb-ai`,
      `${copy.formName}: ${values.name}`,
      `${copy.formEmail}: ${values.email}`,
      `${copy.formCompany}: ${values.company}`,
      '',
      values.message,
      '',
      '---JSON---',
      JSON.stringify(payload, null, 2),
      '---END_JSON---',
    ].join('\n')

    if (formAccessKey) {
      setLoading(true)
      try {
        const res = await fetch(formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: formAccessKey,
            subject: `[MB AI] ${values.company || values.name || copy.enquiryFallback}`,
            from_name: values.name,
            replyto: values.email,
            botcheck: '',
            message: formattedMessage,
          }),
        })
        const json = (await res.json()) as { success?: boolean }
        if (!res.ok || !json.success) throw new Error('submit failed')
        setSent(true)
      } catch {
        setError(copy.sendError)
      } finally {
        setLoading(false)
      }
      return
    }

    const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
      `[MB AI] ${values.company || values.name || copy.enquiryFallback}`,
    )}&body=${encodeURIComponent(formattedMessage)}`
    window.location.href = mailto
    setSent(true)
  }

  return (
    <section id="kontakt" className="mx-auto max-w-6xl px-5 py-24 md:py-32 md:px-8">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        <div>
          <p className="mbai-label mb-4">{copy.contactKicker}</p>
          <h2 className="mbai-display text-[clamp(2rem,5vw,3rem)] text-balance mb-5">
            {copy.contactTitleBefore}
            <em className="mbai-serif-accent">{copy.contactTitleEm}</em>
          </h2>
          <p className="text-muted text-base leading-relaxed mb-8">{copy.contactLead}</p>

          <div className="flex flex-col gap-4">
            <a
              href={`mailto:${site.email}`}
              className="font-[family-name:var(--font-grotesk)] text-xl text-accent hover:opacity-70 transition-opacity break-all"
            >
              {site.email}
            </a>
            <p className="mbai-mono text-[11px] text-muted">
              {site.responseTime} · {site.location}
            </p>
            <a
              href={ctaHref}
              className="btn-accent inline-flex w-fit items-center gap-2 mt-2"
              {...(site.calendly ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {site.ctaCalendly}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        <div className="mbai-contact-card p-6 md:p-8">
          {sent ? (
            <div className="py-4">
              <p className="mbai-mono text-[10px] tracking-[0.14em] text-accent uppercase mb-3">
                {copy.sentLabel}
              </p>
              <p className="font-[family-name:var(--font-grotesk)] font-semibold text-xl text-[var(--color-paper)] mb-2">
                {copy.thanksTitle}
              </p>
              <p className="text-muted text-sm leading-relaxed">{copy.thanksBody}</p>
              <button
                type="button"
                onClick={() => {
                  setSent(false)
                  setValues(EMPTY)
                }}
                className="btn-soft mt-6"
              >
                {copy.sendAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
              <div>
                <label htmlFor="mbai-name" className="mbai-label block mb-2">
                  {copy.nameLabel}
                </label>
                <input
                  id="mbai-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="mbai-input"
                  value={values.name}
                  onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="mbai-email" className="mbai-label block mb-2">
                  {copy.emailLabel}
                </label>
                <input
                  id="mbai-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="mbai-input"
                  value={values.email}
                  onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="mbai-company" className="mbai-label block mb-2">
                  {copy.companyLabel}
                </label>
                <input
                  id="mbai-company"
                  name="company"
                  type="text"
                  required
                  autoComplete="organization"
                  className="mbai-input"
                  placeholder={copy.companyPlaceholder}
                  value={values.company}
                  onChange={(e) => setValues((v) => ({ ...v, company: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="mbai-message" className="mbai-label block mb-2">
                  {copy.messageLabel}
                </label>
                <textarea
                  id="mbai-message"
                  name="message"
                  required
                  autoComplete="off"
                  className="mbai-textarea"
                  placeholder={copy.messagePlaceholder}
                  value={values.message}
                  onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                />
              </div>

              {error && <p className="text-sm text-[var(--color-coral)]">{error}</p>}

              <button type="submit" disabled={loading} className="btn-accent justify-center disabled:opacity-60">
                {loading ? copy.submitting : copy.submit}
              </button>

              <p className="mbai-mono text-[10px] text-muted leading-relaxed">{copy.consent}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
