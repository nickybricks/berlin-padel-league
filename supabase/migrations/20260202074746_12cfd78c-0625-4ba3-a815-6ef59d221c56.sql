-- Fix linter: avoid security-definer views by using security_invoker
DROP VIEW IF EXISTS public.teams_authenticated;
DROP VIEW IF EXISTS public.teams_public;

CREATE VIEW public.teams_public
WITH (security_invoker=on) AS
SELECT
  id,
  league_id,
  name,
  logo_url,
  created_at,
  player1_name,
  player2_name
FROM public.teams;

-- Reliable join: perform team-slot assignment + league join server-side
CREATE OR REPLACE FUNCTION public.join_league_team(
  _league_id uuid,
  _team_id uuid,
  _player_name text,
  _player_phone text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_user_id uuid;
  v_email text;
  v_team record;
  v_slot text;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT u.email INTO v_email
  FROM auth.users u
  WHERE u.id = v_user_id;

  IF v_email IS NULL THEN
    RAISE EXCEPTION 'User email not found';
  END IF;

  -- Validate league exists
  PERFORM 1 FROM public.leagues l WHERE l.id = _league_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'League not found';
  END IF;

  -- Validate team belongs to league and lock the row
  SELECT * INTO v_team
  FROM public.teams t
  WHERE t.id = _team_id AND t.league_id = _league_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Team not found in league';
  END IF;

  -- Determine slot
  IF v_team.player1_email = v_email THEN
    v_slot := 'player1';
  ELSIF v_team.player2_email = v_email THEN
    v_slot := 'player2';
  ELSIF v_team.player1_email IS NULL THEN
    v_slot := 'player1';
  ELSIF v_team.player2_email IS NULL THEN
    v_slot := 'player2';
  ELSE
    RAISE EXCEPTION 'Team is full';
  END IF;

  -- Update team details for chosen slot
  IF v_slot = 'player1' THEN
    UPDATE public.teams
    SET
      player1_name = NULLIF(trim(coalesce(_player_name, '')), ''),
      player1_phone = NULLIF(trim(coalesce(_player_phone, '')), ''),
      player1_email = v_email
    WHERE id = _team_id;
  ELSE
    UPDATE public.teams
    SET
      player2_name = NULLIF(trim(coalesce(_player_name, '')), ''),
      player2_phone = NULLIF(trim(coalesce(_player_phone, '')), ''),
      player2_email = v_email
    WHERE id = _team_id;
  END IF;

  -- Join league (idempotent)
  IF NOT EXISTS (
    SELECT 1
    FROM public.league_members lm
    WHERE lm.league_id = _league_id AND lm.user_id = v_user_id
  ) THEN
    INSERT INTO public.league_members (league_id, user_id, role, team_id)
    VALUES (_league_id, v_user_id, 'player', _team_id);
  END IF;

  -- Ensure app role is 'player' with team_id (do not downgrade admins)
  IF NOT public.has_role(v_user_id, 'admin'::app_role) THEN
    IF EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = v_user_id) THEN
      UPDATE public.user_roles
      SET role = 'player', team_id = _team_id
      WHERE user_id = v_user_id AND role <> 'admin';
    ELSE
      INSERT INTO public.user_roles (user_id, role, team_id)
      VALUES (v_user_id, 'player', _team_id);
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'user_id', v_user_id,
    'team_id', _team_id,
    'league_id', _league_id,
    'slot', v_slot
  );
END;
$$;

REVOKE ALL ON FUNCTION public.join_league_team(uuid, uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.join_league_team(uuid, uuid, text, text) TO authenticated;