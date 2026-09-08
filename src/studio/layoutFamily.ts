import type { ThemeId } from './themes'

export type LayoutFamily =
  | 'editorial'
  | 'optical'
  | 'dashboard'
  | 'workstation'
  | 'cockpit'
  | 'atmospheric'
  | 'campaign'

const families: Record<ThemeId, LayoutFamily> = {
  swiss: 'editorial',
  brutal: 'editorial',
  v1: 'editorial',
  liquid: 'optical',
  glass: 'dashboard',
  v2: 'dashboard',
  pixel: 'workstation',
  massive: 'cockpit',
  retro: 'atmospheric',
  v3: 'atmospheric',
  v5: 'campaign',
}

export function layoutFamily(theme: ThemeId): LayoutFamily {
  return families[theme]
}

export type LowerRhythm = 'numbers' | 'tiles' | 'slabs' | 'ledger'

const rhythms: Record<LayoutFamily, LowerRhythm> = {
  editorial: 'numbers',
  optical: 'ledger',
  dashboard: 'tiles',
  workstation: 'tiles',
  cockpit: 'tiles',
  atmospheric: 'slabs',
  campaign: 'slabs',
}

export function lowerRhythm(family: LayoutFamily): LowerRhythm {
  return rhythms[family]
}

export function sectionRhythmClass(theme: ThemeId): string {
  return `studio-rhythm-${lowerRhythm(layoutFamily(theme))}`
}

export function hasArchiveRhythm(theme: ThemeId): boolean {
  return theme === 'v1' || theme === 'v2' || theme === 'v3' || theme === 'v5'
}
