import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CourtSlotWithDetails } from '@/types/bookings';

export function useCourtSlots(venueId?: string, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['court-slots', venueId, startDate, endDate],
    queryFn: async (): Promise<CourtSlotWithDetails[]> => {
      let query = supabase
        .from('court_slots')
        .select(`
          *,
          venue:padel_venues(*),
          booking:court_bookings(
            *,
            match:matches(
              id,
              team_a:teams!matches_team_a_id_fkey(id, name),
              team_b:teams!matches_team_b_id_fkey(id, name)
            ),
            booked_by_team:teams!court_bookings_booked_by_team_id_fkey(id, name)
          )
        `)
        .order('slot_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (venueId) {
        query = query.eq('venue_id', venueId);
      }
      if (startDate) {
        query = query.gte('slot_date', startDate);
      }
      if (endDate) {
        query = query.lte('slot_date', endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Transform the data - booking comes as an array, take first item
      return (data || []).map(slot => ({
        ...slot,
        booking: slot.booking?.[0] || undefined,
      })) as CourtSlotWithDetails[];
    },
  });
}

export function useCreateCourtSlots() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (slots: Array<{
      venue_id: string;
      court_name: string;
      slot_date: string;
      start_time: string;
      end_time: string;
    }>) => {
      const { data, error } = await supabase
        .from('court_slots')
        .insert(slots)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['court-slots'] });
    },
  });
}

export function useDeleteCourtSlot() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('court_slots')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['court-slots'] });
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (booking: {
      court_slot_id: string;
      match_id: string;
      booked_by_team_id: string;
    }) => {
      const { data, error } = await supabase
        .from('court_bookings')
        .insert(booking)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['court-slots'] });
    },
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('court_bookings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['court-slots'] });
    },
  });
}

// Get unbooked matches for a team
export function useTeamUnbookedMatches(teamId: string | null) {
  return useQuery({
    queryKey: ['team-unbooked-matches', teamId],
    enabled: !!teamId,
    queryFn: async () => {
      if (!teamId) return [];
      
      // Get all matches for this team
      const { data: matches, error: matchError } = await supabase
        .from('matches')
        .select(`
          id,
          week,
          match_type,
          team_a:teams!matches_team_a_id_fkey(id, name),
          team_b:teams!matches_team_b_id_fkey(id, name)
        `)
        .or(`team_a_id.eq.${teamId},team_b_id.eq.${teamId}`)
        .eq('match_type', 'group')
        .order('week');

      if (matchError) throw matchError;

      // Get all booked match IDs
      const { data: bookings, error: bookingError } = await supabase
        .from('court_bookings')
        .select('match_id');

      if (bookingError) throw bookingError;

      const bookedMatchIds = new Set(bookings?.map(b => b.match_id) || []);

      // Filter out already booked matches
      return (matches || []).filter(m => !bookedMatchIds.has(m.id));
    },
  });
}
