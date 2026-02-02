-- Create enum for league member roles
CREATE TYPE public.league_role AS ENUM ('admin', 'player');

-- Create leagues table
CREATE TABLE public.leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  invite_token TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create league_members table
CREATE TABLE public.league_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES public.leagues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role league_role NOT NULL DEFAULT 'player',
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(league_id, user_id)
);

-- Add league_id to teams table
ALTER TABLE public.teams ADD COLUMN league_id UUID REFERENCES public.leagues(id) ON DELETE SET NULL;

-- Enable RLS on new tables
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_members ENABLE ROW LEVEL SECURITY;

-- Security definer function to check league membership
CREATE OR REPLACE FUNCTION public.is_league_member(_user_id UUID, _league_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.league_members
    WHERE user_id = _user_id AND league_id = _league_id
  )
$$;

-- Security definer function to check league admin
CREATE OR REPLACE FUNCTION public.is_league_admin(_user_id UUID, _league_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.league_members
    WHERE user_id = _user_id AND league_id = _league_id AND role = 'admin'
  )
$$;

-- Security definer function to get user's leagues
CREATE OR REPLACE FUNCTION public.get_user_leagues(_user_id UUID)
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT league_id FROM public.league_members WHERE user_id = _user_id
$$;

-- RLS Policies for leagues
CREATE POLICY "Anyone can view leagues by code or token"
ON public.leagues FOR SELECT
USING (true);

CREATE POLICY "League admins can update their league"
ON public.leagues FOR UPDATE
USING (is_league_admin(auth.uid(), id));

CREATE POLICY "Authenticated users can create leagues"
ON public.leagues FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

-- RLS Policies for league_members
CREATE POLICY "Users can view members of their leagues"
ON public.league_members FOR SELECT
USING (
  league_id IN (SELECT get_user_leagues(auth.uid()))
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can join leagues"
ON public.league_members FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
);

CREATE POLICY "League admins can update members"
ON public.league_members FOR UPDATE
USING (is_league_admin(auth.uid(), league_id));

CREATE POLICY "League admins can remove members"
ON public.league_members FOR DELETE
USING (
  is_league_admin(auth.uid(), league_id) 
  OR user_id = auth.uid()
);

-- Update teams RLS to include league context (keep existing + add league visibility)
DROP POLICY IF EXISTS "Anyone can view teams" ON public.teams;
CREATE POLICY "Anyone can view teams in public leagues or own leagues"
ON public.teams FOR SELECT
USING (
  league_id IS NULL 
  OR league_id IN (SELECT get_user_leagues(auth.uid()))
  OR has_role(auth.uid(), 'admin'::app_role)
  OR auth.uid() IS NULL -- Allow public viewing for landing page
);

-- Create default Berlin Padel Liga and migrate existing data
INSERT INTO public.leagues (id, name, code, created_by)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Berlin Padel Liga',
  'BPL2025',
  NULL
);

-- Assign all existing teams to Berlin Padel Liga
UPDATE public.teams SET league_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- Migrate existing users to the default league based on their team membership
INSERT INTO public.league_members (league_id, user_id, role, team_id)
SELECT 
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  ur.user_id,
  CASE WHEN ur.role = 'admin' THEN 'admin'::league_role ELSE 'player'::league_role END,
  ur.team_id
FROM public.user_roles ur
WHERE ur.user_id IS NOT NULL
ON CONFLICT (league_id, user_id) DO NOTHING;