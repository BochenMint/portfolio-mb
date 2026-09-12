import { site } from '../../chrome/data/content'
import { Inquiry, type InquiryField } from '../../stage/Inquiry'

const heading = 'Porozmawiajmy o stronie Twojej pracowni.'

const lead =
  'Zaprojektuję i wdrożę stronę, która pokazuje Wasze realizacje tak dobrze, jak wyglądają ' +
  'w naturze — i zamienia oglądających w zapytania. Jedna osoba od projektu po ' +
  'wdrożenie i opiekę.'

const listHeading = 'Co może się na niej znaleźć'

const bullets = [
  'Portfolio realizacji — duże zdjęcia, galerie przed i po, opis każdego projektu',
  'Usługi opisane po ludzku: projekt, realizacja, pielęgnacja',
  'Formularz zapytania, który od razu zbiera metraż, lokalizację i budżet',
  'Szybka na telefonie i widoczna w Google w Twojej okolicy',
]

const priceLine = 'Strony od 2 000 PLN. Wycenę podam po krótkiej rozmowie.'

const inquiryFields: InquiryField[] = [
  { id: 'name', label: 'Imię', type: 'text', required: true },
  { id: 'email', label: 'E-mail', type: 'email', required: true },
  { id: 'company', label: 'Pracownia / firma', type: 'text' },
  { id: 'website', label: 'Obecna strona (jeśli jest)', type: 'text', placeholder: 'np. twojapracownia.pl' },
  {
    id: 'message',
    label: 'Czego potrzebujesz?',
    type: 'textarea',
    placeholder: 'Kilka zdań: czym się zajmujecie i co ma robić nowa strona.',
  },
]

const buildInquirySubject = (body: Record<string, string>) =>
  `Strona dla pracowni krajobrazu — ${body.company || body.name || 'zapytanie'}`

function LeafMarker() {
  return (
    <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-1 shrink-0">
      <path d="M2 12C2 6 6 2 12 2C12 8 8 12 2 12Z" fill="var(--leaf)" />
    </svg>
  )
}

export function Contact() {
  const rows = [
    { label: 'E-mail', value: site.email, href: `mailto:${site.email}`, external: false },
    ...(site.calendly
      ? [{ label: 'Kalendarz', value: 'Umów 20 minut rozmowy', href: site.calendly, external: true }]
      : []),
    { label: 'Portfolio', value: 'marcinbochenek.com', href: 'https://marcinbochenek.com/', external: false },
  ]

  return (
    <section
      id="kontakt"
      style={{
        // Starts on the colour the garden's closing scrim ends on; the faint
        // lift of green sits behind the copy, clear of the top edge.
        background:
          'radial-gradient(70% 42% at 18% 44%, rgba(40, 66, 30, 0.3), transparent 100%), var(--moss-950)',
      }}
      className="px-5 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="eyebrow">Kontakt</p>
          <h2 className="mt-4 text-3xl font-semibold text-[var(--cream)] md:text-4xl">{heading}</h2>
          <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-[var(--cream-dim)]">{lead}</p>

          <div className="mt-10">
            <p className="eyebrow">{listHeading}</p>
            <ul className="mt-4 space-y-3">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--cream)]">
                  <LeafMarker />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 text-sm text-[var(--cream-dim)]">{priceLine}</p>

          <div className="mt-10">
            <div className="hairline" />
            {rows.map((row) => (
              <div key={row.label}>
                <a
                  href={row.href}
                  {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex items-center justify-between gap-4 py-4"
                >
                  <span className="eyebrow">{row.label}</span>
                  <span className="text-sm text-[var(--cream)] transition-transform group-hover:translate-x-1">
                    {row.value}
                  </span>
                </a>
                <div className="hairline" />
              </div>
            ))}
            <p className="mt-4 text-sm text-[var(--cream-dim)]">{site.responseTime}</p>
          </div>
        </div>

        <Inquiry
          source="krajobraz"
          fields={inquiryFields}
          heading="Opowiedz o swojej pracowni"
          buildSubject={buildInquirySubject}
        />
      </div>
    </section>
  )
}
