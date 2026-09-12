import { GardenStage } from './components/GardenStage'
import { Offer } from './components/Offer'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <>
      <main>
        <GardenStage />
        <Offer />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
