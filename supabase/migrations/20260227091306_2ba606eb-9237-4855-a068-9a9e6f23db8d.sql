ALTER TABLE public.leagues ADD COLUMN home_and_away boolean NOT NULL DEFAULT false;
ALTER TABLE public.leagues ADD COLUMN max_teams integer;