
-- Allow league admins to delete their league
CREATE POLICY "League admins can delete their league"
ON public.leagues
FOR DELETE
TO authenticated
USING (is_league_admin(auth.uid(), id));

-- Cascade: delete league_members when league is deleted
ALTER TABLE public.league_members
DROP CONSTRAINT IF EXISTS league_members_league_id_fkey;

ALTER TABLE public.league_members
ADD CONSTRAINT league_members_league_id_fkey
FOREIGN KEY (league_id) REFERENCES public.leagues(id) ON DELETE CASCADE;
