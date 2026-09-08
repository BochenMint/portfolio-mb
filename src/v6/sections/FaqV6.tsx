import { useState } from 'react'
import { faq, sections } from '../../i18n/live'

export function FaqV6() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="v6-faq v6-section" aria-labelledby="v6-faq-title">
      <div className="v6-wrap v6-section-rail">
        <p className="v6-section-index" aria-hidden>{sections.faq.num}</p>
        <div className="v6-section-body">
          <div className="v6-section-head">
            <p className="v6-eyebrow">FAQ</p>
            <h2 id="v6-faq-title" data-v6-split>{sections.faq.title}</h2>
            <p className="v6-section-lead">{sections.faq.lead}</p>
          </div>

          <div className="v6-faq-list">
            {faq.map((item, index) => {
              const open = openIndex === index
              return (
                <div key={item.question} className="v6-faq-item" data-open={open}>
                  <button
                    type="button"
                    className="v6-faq-q"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? null : index)}
                  >
                    <span className="v6-faq-q-num">{String(index + 1).padStart(2, '0')}</span>
                    <span className="v6-faq-q-text">{item.question}</span>
                    <span className="v6-faq-icon" aria-hidden>{open ? '−' : '+'}</span>
                  </button>
                  {open ? (
                    <div className="v6-faq-a">
                      <p>{item.answer}</p>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
