import { BrandMark } from '../../chrome/components/BrandMark'
import { site } from '../../chrome/data/content'
import { ScrollStage } from '../../stage/ScrollStage'
import { createPaverScene } from '../scene/paverScene'
import { T } from '../scene/timeline'

// Hoisted rather than built inline in the JSX below: `ScrollStage` puts this
// in its scroll-effect's dependency array, and a fresh object literal on
// every render would reopen the WebGL scene on every render.
const TIMELINE = { introHold: T.introHold, introOut: T.introOut, outro: T.outro }

/**
 * The pinned paving job, on the same rig as the garden: screeded bed →
 * herringbone laid far to near → the headline set in darker stone. The rig
 * itself (the pinned section, the observers, the fallback, the three.js
 * host) is `stage/`; everything here is this trade's own.
 */
export function PaverStage() {
  return (
    <ScrollStage
      id="kostka"
      className="paving"
      debugHandleName="__paving"
      height="480svh"
      createScene={createPaverScene}
      h1={{
        id: 'paving-title',
        text: 'Zbuduję nową stronę dla Twojej firmy brukarskiej',
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
        eyebrow: 'Dla firm brukarskich i wykonawców nawierzchni',
        title: 'Najpierw podbudowa.',
        hint: 'Przewiń — ułożę kostkę',
      }}
      outro={{
        line: (
          <>
            Strona dla Twojej firmy: realizacje, wyceny i&nbsp;zapytania od klientów w&nbsp;jednym miejscu.
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
