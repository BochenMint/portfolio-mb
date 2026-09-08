export const section = (h2, ...blocks) => ({ h2, blocks })
export const p = (text) => ({ type: 'p', text })
export const h3 = (text) => ({ type: 'h3', text })
export const ul = (items) => ({ type: 'ul', items })
export const ol = (items) => ({ type: 'ol', items })
export const note = (text) => ({ type: 'note', text })
export const table = (headers, rows) => ({ type: 'table', headers, rows })

export const DATE = '2026-08-24'

export function offerCennik() {
  return {
    href: '/#cennik',
    anchor: {
      pl: 'pakiety i próg wejścia',
      en: 'packages and entry threshold',
      uk: 'пакети та поріг входу',
    },
  }
}

export function offerOferta() {
  return {
    href: '/#oferta',
    anchor: {
      pl: 'zakres prac: strona, panel, HITL',
      en: 'scope of work: site, panel, HITL',
      uk: 'обсяг робіт: сайт, панель, HITL',
    },
  }
}

export function offerRealizacje() {
  return {
    href: '/#realizacje',
    anchor: {
      pl: 'żywe realizacje Mint i Plumm',
      en: 'live work: Mint and Plumm',
      uk: 'живі реалізації Mint і Plumm',
    },
  }
}

export function offerKontakt() {
  return {
    href: '/#kontakt',
    anchor: {
      pl: 'formularz i 20-minutowy audyt',
      en: 'the form and a 20-minute audit',
      uk: 'форма та 20-хвилинний аудит',
    },
  }
}
