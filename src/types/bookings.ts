export interface Venue {
  id: string;
  name: string;
  address: string | null;
  created_at: string;
}

export interface CourtSlot {
  id: string;
  venue_id: string;
  court_name: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  created_by: string | null;
  created_at: string;
  venue?: Venue;
  booking?: CourtBooking;
}

export interface CourtBooking {
  id: string;
  court_slot_id: string;
  match_id: string;
  booked_by_team_id: string;
  booked_by_user_id: string | null;
  booked_at: string;
}

export interface CourtSlotWithDetails extends CourtSlot {
  venue: Venue;
  booking?: CourtBooking & {
    match?: {
      id: string;
      team_a: { id: string; name: string };
      team_b: { id: string; name: string };
    };
    booked_by_team?: { id: string; name: string };
  };
}
