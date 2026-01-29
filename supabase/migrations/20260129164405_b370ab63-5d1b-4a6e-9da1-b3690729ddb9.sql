-- Add email columns to teams table
ALTER TABLE public.teams 
ADD COLUMN captain_email text,
ADD COLUMN player2_email text;