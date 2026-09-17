import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)
ScrollTrigger.config({
  limitCallbacks: true,
  // Phone URL-bar show/hide changes innerHeight. Refreshing a pin against
  // that number yanks scrollY. Touch already defaults this on in GSAP 3.12+,
  // but keep it explicit so a future config merge cannot turn it back off.
  ignoreMobileResize: true,
})

export { gsap, ScrollTrigger, useGSAP }
