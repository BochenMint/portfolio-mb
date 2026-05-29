import { About } from './components/About'
import { Contact } from './components/Contact'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { ProjectStories } from './components/ProjectStories'
import { Work } from './components/Work'
import { useKeyboardNav } from './hooks/useKeyboardNav'
import { useLenis } from './hooks/useLenis'
import { useScrollAnimations } from './hooks/useScrollAnimations'

function App() {
  useLenis()
  useScrollAnimations()
  useKeyboardNav()

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Przejdź do treści
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Work />
        <ProjectStories />
        <About />
        <Contact />
      </main>
    </>
  )
}

export default App
