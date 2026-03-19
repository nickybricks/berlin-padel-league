CREATE TABLE playtomic_venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  city TEXT DEFAULT 'Berlin',
  country TEXT DEFAULT 'Deutschland',
  playtomic_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE playtomic_venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "League members can view playtomic venues"
  ON playtomic_venues FOR SELECT TO authenticated
  USING (is_league_member(auth.uid(), league_id));

CREATE POLICY "League admins can insert playtomic venues"
  ON playtomic_venues FOR INSERT TO authenticated
  WITH CHECK (is_league_admin(auth.uid(), league_id));

CREATE POLICY "League admins can update playtomic venues"
  ON playtomic_venues FOR UPDATE TO authenticated
  USING (is_league_admin(auth.uid(), league_id));

CREATE POLICY "League admins can delete playtomic venues"
  ON playtomic_venues FOR DELETE TO authenticated
  USING (is_league_admin(auth.uid(), league_id));