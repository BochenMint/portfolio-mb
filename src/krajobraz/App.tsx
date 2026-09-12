import { GardenStage } from './components/GardenStage'
import { Footer } from './components/Footer'
import { LeafMarker } from './components/LeafMarker'
import { contactContent, offerContent } from './content'
import { ContactSection, OfferSections } from '../stage/Sections'

export default function App() {
  return (
    <>
      <main>
        <GardenStage />
        <OfferSections content={offerContent} marker={<LeafMarker />} />
        <ContactSection content={contactContent} marker={<LeafMarker />} />
      </main>
      <Footer />
    </>
  )
}
