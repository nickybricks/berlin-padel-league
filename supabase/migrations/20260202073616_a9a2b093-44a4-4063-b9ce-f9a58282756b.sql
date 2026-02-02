-- Rename captain_* columns to player1_*
ALTER TABLE public.teams RENAME COLUMN captain_name TO player1_name;
ALTER TABLE public.teams RENAME COLUMN captain_email TO player1_email;
ALTER TABLE public.teams RENAME COLUMN captain_phone TO player1_phone;

-- Update the teams_authenticated view to reflect new column names
DROP VIEW IF EXISTS public.teams_authenticated;
CREATE VIEW public.teams_authenticated AS
SELECT 
  id,
  name,
  logo_url,
  created_at,
  player1_name,
  player1_phone,
  player1_email,
  player2_name,
  player2_phone,
  player2_email
FROM public.teams
WHERE auth.uid() IS NOT NULL;

-- Update the teams_public view
DROP VIEW IF EXISTS public.teams_public;
CREATE VIEW public.teams_public AS
SELECT 
  id,
  name,
  logo_url,
  created_at
FROM public.teams;

-- Update the can_view_team_contacts function to use new column names
CREATE OR REPLACE FUNCTION public.can_view_team_contacts(_team_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'player' AND team_id = _team_id
  )
  OR EXISTS (
    SELECT 1 FROM public.teams t
    JOIN auth.users u ON u.id = _user_id
    WHERE t.id = _team_id AND (t.player1_email = u.email OR t.player2_email = u.email)
  )
$$;

-- Update handle_new_user function to use new column names
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  matched_team_id uuid;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  
  -- Check if email matches a team player1 or player2
  SELECT id INTO matched_team_id
  FROM public.teams
  WHERE player1_email = NEW.email OR player2_email = NEW.email
  LIMIT 1;
  
  IF matched_team_id IS NOT NULL THEN
    -- Assign player role with team_id
    INSERT INTO public.user_roles (user_id, role, team_id)
    VALUES (NEW.id, 'player', matched_team_id);
  ELSE
    -- Assign default viewer role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'viewer');
  END IF;
  
  RETURN NEW;
END;
$function$;