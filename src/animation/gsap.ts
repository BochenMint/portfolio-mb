import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ limitCallbacks: true })

export { gsap, ScrollTrigger }
