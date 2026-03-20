

## Feature Showcase Screenshots

Replace the placeholder boxes in the FeatureShowcase component with the uploaded screenshots.

### Mapping

| Feature | Screenshot |
|---------|-----------|
| Liga Setup | `Screenshot_2026-03-20_at_16.49.29.png` |
| Spielplan | `Screenshot_2026-03-20_at_16.49.44.png` |
| Live-Tabelle | `Screenshot_2026-03-20_at_16.50.15.png` |
| Platzbuchungen | `Screenshot_2026-03-20_at_16.50.44.png` |

### Steps

1. Copy all 4 images to `src/assets/features/` (e.g. `setup.png`, `schedule.png`, `standings.png`, `bookings.png`)
2. Update `FeatureShowcase.tsx`:
   - Import the 4 images as ES6 modules
   - Add an `image` field to each feature object
   - Replace the placeholder `<div>` (the gray box with "Screenshot -- label") with an `<img>` tag using `rounded-2xl border border-primary-foreground/10 overflow-hidden` styling and proper alt text

