import { site } from '../../data/content'
import { chromeCopy as c } from '../copy'
import { LeadForm } from './LeadForm'
import { Arrow, SectionHeader } from './primitives'

export function Contact() {
  const rows = [
    { label: c.contact.emailLabel, value: site.email, href: `mailto:${site.email}` },
    ...(site.calendly
      ? [{ label: c.contact.calendarLabel, value: 'Zarezerwuj termin', href: site.calendly, external: true }]
      : []),
    { label: c.contact.githubLabel, value: site.github.replace('https://', ''), href: site.github, external: true },
  ]

  return (
    <section id="kontakt" className="px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
        <div>
          <SectionHeader eyebrow={c.contact.eyebrow} title={c.contact.title} lead={c.contact.lead} />

          <div className="mt-12">
            <div className="hairline" />
            {rows.map((row) => (
              <div key={row.label}>
                <a
                  href={row.href}
                  {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex items-center justify-between gap-4 py-5"
                >
                  <span className="eyebrow">{row.label}</span>
                  <span className="flex items-center gap-2 text-sm text-white transition-transform group-hover:translate-x-1">
                    {row.value}
                    <Arrow className="text-silver-2" />
                  </span>
                </a>
                <div className="hairline" />
              </div>
            ))}
          </div>
        </div>

        <LeadForm />
      </div>
    </section>
  )
}
