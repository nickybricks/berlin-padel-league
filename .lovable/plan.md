

## Modern 2026 Landing Page — Apple-inspired, Conversion-focused

### Current State
The landing page (`Home.tsx`) is minimal: a floating header pill + a demo embed section. It lacks hero impact, social proof, feature highlights, and conversion-optimized CTAs.

### Design Direction
A premium, scroll-driven landing page with large rounded containers, generous whitespace, soft gradients, and subtle animations. Apple-like aesthetic: oversized typography, bento grid features, glassmorphism cards, and placeholder imagery.

### Page Structure

```text
┌─────────────────────────────────────────┐
│  Floating Nav Island (existing)         │
├─────────────────────────────────────────┤
│  HERO — Full-viewport                   │
│  • Oversized headline (60-80px)         │
│  • Subline + 2 pill CTAs               │
│  • Floating UI mockup with glow        │
├─────────────────────────────────────────┤
│  SOCIAL PROOF BAR                       │
│  • "500+ Spieler" "50+ Ligen" etc.     │
├─────────────────────────────────────────┤
│  BENTO FEATURE GRID (2x2 + 1 wide)     │
│  • Tabelle / Spielplan / Ergebnisse     │
│  • Buchungen / Playoffs                 │
│  • Each with icon, title, placeholder   │
├─────────────────────────────────────────┤
│  INTERACTIVE DEMO (existing embed)      │
│  • Reuse DemoEmbed component            │
├─────────────────────────────────────────┤
│  HOW IT WORKS — 3 steps                │
│  • Erstellen → Einladen → Spielen      │
├─────────────────────────────────────────┤
│  FINAL CTA — large rounded card        │
│  • "Starte jetzt deine Liga"           │
│  • Register button                      │
├─────────────────────────────────────────┤
│  Footer                                 │
└─────────────────────────────────────────┘
```

### Technical Approach

**Single file rewrite: `src/pages/Home.tsx`**

- Keep the existing floating nav island header
- Keep the `DemoEmbed` component import and usage
- All new sections built with Tailwind utility classes — no new dependencies
- Placeholder images via gradient `div`s with icons (no external images needed)
- Bento grid: CSS Grid with `rounded-3xl` cards, subtle borders, soft shadows
- Hero: large `text-5xl md:text-7xl` headline, gradient accent text, floating mockup preview with `shadow-glow`
- Animations: use existing `animate-fade-in`, `animate-slide-up` utilities from `index.css`
- Stats counter bar with large numbers + labels
- "How it works" as 3 numbered pill-cards
- Final CTA as a full-width gradient card with centered content
- Fully responsive (mobile-first), leveraging existing design tokens

No database changes, no new components — just a single page rewrite using existing UI primitives and design system tokens.

