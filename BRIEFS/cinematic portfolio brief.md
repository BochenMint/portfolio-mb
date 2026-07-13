# PROJECT BRIEF: Next-Gen AI & Full-Stack Developer Portfolio

## 1. Project Overview & Context
You are tasked with building a premium, high-converting portfolio website for an Elite Full-Stack & AI Automation Developer. The target audience includes tech-savvy founders, CTOs, and high-budget enterprises looking for end-to-end products (Web, Mobile iOS/Android, and AI/Agentic Automations).

The website must feel cinematic, highly interactive, and focus on **visualizing the invisible** (backend code & AI logic) using a modern Bento Grid layout and cinematic video assets generated via Higgsfield Plus.

### Core Tech Stack
- **Framework:** Next.js (App Router, React 19, TypeScript)
- **Styling:** Tailwind CSS + Custom CSS Variables for gradients
- **Animations:** Framer Motion (smooth entrance, hover states, layout animations)
- **Icons:** Lucide React
- **Media:** Next-video or optimized native HTML5 video tags with aggressive lazy loading.

---

## 2. Design System & UX Guidelines
- **Theme:** Ultra-dark mode premium (`bg-neutral-950`, `text-neutral-50`).
- **Accent Colors:** Electric Emerald (`#10b981`) and Cyber Purple (`#a855f7`) to represent coding and AI intelligence.
- **Bento Grid Style:** Sharp rounded corners (`rounded-3xl`), subtle glassmorphism borders (`border-neutral-800/50 bg-neutral-900/40 backdrop-blur-md`), and sophisticated hover glow effects.
- **Performance Budget:** Core Web Vitals must be maximized. Videos must have `muted`, `autoPlay`, `loop`, `playsInline` and `preload="none"` (until in viewport).

---

## 3. Architecture & Page Layout (Single-Page App)

### Section 1: Hero Header (`/components/Hero.tsx`)
- **Left:** Minimalist, bold typography statement: "I build software that thinks, scales, and automates."
- **Right:** A floating 3D-like preview widget or a looping ambient 4K video showing code transforming into user interfaces.

### Section 2: The Core Bento Grid (`/components/BentoGrid.tsx`)
Create a responsive grid layout (`grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6`). Each card represents a unique leverage point:

#### Card A (2x2): Web & Web Apps Showcase
- **Content:** Video thumbnail from Higgsfield Plus showing a slick dashboard UI in active motion.
- **Interactions:** On hover, reveal tech tags (Next.js, WebSockets, Go) and a dynamic "Launch App" arrow.

#### Card B (2x1): Mobile App Development (iOS/Android)
- **Content:** iPhone mockup overlaying a cinematic background. Smooth scroll entry.
- **Tech tags:** React Native, Flutter, Swift, Kotlin.

#### Card C (1x2): AI Automation Lab (The "Invisible" Work)
- **Visual:** A flowing node-graph animation or code execution simulator.
- **Live Counter:** A counter component ticking up: "Total hours saved for clients: 12,450h".
- **Concept:** Demonstrates automated AI workflows (LLMs, CrewAI, Make, LangChain).

#### Card D (1x1): Higgsfield-Powered Dynamic Video Card
- **Content:** A card dedicated to showing *how* you use AI video generation to boost product marketing. High-fidelity cinematic asset looping.
- **Text:** "AI-Driven Marketing Upsell: Products that code and sell themselves."

#### Card E (1x1): Live AI Widget (Interactive Proof)
- **Feature:** A small client-side interactive input: "Enter your business niche". 
- **Action:** Clicking "Generate Blueprint" triggers a mock/simulated AI response spitting out a custom automation idea + a generated video prompt concept.

---

## 4. Key Components Technical Specifications

### `BentoCard.tsx` (Wrapper Component)
Implement a premium magnetic mouse hover effect where a subtle border gradient follows the user's cursor inside the card bounding rect.
```typescript
// Requirements:
// - Use Framer Motion for presence and state changes.
// - Implement Intersection Observer for trigger-on-scroll animations.
// - Support lazy-loaded background video streams.