-- Drop the existing restrictive policy for teams
DROP POLICY IF EXISTS "Authenticated users can view teams" ON public.teams;

-- Create a new policy that allows anyone (including anonymous users) to view teams
CREATE POLICY "Anyone can view teams" 
ON public.teams 
FOR SELECT 
USING (true);