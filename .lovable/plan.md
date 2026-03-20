

# Landing Page Redesign — LangChain-inspired, Light Theme

## Overview
Complete rebuild of `src/pages/Home.tsx` into a full marketing landing page with 6 sections, modular component architecture, scroll-driven animations using Framer Motion, and a light/bright aesthetic matching the existing design system.

## Architecture

New file structure:
```text
src/pages/Home.tsx                          (orchestrator — imports all sections)
src/components/landing/LandingNav.tsx       (sticky navbar)
src/components/landing/HeroSection.tsx      (headline + CTAs + SVG animation)
src/components/landing/LogoBar.tsx          (social proof strip)
src/components/landing/FeatureShowcase.tsx  (sticky side-nav + 4 feature blocks)
src/components/landing/StatsSection.tsx     (counter numbers)
src/components/landing/CTASection.tsx       (dark CTA block)
src/components/landing/LandingFooter.tsx    (4-column footer)
```

## Section Details

### 1. LandingNav (sticky)
- Floating pill-shaped bar (reuse existing notch pattern, max-w-[991px])
- Left: "BPL" logo icon + "Berlin Padel Liga" text
- Center: anchor links — "So funktioniert's", "Features", "Preise" (smooth-scroll to sections)
- Right: "Log in" (ghost, opens LoginDialog) + "Get Started" (primary, links to /register)
- Becomes opaque on scroll (backdrop-blur + border)

### 2. HeroSection (light bg)
- Large headline: "Deine Padel Liga, organisiert." (Inter bold, ~text-5xl/6xl)
- Subline: "Spielpläne, Tabellen, Platzbuchungen — alles in einer App."
- Two CTA buttons: "Liga erstellen" (primary) + "So funktioniert's" (outline, scrolls to features)
- Below: animated SVG branching paths (4 lines fanning out from center point downward, connecting to feature labels "Liga Setup", "Spielplan", "Tabelle", "Buchungen")
- SVG uses `stroke-dasharray` + CSS animation for draw-in effect
- Light background (`bg-background`)

### 3. LogoBar (light bg)
- Headline: "Vertraut von Padel-Communities in Berlin"
- Row of 6 placeholder venue logos (gray rounded rectangles with text like "Padel Club 1", "Venue 2", etc.)
- Responsive: horizontal scroll on mobile, flex-wrap on desktop
- Subtle opacity treatment (grayscale, opacity-50, hover:opacity-100)

### 4. FeatureShowcase (dark bg — `bg-primary` deep navy)
- Left: sticky vertical mini-nav (4 labels), active one highlighted with accent dot + white text, inactive ones muted
- Right: 4 feature blocks, each ~100vh, containing:
  - Icon (Lucide) + feature label badge
  - Bold headline
  - Paragraph + 3-4 bullet points
  - Placeholder screenshot (rounded-2xl card with gray bg, aspect-video)
  - Optional CTA link
- Scroll-driven: `IntersectionObserver` tracks which section is in view, updates sticky nav
- Features:
  1. **Liga erstellen** — "Erstelle deine Liga in 3 Schritten" / Wizard, Teams, Gruppen
  2. **Spielplan** — "Automatisch generierte Spielpläne" / Round Robin, Gruppen, Hin/Rückrunde
  3. **Live-Tabelle** — "Echtzeit-Tabelle mit Punkten & Satzverhältnis" / Standings, Rankings
  4. **Platzbuchungen** — "Buche Padel-Plätze direkt in der App" / Venues, Slots, Export
- Text is light (`text-primary-foreground`), screenshots float right on desktop, stack on mobile

### 5. StatsSection (light bg)
- Headline: "Berlins wachsende Padel-Community"
- 3 stat counters in a row: "12+ Ligen", "200+ Spieler", "500+ Matches"
- Numbers animate up on scroll into view (Framer Motion `useInView` + `animate`)
- Clean typography, large numbers (~text-5xl), small labels below

### 6. CTASection (dark bg — `bg-primary`)
- Big headline: "Bereit, deine Liga zu starten?"
- Two buttons: "Liga erstellen" (white/accent) + "Kontakt" (outline)
- Supporting text underneath
- Optional decorative SVG element on the left (abstract dots/lines pattern)

### 7. LandingFooter (dark bg)
- 4-column grid:
  - Produkt: Features, Preise, Roadmap
  - Ressourcen: FAQ, Blog, Support
  - Unternehmen: Über uns, Kontakt, Impressum, Datenschutz
  - Newsletter: email input + "Abonnieren" button
- Social icons row (Instagram, LinkedIn)
- Large "BPL" logo text at bottom
- Bottom bar: "Alle Systeme aktiv" (green dot) + legal links
- All links are placeholder `#` for now

## Technical Approach
- **Framer Motion**: `motion.div` with `whileInView` for fade/slide-in animations, `useInView` for counter animation, `useScroll` + `useTransform` for SVG path draw
- **IntersectionObserver**: Native API in FeatureShowcase to track active section for sticky nav
- **LoginDialog**: Reuse existing `LoginDialog` component for "Log in" button
- **Responsive**: Mobile-first. Sticky side-nav hidden on mobile (features stack vertically). Footer collapses to 2-col then 1-col.
- **No new dependencies** — Framer Motion is already installed

## Routing
- No routing changes needed — `Home` already renders at `/`
- Existing `DemoEmbed` is removed from the landing page (still accessible at `/demo`)

