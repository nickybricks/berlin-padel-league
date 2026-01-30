-- Drop the existing public policy
DROP POLICY IF EXISTS "Anyone can view teams" ON public.teams;

-- Create a policy that only allows authenticated users to view full team data
CREATE POLICY "Authenticated users can view teams"
ON public.teams FOR SELECT
TO authenticated
USING (true);

-- Create a public view for non-sensitive team data (for unauthenticated users like schedule display)
CREATE VIEW public.teams_public
WITH (security_invoker=on) AS
  SELECT id, name, logo_url, created_at
  FROM public.teams;

-- Allow anonymous access to the public view
GRANT SELECT ON public.teams_public TO anon;
GRANT SELECT ON public.teams_public TO authenticated;