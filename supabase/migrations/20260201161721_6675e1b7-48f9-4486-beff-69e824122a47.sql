-- 1. Create venue_courts table for fixed courts per venue
CREATE TABLE public.venue_courts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID NOT NULL REFERENCES public.padel_venues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (venue_id, name)
);

-- Enable RLS on venue_courts
ALTER TABLE public.venue_courts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for venue_courts
CREATE POLICY "Anyone can view venue courts"
ON public.venue_courts FOR SELECT
USING (true);

CREATE POLICY "Admins can insert venue courts"
ON public.venue_courts FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update venue courts"
ON public.venue_courts FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete venue courts"
ON public.venue_courts FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Add unique constraint to court_slots to prevent duplicates
ALTER TABLE public.court_slots
ADD CONSTRAINT unique_court_slot UNIQUE (venue_id, court_name, slot_date, start_time);

-- 3. Create booking_export_settings table (singleton pattern)
CREATE TABLE public.booking_export_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_emails TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on booking_export_settings
ALTER TABLE public.booking_export_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for booking_export_settings
CREATE POLICY "Anyone can view export settings"
ON public.booking_export_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can insert export settings"
ON public.booking_export_settings FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update export settings"
ON public.booking_export_settings FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default row for singleton pattern
INSERT INTO public.booking_export_settings (recipient_emails, is_active)
VALUES ('{}', false);