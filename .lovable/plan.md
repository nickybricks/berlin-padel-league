

## Making the Landing Page More Special — UI/UX Upgrade Ideas

The current page has a solid foundation (floating nav, bento grid, scroll reveals, demo embed). Here are high-impact upgrades to push it into truly premium territory:

### 1. Animated Hero Mockup (replace static list)
The hero mockup currently shows a static standings list. Replace it with a **live-updating animation** — rows that shuffle positions, scores that tick up, a playoff badge that appears. This creates immediate "wow" and demonstrates the product without a click.

### 2. Parallax Depth Layers in Hero
Add subtle `useScroll` + `useTransform` from Framer Motion so the hero headline, badge, and mockup card move at different scroll speeds. The glow blob already there would shift too. Creates a 3D depth illusion Apple frequently uses.

### 3. Bento Cards with Mini Visual Previews
Currently bento cards are icon + text only. Add a small **visual preview** inside each card — a mini standings table, a tiny bracket diagram, a calendar grid, a court map. These would be lightweight SVG/div compositions, not images. Makes each card feel like a product screenshot.

### 4. Marquee Testimonial / Logo Strip
Add a horizontally scrolling marquee strip (infinite scroll, CSS-only or Framer Motion) between the social proof and bento sections. Could show partner logos, club names, or short testimonial quotes. Adds social proof with motion.

### 5. Sticky Section Transitions
As the user scrolls from hero to features, use a subtle **background color shift** (e.g., from slightly warm to neutral) via Framer Motion's `useScroll`. Apple's product pages do this — each section has its own atmosphere.

### 6. "How it Works" with Connected Timeline
Replace the 3 separate cards with a **horizontal connected timeline** — a line connecting the 3 steps with animated dots that fill as they scroll into view. More visual storytelling than isolated cards.

### 7. CTA with Micro-interaction
The final CTA button could have a subtle **shimmer/pulse animation** on hover — a gradient sweep across the button surface. Draws the eye without being distracting.

### 8. Footer Upgrade
Add a proper multi-column footer with links (Impressum, Datenschutz, Kontakt), social icons, and the logo. A single copyright line feels unfinished for a premium page.

---

### Recommended Priority (biggest visual impact first)

| # | Enhancement | Effort |
|---|-------------|--------|
| 1 | Bento cards with mini visual previews | Medium |
| 2 | Animated hero mockup (shuffling rows) | Medium |
| 3 | CTA shimmer button + hover effects | Small |
| 4 | "How it Works" connected timeline | Small |
| 5 | Parallax depth in hero | Small |
| 6 | Marquee strip | Small |
| 7 | Background color transitions | Small |
| 8 | Full footer | Small |

### Technical approach
All changes stay within `Home.tsx` plus potentially one new `AnimatedMockup` component. Uses existing Framer Motion dependency — no new libraries needed. The mini bento previews would be pure Tailwind div compositions (no images).

