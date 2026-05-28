import { faq } from '../data/content'

export function FAQ() {
  return (
    <section data-section className="px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-3xl">
        <h2 data-reveal className="font-display text-center text-3xl font-bold">
          Obiekcje, które i tak masz w głowie
        </h2>
        <div className="mt-10 space-y-3">
          {faq.map((item) => (
            <details
              key={item.q}
              data-reveal
              className="glass group rounded-2xl px-6 py-4 open:border-mint/20"
            >
              <summary className="cursor-pointer list-none font-display font-semibold marker:content-none">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="text-mint transition-transform group-open:rotate-45">+</span>
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
