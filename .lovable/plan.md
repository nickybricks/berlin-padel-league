

# FeatureShowcase: Vertical Beam with Scroll-Tracking Glowing Ball

## Concept
Replace the sticky side-nav menu with a vertical glowing "beam" (thin line) running down the left side of the feature section. At each feature card, a node/dot sits centered vertically next to the card. A glowing ball travels down the beam as the user scrolls, passing through each feature node.

## Layout Change

```text
  ┌─ Beam (2px line) ──── Feature Card 1 ────────────┐
  │       ●─────────────  [text + screenshot]         │
  │       │                                           │
  │       │                                           │
  │       ●─────────────  Feature Card 2              │
  │       │               [text + screenshot]         │
  │       │                                           │
  │       ●─────────────  Feature Card 3              │
  │       │                                           │
  │       ●─────────────  Feature Card 4              │
  └───────────────────────────────────────────────────┘
  
  ◉ = glowing ball that moves with scroll progress
```

## Implementation Details

**1. Replace side-nav with beam column (desktop)**
- Remove the sticky side-nav `div` with buttons
- Add a narrow column (~60px) on the left containing:
  - A vertical line (2px wide, `bg-primary-foreground/10`) spanning the full height of all feature blocks
  - 4 node dots positioned at each feature card's vertical center
  - Feature label text next to each node

**2. Glowing ball animation**
- Use Framer Motion's `useScroll` on the feature section container to get `scrollYProgress` (0 to 1)
- Use `useTransform` to map scroll progress to the ball's `top` position (from first node to last node)
- Ball: ~12px circle with `bg-accent`, `box-shadow` glow effect (`0 0 12px accent, 0 0 24px accent/50`)
- Ball is `position: absolute` within the beam column

**3. Node dots**
- Each node: 8px circle, default `bg-primary-foreground/20`
- When the ball passes through (based on scroll progress thresholds), the node lights up to `bg-accent` with a glow
- Use `useTransform` to derive which nodes are "passed" based on scroll progress

**4. Mobile**
- Hide beam column on mobile (same as current side-nav behavior)
- Features stack vertically without the beam

## Files Changed
- `src/components/landing/FeatureShowcase.tsx` — full rewrite of the left column, add scroll-tracking logic

