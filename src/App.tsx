import { useCallback, useState } from 'react'
import { Contact } from './components/Contact'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Nav } from './components/Nav'
import { Preloader } from './components/Preloader'
import { Process } from './components/Process'
import { Services } from './components/Services'
import { Work } from './components/Work'
import { useIntroAnimations } from './hooks/useIntroAnimations'
import { useLenis } from './hooks/useLenis'

function App() {
  const [ready, setReady] = useState(false)
  const onLoaded = useCallback(() => setReady(true), [])

  useLenis()
  useIntroAnimations(ready)

  return (
    <>
      {!ready && <Preloader onComplete={onLoaded} />}
      <div className={`noise transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}>
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <Work />
          <Services />
          <Process />
          <Contact />
        </main>
      </div>
    </>
  )
}

export default App
