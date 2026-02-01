-- Step 2: Migrate existing captain roles and update policies

-- Migrate existing 'captain' roles to 'player'
UPDATE public.user_roles SET role = 'player' WHERE role = 'captain';

-- Update handle_new_user() function to use 'player' instead of 'captain'
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

-- Create is_team_player function
CREATE OR REPLACE FUNCTION public.is_team_player(_user_id uuid, _team_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'player'
      AND team_id = _team_id
  )
$function$;

-- Update can_view_team_contacts to check for 'player' instead of 'captain'
CREATE OR REPLACE FUNCTION public.can_view_team_contacts(_team_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
    WHERE t.id = _team_id AND (t.captain_email = u.email OR t.player2_email = u.email)
  )
$function$;

-- Drop old captain policies for match_results
DROP POLICY IF EXISTS "Captains can insert results for their team matches" ON public.match_results;

-- Create new player policy for match_results
CREATE POLICY "Players can insert results for their team matches"
ON public.match_results
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'player'::app_role) 
  AND EXISTS (
    SELECT 1 FROM matches m
    WHERE m.id = match_results.match_id 
    AND (m.team_a_id = get_user_team(auth.uid()) OR m.team_b_id = get_user_team(auth.uid()))
  )
);

-- Drop old captain policies for court_bookings
DROP POLICY IF EXISTS "Captains can insert bookings for their team matches" ON public.court_bookings;
DROP POLICY IF EXISTS "Captains can delete their own bookings" ON public.court_bookings;

-- Create new player policies for court_bookings
CREATE POLICY "Players can insert bookings for their team matches"
ON public.court_bookings
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'player'::app_role) 
  AND booked_by_team_id = get_user_team(auth.uid())
  AND EXISTS (
    SELECT 1 FROM matches m
    WHERE m.id = court_bookings.match_id 
    AND (m.team_a_id = court_bookings.booked_by_team_id OR m.team_b_id = court_bookings.booked_by_team_id)
  )
);

CREATE POLICY "Players can delete their own bookings"
ON public.court_bookings
FOR DELETE
USING (
  has_role(auth.uid(), 'player'::app_role) 
  AND booked_by_team_id = get_user_team(auth.uid())
);

-- Drop old captain policy for teams
DROP POLICY IF EXISTS "Captains can update their own team" ON public.teams;

-- Create new player policy for teams
CREATE POLICY "Players can update their own team"
ON public.teams
FOR UPDATE
USING (is_team_player(auth.uid(), id))
WITH CHECK (is_team_player(auth.uid(), id));