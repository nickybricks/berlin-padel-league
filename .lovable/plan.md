

# Playtomic Integration Plan

## Overview
Add a Playtomic court availability feature: admins configure Playtomic venues, an edge function proxies the API, and a new page shows available slots with filters. Users book via external Playtomic link.

## Step 1: Database table `playtomic_venues`

Create migration:
```sql
CREATE TABLE playtomic_venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  city TEXT DEFAULT 'Berlin',
  country TEXT DEFAULT 'Deutschland',
  playtomic_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE playtomic_venues ENABLE ROW LEVEL SECURITY;

-- Read: league members
CREATE POLICY "League members can view playtomic venues"
  ON playtomic_venues FOR SELECT TO authenticated
  USING (is_league_member(auth.uid(), league_id));

-- Write: league admins only
CREATE POLICY "League admins can insert playtomic venues"
  ON playtomic_venues FOR INSERT TO authenticated
  WITH CHECK (is_league_admin(auth.uid(), league_id));

CREATE POLICY "League admins can update playtomic venues"
  ON playtomic_venues FOR UPDATE TO authenticated
  USING (is_league_admin(auth.uid(), league_id));

CREATE POLICY "League admins can delete playtomic venues"
  ON playtomic_venues FOR DELETE TO authenticated
  USING (is_league_admin(auth.uid(), league_id));
```

## Step 2: Admin UI for Playtomic Venues

Create `src/components/playtomic/AdminPlaytomicVenues.tsx` -- CRUD component modeled after `AdminVenueManager.tsx`:
- List of configured Playtomic venues (name, tenant_id, city, URL)
- Add/Edit dialog with fields: Name, Tenant-ID, Stadt, Land, Playtomic-URL
- Delete with confirmation

Create `src/hooks/usePlaytomicVenues.ts` -- TanStack Query hooks for the `playtomic_venues` table.

Add the component to `LeagueAdmin.tsx` below the existing settings cards.

## Step 3: Edge Function `fetch-playtomic-slots`

Create `supabase/functions/fetch-playtomic-slots/index.ts`:
- CORS headers as required
- Accept POST with `{ tenant_id, date }`
- Fetch `GET https://api.playtomic.io/v1/availability?sport_id=PADEL&tenant_id={tenant_id}&start_min={date}T00:00:00&start_max={date}T23:59:59`
- Return the JSON response directly
- Add `verify_jwt = false` to `config.toml`

## Step 4: New Page `/league/:id/playtomic`

Create `src/pages/PlaytomicSearch.tsx`:

**Filter bar (top):**
- Club dropdown (from `playtomic_venues` of the league)
- Date picker (default: today, max 14 days ahead) using shadcn Calendar in Popover
- Optional time range filter (von/bis inputs)

**Results area:**
- Call edge function when club + date selected
- Display slots as shadcn Cards grouped by court (resource_id)
- Each slot shows: time, duration, price
- "Bei Playtomic buchen" button opens venue's `playtomic_url` in new tab
- Loading spinner during fetch
- Empty state: "Keine freien Plätze gefunden"

Add route in `App.tsx`: `<Route path="playtomic" element={<PlaytomicSearch />} />`

## Step 5: Navigation

Add nav item in `Header.tsx` navItems array:
```typescript
{ label: 'Plätze finden', path: `/league/${leagueId}/playtomic` }
```
Positioned after "Platzbuchungen".

## Files to create/modify

| Action | File |
|--------|------|
| Create | `src/hooks/usePlaytomicVenues.ts` |
| Create | `src/components/playtomic/AdminPlaytomicVenues.tsx` |
| Create | `supabase/functions/fetch-playtomic-slots/index.ts` |
| Create | `src/pages/PlaytomicSearch.tsx` |
| Modify | `src/pages/LeagueAdmin.tsx` (add AdminPlaytomicVenues) |
| Modify | `src/App.tsx` (add route) |
| Modify | `src/components/layout/Header.tsx` (add nav item) |
| Modify | `DECISIONS.md` (document feature) |
| Migration | `playtomic_venues` table + RLS |

