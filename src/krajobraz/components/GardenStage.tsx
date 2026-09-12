import { BrandMark } from '../../chrome/components/BrandMark'
import { site } from '../../chrome/data/content'
import { ScrollStage } from '../../stage/ScrollStage'
import { createGardenScene } from '../scene/gardenScene'
import { T } from '../scene/timeline'

// Hoisted rather than built inline in the JSX below: `ScrollStage` puts this
// in its scroll-effect's dependency array, and a fresh object literal on
// every render would reopen the WebGL scene on every render.
const TIMELINE = { introHold: T.introHold, introOut: T.introOut, outro: T.outro }

/**
 * The pinned garden, wired onto the shared stage rig: soil → turf → flower
 * headline, generalised into `stage/ScrollStage.tsx` (the pinned section,
 * the observers, the fallback) and `stage/sceneHost.ts` (the three.js
 * plumbing). Everything here is krajobraz's own: its copy, its scene
 * factory, its scroll beats.
 */
export function GardenStage() {
  return (
    <ScrollStage
      id="ogrod"
      className="garden"
      debugHandleName="__garden"
      height="480svh"
      createScene={createGardenScene}
      h1={{
        id: 'garden-title',
        text: 'Zbuduję nową stronę dla Twojej pracowni architektury krajobrazu',
      }}
      brand={{
        href: 'https://marcinbochenek.com/',
        content: (
          <>
            <BrandMark size={26} />
            <span>Marcin Bochenek</span>
          </>
        ),
      }}
      contact={{ href: '#kontakt', label: 'Kontakt' }}
      intro={{
        eyebrow: 'Dla pracowni architektury krajobrazu',
        title: 'Najpierw przygotujmy teren.',
        hint: 'Przewiń — rozłożę trawnik',
      }}
      outro={{
        line: (
          <>
            Strona dla Twojej pracowni: realizacje, oferta i&nbsp;zapytania od klientów w&nbsp;jednym miejscu.
          </>
        ),
        ctaLabel: 'Porozmawiajmy',
        ctaHref: '#kontakt',
        mailHref: `mailto:${site.email}`,
        mailLabel: site.email,
      }}
      timeline={TIMELINE}
    />
  )
}
