

# Next-Level Landing Page Upgrades

Your current page is already solid (parallax, bento grid, marquee, shimmer CTA). Here are the upgrades that would genuinely elevate it beyond what you have:

## Tier 1: High-Impact Visual Upgrades

### 1. Scroll-Driven Hero Zoom-Out Reveal
Instead of a simple parallax, make the hero mockup start **zoomed in and slightly blurred**, then as the user scrolls, it scales down and sharpens — revealing the full app interface. This is the signature Apple product-page technique (iPhone/MacBook reveals). Uses `useScroll` + `useTransform` for scale, blur, and border-radius transitions.

### 2. Animated Counter (Social Proof)
The stats (500+, 50+, 2.000+) currently appear as static text. Replace with a **counting-up animation** that ticks from 0 to the target number when scrolling into view. Simple `useInView` + requestAnimationFrame counter. Makes the numbers feel alive.

### 3. Gradient Mesh Background
Replace the single blur blob with a **multi-point animated gradient mesh** — 3-4 colored blobs that slowly drift and morph behind the hero. CSS `@keyframes` with position/scale changes on absolute-positioned divs. Creates depth without performance cost.

### 4. Bento Cards with Hover Lift + Glow
Add a subtle **border-glow effect** on hover — the card border shifts to accent color with a soft glow shadow, and the card lifts slightly (`scale(1.02)`). Uses `whileHover` from Framer Motion. Makes the grid feel interactive and premium.

## Tier 2: Structural Upgrades

### 5. Video/GIF Hero Instead of Static Mockup
Record a 10-second screen capture of the actual app in action (entering a result, table updating) and display it as a looping video inside the browser mockup frame. Nothing sells a product better than seeing it work. The `AnimatedHeroMockup` div-based approach is clever but limited.

### 6. Testimonial Section with Photos
Add a section between Demo and CTA with 2-3 testimonial cards featuring avatar photos, names, club names, and quotes. Even placeholder/fictional ones add credibility. Carousel or staggered grid layout.

### 7. Sticky Nav Background Transition
The floating nav currently has a fixed `bg-card/70`. Add a scroll listener that makes it **fully transparent at top**, then transitions to the glassmorphism background after scrolling past the hero. Subtle but polished detail.

## Tier 3: Micro-Details

### 8. Cursor Glow Effect on Hero
A subtle radial gradient that follows the mouse cursor in the hero section. Pure CSS with `onMouseMove` updating a CSS custom property. Adds interactivity without being distracting.

---

## Implementation Plan

| File | Changes |
|------|---------|
| `Home.tsx` | Scroll-driven zoom-out for mockup, animated counters, gradient mesh blobs, sticky nav opacity transition, cursor glow |
| `AnimatedHeroMockup.tsx` | Scale/blur transforms driven by parent scroll progress |
| `BentoGrid.tsx` | `whileHover` scale + glow border on cards |
| New: `TestimonialSection.tsx` | 3 testimonial cards with avatars and quotes |
| `index.css` | Gradient mesh keyframes, cursor glow CSS variable |

All changes use existing Framer Motion dependency. No new libraries needed. The video hero (item 5) would require a screen recording asset from you.

