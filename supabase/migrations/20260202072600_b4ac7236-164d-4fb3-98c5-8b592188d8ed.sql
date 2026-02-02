-- Drop the existing policy
DROP POLICY IF EXISTS "Users can join leagues" ON public.league_members;

-- Recreate with explicit TO authenticated and simpler check
CREATE POLICY "Users can join leagues" 
ON public.league_members 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());