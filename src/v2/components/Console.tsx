import { useState } from 'react'
import { sections, site, contactFields, leadForm } from '../../i18n/live'

type FormState = Record<string, string>

export function Console() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const ctaHref = site.calendly || '#console'

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const subject = encodeURIComponent(`Brief od ${form.name || 'gościa'} — portfolio`)
    const body = encodeURIComponent(
      `Imię: ${form.name}\nE-mail: ${form.email}\n\nCo zjada czas:\n${form.message}`,
    )
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <section id="console" className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
      {/* Section header */}
      <div className="reveal mb-14">
        <p className="v2-label">05 / KONTAKT</p>
        <h2 className="v2-display mt-4 text-[clamp(2rem,5vw,3.75rem)]">
          {sections.contact.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-paper)]/60 md:text-lg">
          {sections.contact.lead}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {/* LEFT — pitch + contact info */}
        <div className="reveal flex flex-col gap-6">
          {/* Pitch card */}
          <div className="v2-panel v2-hud p-7 md:p-9">
            <p className="v2-label mb-4">// brief audyt</p>
            <p className="text-[14px] leading-relaxed text-[var(--color-paper)]/70">
              {sections.contact.lead}
            </p>

            {/* Email */}
            <div className="mt-7">
              <p className="v2-label mb-2">e-mail</p>
              <a
                href={`mailto:${site.email}`}
                className="font-grotesk break-all text-lg font-semibold text-accent transition-opacity hover:opacity-70 md:text-xl"
              >
                {site.email}
              </a>
            </div>

            {/* Response time + location */}
            <div className="mt-5 flex flex-wrap gap-4">
              <div>
                <p className="v2-label mb-1">czas odpowiedzi</p>
                <p className="v2-mono text-[12px] text-[var(--color-paper)]/65">{site.responseTime}</p>
              </div>
              <div>
                <p className="v2-label mb-1">lokalizacja</p>
                <p className="v2-mono text-[12px] text-[var(--color-paper)]/65">{site.location}</p>
              </div>
            </div>

            {/* GitHub */}
            <div className="mt-5 border-t border-[var(--v2-line)] pt-5">
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="v2-mono text-[11px] tracking-[0.14em] text-[var(--color-paper)]/45 uppercase transition-colors hover:text-accent"
              >
                GitHub ↗
              </a>
            </div>
          </div>

          {/* Primary CTA */}
          <a
            href={ctaHref}
            {...(site.calendly ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="btn-accent self-start"
          >
            {site.ctaPrimary}
            <span aria-hidden>→</span>
          </a>
        </div>

        {/* RIGHT — console form */}
        <div className="reveal">
          <div className="v2-panel v2-panel--2 v2-hud h-full p-6 md:p-8">
            {/* Terminal header */}
            <div className="mb-5 flex items-center justify-between">
              <p className="v2-label">console.brief</p>
              <span className="v2-pill">
                <span className="v2-dot" />
                online
              </span>
            </div>

            {sent ? (
              /* Thanks state */
              <div className="flex flex-col items-start gap-4 py-8">
                <span className="v2-mono text-[11px] tracking-[0.18em] text-accent">$ sent ✓</span>
                <p className="font-grotesk text-xl font-semibold">{leadForm.thanksTitle}</p>
                <p className="text-[13.5px] leading-relaxed text-[var(--color-paper)]/60">
                  {leadForm.thanksBody}
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }) }}
                  className="v2-mono mt-2 text-[11px] tracking-[0.14em] text-accent uppercase transition-opacity hover:opacity-70"
                >
                  wyślij kolejny →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {contactFields.map((field) =>
                  field.type === 'textarea' ? (
                    <div key={field.id} className="flex flex-col gap-1.5">
                      <label
                        htmlFor={field.id}
                        className="v2-label"
                      >
                        {field.label}
                      </label>
                      <textarea
                        id={field.id}
                        required={field.required}
                        rows={4}
                        placeholder={field.placeholder}
                        value={form[field.id] ?? ''}
                        onChange={handleChange}
                        className="v2-mono resize-none rounded-lg border border-[var(--v2-line)] bg-[var(--v2-surface-2)] px-3 py-2.5 text-[13px] leading-relaxed text-[var(--color-paper)] placeholder-[var(--color-paper)]/25 outline-none transition-colors focus:border-accent"
                      />
                    </div>
                  ) : (
                    <div key={field.id} className="flex flex-col gap-1.5">
                      <label
                        htmlFor={field.id}
                        className="v2-label"
                      >
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        type={field.type}
                        required={field.required}
                        value={form[field.id] ?? ''}
                        onChange={handleChange}
                        className="v2-mono rounded-lg border border-[var(--v2-line)] bg-[var(--v2-surface-2)] px-3 py-2.5 text-[13px] text-[var(--color-paper)] placeholder-[var(--color-paper)]/25 outline-none transition-colors focus:border-accent"
                      />
                    </div>
                  ),
                )}

                <button
                  type="submit"
                  className="btn-accent mt-2 self-start"
                >
                  {leadForm.submit}
                  <span aria-hidden>→</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
