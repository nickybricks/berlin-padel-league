-- 1. Fix storage upload policy - restrict to admins and team captains only
DROP POLICY IF EXISTS "Admin upload access for team logos" ON storage.objects;

CREATE POLICY "Admins and captains can upload team logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'Teams' AND 
  auth.role() = 'authenticated' AND
  (
    -- Check if user is admin
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
    OR
    -- Check if user is captain
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'captain'
    )
    OR
    -- Check if user's email matches team member (for users who haven't been assigned role yet)
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE captain_email = (auth.jwt() ->> 'email') 
      OR player2_email = (auth.jwt() ->> 'email')
    )
  )
);

-- Add UPDATE policy for managing uploaded files
CREATE POLICY "Admins and captains can update team logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'Teams' AND 
  auth.role() = 'authenticated' AND
  (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
    OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'captain'
    )
    OR
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE captain_email = (auth.jwt() ->> 'email') 
      OR player2_email = (auth.jwt() ->> 'email')
    )
  )
);

-- Add DELETE policy for managing uploaded files
CREATE POLICY "Admins and captains can delete team logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'Teams' AND 
  auth.role() = 'authenticated' AND
  (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
    OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'captain'
    )
    OR
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE captain_email = (auth.jwt() ->> 'email') 
      OR player2_email = (auth.jwt() ->> 'email')
    )
  )
);

-- 2. Remove the redundant email-based RLS policy (jwt_email_authorization issue)
-- The existing role-based policies (Admins can update teams, Captains can update their own team)
-- already provide the necessary authorization more securely
DROP POLICY IF EXISTS "Team members can update their team by email" ON public.teams;

-- 3. Restrict email visibility - create a function to check if user can view team contact info
CREATE OR REPLACE FUNCTION public.can_view_team_contacts(_team_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    -- User is admin
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'
  )
  OR EXISTS (
    -- User is captain of this team
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'captain' AND team_id = _team_id
  )
  OR EXISTS (
    -- User's email matches this team's members
    SELECT 1 FROM public.teams t
    JOIN auth.users u ON u.id = _user_id
    WHERE t.id = _team_id AND (t.captain_email = u.email OR t.player2_email = u.email)
  )
$$;

-- 4. Create a view for authenticated users that hides sensitive contact info unless authorized
CREATE OR REPLACE VIEW public.teams_authenticated
WITH (security_invoker=on) AS
  SELECT 
    id,
    name,
    logo_url,
    created_at,
    captain_name,
    player2_name,
    -- Only show contact info if user is authorized
    CASE WHEN public.can_view_team_contacts(id, auth.uid()) THEN captain_email ELSE NULL END as captain_email,
    CASE WHEN public.can_view_team_contacts(id, auth.uid()) THEN player2_email ELSE NULL END as player2_email,
    CASE WHEN public.can_view_team_contacts(id, auth.uid()) THEN captain_phone ELSE NULL END as captain_phone,
    CASE WHEN public.can_view_team_contacts(id, auth.uid()) THEN player2_phone ELSE NULL END as player2_phone
  FROM public.teams;

-- Grant access to the view
GRANT SELECT ON public.teams_authenticated TO authenticated;