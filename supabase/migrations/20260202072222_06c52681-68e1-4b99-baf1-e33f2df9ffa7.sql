-- Drop the existing overly complex SELECT policy
DROP POLICY IF EXISTS "Anyone can view teams in public leagues or own leagues" ON public.teams;

-- Create a simple policy allowing anyone to view teams (teams are not sensitive)
CREATE POLICY "Anyone can view teams" 
ON public.teams 
FOR SELECT 
USING (true);