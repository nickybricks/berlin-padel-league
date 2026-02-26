
-- DELETE policy for Admins on matches table
CREATE POLICY "Admins can delete matches"
  ON public.matches FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));
