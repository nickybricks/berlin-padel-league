
-- Add league_id to padel_venues
ALTER TABLE public.padel_venues
ADD COLUMN league_id uuid REFERENCES public.leagues(id) ON DELETE CASCADE;

-- Update existing venues: assign to the existing league
UPDATE public.padel_venues
SET league_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
WHERE league_id IS NULL;

-- Make league_id NOT NULL after backfill
ALTER TABLE public.padel_venues
ALTER COLUMN league_id SET NOT NULL;

-- Update RLS policies to be league-scoped
-- Drop old insert policy and recreate with league admin check
DROP POLICY IF EXISTS "Admins can insert venues" ON public.padel_venues;
CREATE POLICY "League admins can insert venues"
ON public.padel_venues
FOR INSERT
TO authenticated
WITH CHECK (is_league_admin(auth.uid(), league_id));

DROP POLICY IF EXISTS "Admins can update venues" ON public.padel_venues;
CREATE POLICY "League admins can update venues"
ON public.padel_venues
FOR UPDATE
TO authenticated
USING (is_league_admin(auth.uid(), league_id));

DROP POLICY IF EXISTS "Admins can delete venues" ON public.padel_venues;
CREATE POLICY "League admins can delete venues"
ON public.padel_venues
FOR DELETE
TO authenticated
USING (is_league_admin(auth.uid(), league_id));
