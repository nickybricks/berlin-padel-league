-- Create padel_venues table (Padelvereine)
CREATE TABLE public.padel_venues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for padel_venues
ALTER TABLE public.padel_venues ENABLE ROW LEVEL SECURITY;

-- RLS Policies for padel_venues
CREATE POLICY "Anyone can view venues" 
ON public.padel_venues FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert venues" 
ON public.padel_venues FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update venues" 
ON public.padel_venues FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete venues" 
ON public.padel_venues FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create court_slots table (Verfügbare Plätze)
CREATE TABLE public.court_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID NOT NULL REFERENCES public.padel_venues(id) ON DELETE CASCADE,
  court_name TEXT NOT NULL,
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for court_slots
ALTER TABLE public.court_slots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for court_slots
CREATE POLICY "Anyone can view slots" 
ON public.court_slots FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert slots" 
ON public.court_slots FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update slots" 
ON public.court_slots FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete slots" 
ON public.court_slots FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create court_bookings table (Buchungen)
CREATE TABLE public.court_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  court_slot_id UUID NOT NULL REFERENCES public.court_slots(id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  booked_by_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  booked_by_user_id UUID REFERENCES auth.users(id),
  booked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(court_slot_id)
);

-- Enable RLS for court_bookings
ALTER TABLE public.court_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for court_bookings
CREATE POLICY "Anyone can view bookings" 
ON public.court_bookings FOR SELECT 
USING (true);

CREATE POLICY "Captains can insert bookings for their team matches" 
ON public.court_bookings FOR INSERT 
WITH CHECK (
  public.has_role(auth.uid(), 'captain') AND 
  booked_by_team_id = public.get_user_team(auth.uid()) AND
  EXISTS (
    SELECT 1 FROM public.matches m
    WHERE m.id = match_id
    AND (m.team_a_id = booked_by_team_id OR m.team_b_id = booked_by_team_id)
  )
);

CREATE POLICY "Admins can insert bookings" 
ON public.court_bookings FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update bookings" 
ON public.court_bookings FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bookings" 
ON public.court_bookings FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Captains can delete their own bookings" 
ON public.court_bookings FOR DELETE 
USING (
  public.has_role(auth.uid(), 'captain') AND 
  booked_by_team_id = public.get_user_team(auth.uid())
);

-- Create indexes for better performance
CREATE INDEX idx_court_slots_venue_id ON public.court_slots(venue_id);
CREATE INDEX idx_court_slots_slot_date ON public.court_slots(slot_date);
CREATE INDEX idx_court_bookings_match_id ON public.court_bookings(match_id);
CREATE INDEX idx_court_bookings_slot_id ON public.court_bookings(court_slot_id);