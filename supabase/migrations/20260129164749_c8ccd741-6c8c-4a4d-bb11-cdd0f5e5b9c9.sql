-- Update the handle_new_user function to check team membership
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
  
  -- Check if email matches a team captain or player2
  SELECT id INTO matched_team_id
  FROM public.teams
  WHERE captain_email = NEW.email OR player2_email = NEW.email
  LIMIT 1;
  
  IF matched_team_id IS NOT NULL THEN
    -- Assign captain role with team_id
    INSERT INTO public.user_roles (user_id, role, team_id)
    VALUES (NEW.id, 'captain', matched_team_id);
  ELSE
    -- Assign default viewer role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'viewer');
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create function to check if user is captain of a specific team
CREATE OR REPLACE FUNCTION public.is_team_captain(_user_id uuid, _team_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'captain'
      AND team_id = _team_id
  )
$$;

-- Update teams RLS policy to allow captains to update their own team
CREATE POLICY "Captains can update their own team"
ON public.teams
FOR UPDATE
USING (is_team_captain(auth.uid(), id))
WITH CHECK (is_team_captain(auth.uid(), id));