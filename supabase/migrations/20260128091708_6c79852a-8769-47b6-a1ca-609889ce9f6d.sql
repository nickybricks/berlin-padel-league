-- Allow admins to update teams (for logo uploads)
CREATE POLICY "Admins can update teams"
ON public.teams
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));