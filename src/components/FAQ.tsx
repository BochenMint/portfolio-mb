import { faq } from '../data/content'

export function FAQ() {
  return (
    <section className="section-pad editorial-rule border-t">
      <div className="mx-auto max-w-2xl">
        <p className="section-label reveal text-center">FAQ</p>
        <h2 className="font-display reveal mt-4 text-center text-3xl">Pytania, które i tak padają</h2>
        <div className="mt-12 space-y-0">
          {faq.map((item) => (
            <details key={item.q} className="reveal editorial-rule group border-t py-5">
              <summary className="cursor-pointer list-none font-medium marker:content-none">
                <span className="flex items-start justify-between gap-4">
                  {item.q}
                  <span className="text-accent shrink-0 transition-transform group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="text-muted mt-3 pb-2 text-sm leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
