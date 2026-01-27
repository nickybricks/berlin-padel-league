-- Create storage bucket for team logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('Teams', 'Teams', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to team logos
CREATE POLICY "Public read access for team logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'Teams');

-- Allow authenticated users to upload team logos (admins only via RLS on teams table)
CREATE POLICY "Admin upload access for team logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'Teams' AND auth.role() = 'authenticated');