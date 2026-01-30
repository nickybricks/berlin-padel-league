-- Add RLS policy to allow team members (by email) to update their team
CREATE POLICY "Team members can update their team by email"
ON public.teams
FOR UPDATE
USING (
  (auth.jwt() ->> 'email') = captain_email OR 
  (auth.jwt() ->> 'email') = player2_email
)
WITH CHECK (
  (auth.jwt() ->> 'email') = captain_email OR 
  (auth.jwt() ->> 'email') = player2_email
);