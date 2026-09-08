export type Edition = {
  href: string
  name: string
  period: string
  /** One line on what this edition was actually exploring. */
  note: { pl: string; en: string }
  /** Headline items get the wide card; the rest sit in the list below. */
  featured?: boolean
  current?: boolean
}

/**
 * Dates come from when each edition's source first landed in the repository,
 * not from memory — an archive that misdates itself is worse than no archive.
 */
export const editions: Edition[] = [
  {
    href: '/gra.html',
    name: 'Misja: nowa strona',
    period: 'wrzesień 2026',
    featured: true,
    note: {
      pl: 'Gra kosmiczna zamiast portfolio. Pilotujesz statek między planetami — każda to jeden projekt, a brief odblokowuje się po dotarciu na miejsce. Three.js, własna fizyka lotu i sterowanie na klawiaturze i dotyku.',
      en: 'A space shooter instead of a portfolio. You fly between planets — each one a project, its brief unlocked by arriving. Three.js, hand-rolled flight physics, keyboard and touch controls.',
    },
  },
  {
    href: '/',
    name: 'Chrome',
    period: 'wrzesień 2026',
    current: true,
    note: {
      pl: 'Bieżąca edycja. Polerowany chrom i szczotkowana stal, kostki 3D z prawdziwymi zrzutami produktów, nagłówek malowany shaderem WebGL2.',
      en: 'The current edition. Polished chrome and brushed steel, 3D cubes carrying real product screenshots, a headline painted by a WebGL2 shader.',
    },
  },
  {
    href: '/studio.html',
    name: 'Studio',
    period: 'wrzesień 2026',
    note: {
      pl: 'Jeden layout, sześć wymiennych skór wizualnych — od szwajcarskiej siatki po piksel art. Eksperyment z tym, ile znaczenia niesie sama warstwa graficzna.',
      en: 'One layout, six swappable visual skins — Swiss grid through pixel art. An experiment in how much meaning the graphic layer alone carries.',
    },
  },
  {
    href: '/v6.html',
    name: 'Volt',
    period: 'sierpień 2026',
    note: {
      pl: 'Kierunek energetyczny: mocny akcent, duża typografia, cząsteczkowe tło. Pierwsze podejście do liczenia odzyskanych godzin jako głównego argumentu.',
      en: 'An electric direction: one loud accent, oversized type, a particle field. The first attempt at making reclaimed hours the headline argument.',
    },
  },
  {
    href: '/v5.html',
    name: 'Niedziela',
    period: 'sierpień 2026',
    note: {
      pl: 'Narracja zamiast siatki projektów — cała strona zbudowana wokół jednego zdania o oddawaniu wolnego czasu właścicielowi firmy.',
      en: 'Narrative instead of a project grid — the whole page built around a single sentence about giving a business owner their weekend back.',
    },
  },
  {
    href: '/v3.html',
    name: 'Rój',
    period: 'sierpień 2026',
    note: {
      pl: 'Scena Three.js z rojem agentów reagującym na scroll. Techniczne studium tego, jak daleko można pociągnąć tło, zanim zacznie przeszkadzać treści.',
      en: 'A Three.js swarm of agents reacting to scroll. A technical study of how far a background can go before it starts fighting the copy.',
    },
  },
  {
    href: '/v2.html',
    name: 'Szkic №1',
    period: 'lipiec 2026',
    note: {
      pl: 'Pierwszy pełny przeprojekt po wersji startowej. Poziomy scroll, karty case study, ciemna paleta.',
      en: 'The first full redesign after the original. Horizontal scroll, case-study cards, a dark palette.',
    },
  },
  {
    href: '/v1.html',
    name: 'Wersja startowa',
    period: 'maj 2026',
    note: {
      pl: 'Punkt wyjścia: konwersyjny landing z cennikiem, procesem i formularzem. Wszystko, co przyszło potem, jest sporem z tą stroną.',
      en: 'The starting point: a conversion landing with pricing, process and a form. Everything since is an argument with this page.',
    },
  },
]
