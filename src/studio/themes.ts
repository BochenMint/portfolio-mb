export type ThemeId =
  | 'swiss'
  | 'v1'
  | 'v2'
  | 'v3'
  | 'v5'
  | 'pixel'
  | 'massive'
  | 'glass'
  | 'liquid'
  | 'retro'
  | 'brutal'

export type ThemeGroup = 'archive' | 'signature' | 'now'

export type ThemeDef = {
  id: ThemeId
  group: ThemeGroup
  label: string
  catalog: string
  note: string
  fonts: string
}

export const THEME_STORAGE_KEY = 'mb-visual-direction'

export const themes: ThemeDef[] = [
  {
    id: 'swiss',
    group: 'now',
    label: 'Swiss Editorial',
    catalog: 'Typografia i siatka',
    note: 'Hierarchia bez ozdób. Najczytelniejszy kierunek sprzedażowy.',
    // Self-hosted (see /fonts/studio-404.css): this is the default theme for
    // studio.html/-en/-ua, so it must not re-add the Google Fonts CDN link
    // ThemeProvider injects on every mount and undo the static <head> fix.
    fonts: '/fonts/studio-404.css',
  },
  {
    id: 'liquid',
    group: 'now',
    label: 'Liquid Glass',
    catalog: 'Światło i przestrzeń',
    note: 'Jasne pole, subtelne refrakcje. Bez ozdobników.',
    fonts: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap',
  },
  {
    id: 'v3',
    group: 'now',
    label: 'V3',
    catalog: 'Las i złoto',
    note: 'Cięte płaszczyzny, plisy świetlne, pole za szkłem.',
    fonts:
      'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Instrument+Serif:ital@0;1&display=swap',
  },
  {
    id: 'glass',
    group: 'now',
    label: 'Glassmorphism',
    catalog: 'Panel operacyjny',
    note: 'Ciemne tło, nasycone źródła światła za matowymi taflami.',
    fonts:
      'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap',
  },
  {
    id: 'retro',
    group: 'now',
    label: 'Retrofuturism',
    catalog: 'Horyzont i neon',
    note: 'Perspektywa, zachód słońca, interfejs z epoki wczesnej cyfryzacji.',
    fonts:
      'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap',
  },
  {
    id: 'brutal',
    group: 'now',
    label: 'Neo-brutalism',
    catalog: 'Typografia przemysłowa',
    note: 'Swiss-industrial: siatka, kontrast, bez naklejek i przesady.',
    fonts:
      'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600;700&display=swap',
  },
  {
    id: 'pixel',
    group: 'signature',
    label: 'Pixel Art',
    catalog: 'Stacja robocza MB',
    note: 'Raster i gęstość operatorska — nie zabawka.',
    fonts:
      'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Press+Start+2P&family=VT323&display=swap',
  },
  {
    id: 'massive',
    group: 'signature',
    label: 'Massive Effects',
    catalog: 'Kokpit i hangar',
    note: 'Wejście przez scenę 3D. Oferta w tym samym zakresie treści.',
    fonts:
      'https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap',
  },
  {
    id: 'v1',
    group: 'archive',
    label: 'V1',
    catalog: 'Editorial ciemny',
    note: 'Serif, kadr filmowy, wolna oś narracji.',
    fonts:
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Outfit:wght@400;500;600&display=swap',
  },
  {
    id: 'v2',
    group: 'archive',
    label: 'V2',
    catalog: 'Konsola operatorska',
    note: 'Gęstość informacji, siatka, bez kostiumu terminala.',
    fonts:
      'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap',
  },
  {
    id: 'v5',
    group: 'archive',
    label: 'V5 VOLT',
    catalog: 'Kampania chromatyczna',
    note: 'Tangerine, acid, skala plakatu.',
    fonts:
      'https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Manrope:wght@400;500;600;700&display=swap',
  },
]

export const themeById = Object.fromEntries(themes.map((t) => [t.id, t])) as Record<ThemeId, ThemeDef>

export const defaultThemeId: ThemeId = 'swiss'

export function isThemeId(value: string | null | undefined): value is ThemeId {
  return Boolean(value && value in themeById)
}
