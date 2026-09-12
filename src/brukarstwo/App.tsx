import { PaverStage } from './components/PaverStage'
import { StoneMarker } from './components/StoneMarker'
import { Footer } from './components/Footer'
import { contactContent, offerContent } from './content'
import { ContactSection, OfferSections } from '../stage/Sections'

export default function App() {
  return (
    <>
      <main>
        <PaverStage />
        <OfferSections content={offerContent} marker={<StoneMarker />} />
        <ContactSection content={contactContent} marker={<StoneMarker />} />
      </main>
      <Footer />
    </>
  )
}
