import { useEffect, useState } from 'react'
import { useLenis } from '../hooks/useLenis'
import { useReveal } from './useReveal'
import { NavV2 } from './components/NavV2'
import { BentoHero } from './components/BentoHero'
import { MarqueeStrip } from './components/MarqueeStrip'
import { Capabilities } from './components/Capabilities'
import { Deployments } from './components/Deployments'
import { Pipeline } from './components/Pipeline'
import { Proof } from './components/Proof'
import { Console } from './components/Console'
import { FooterV2 } from './components/FooterV2'
import { CommandPalette } from './components/CommandPalette'

export function AppV2() {
  const [cmdOpen, setCmdOpen] = useState(false)

  useLenis()
  useReveal()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmdOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="v2-root relative min-h-screen overflow-x-hidden">
      <div className="v2-grid-bg" aria-hidden />
      <div className="v2-aurora" aria-hidden />

      <NavV2 onOpenCmd={() => setCmdOpen(true)} />

      <main className="relative z-10">
        <BentoHero />
        <MarqueeStrip />
        <Capabilities />
        <Deployments />
        <Pipeline />
        <Proof />
        <Console />
      </main>

      <FooterV2 onOpenCmd={() => setCmdOpen(true)} />

      <div className="v2-scanlines" aria-hidden />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  )
}
