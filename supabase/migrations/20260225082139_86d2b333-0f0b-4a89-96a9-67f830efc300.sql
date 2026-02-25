
ALTER TABLE public.leagues
  ADD COLUMN IF NOT EXISTS format_type text NOT NULL DEFAULT 'round_robin',
  ADD COLUMN IF NOT EXISTS group_count integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS playoff_format text NOT NULL DEFAULT 'top8_bracket',
  ADD COLUMN IF NOT EXISTS playoff_qualifiers_per_group integer NOT NULL DEFAULT 4;
