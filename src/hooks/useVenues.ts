import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Venue, VenueCourt } from '@/types/bookings';

export function useVenues(leagueId?: string) {
  return useQuery({
    queryKey: ['venues', leagueId],
    queryFn: async (): Promise<Venue[]> => {
      let query = supabase
        .from('padel_venues')
        .select('*')
        .order('name');

      if (leagueId) {
        query = query.eq('league_id', leagueId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Venue[];
    },
  });
}

export function useCreateVenue() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (venue: { name: string; address?: string; league_id: string }) => {
      const { data, error } = await supabase
        .from('padel_venues')
        .insert(venue)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
}

export function useUpdateVenue() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...venue }: { id: string; name: string; address?: string }) => {
      const { data, error } = await supabase
        .from('padel_venues')
        .update(venue)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
}

export function useDeleteVenue() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('padel_venues')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
}

// Venue Courts Hooks
export function useVenueCourts(venueId?: string) {
  return useQuery({
    queryKey: ['venue-courts', venueId],
    queryFn: async (): Promise<VenueCourt[]> => {
      if (!venueId) return [];
      
      const { data, error } = await supabase
        .from('venue_courts')
        .select('*')
        .eq('venue_id', venueId)
        .order('display_order')
        .order('name');

      if (error) throw error;
      return data as VenueCourt[];
    },
    enabled: !!venueId,
  });
}

export function useAllVenueCourts() {
  return useQuery({
    queryKey: ['venue-courts-all'],
    queryFn: async (): Promise<VenueCourt[]> => {
      const { data, error } = await supabase
        .from('venue_courts')
        .select('*')
        .order('venue_id')
        .order('display_order')
        .order('name');

      if (error) throw error;
      return data as VenueCourt[];
    },
  });
}

export function useCreateVenueCourt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (court: { venue_id: string; name: string; display_order?: number }) => {
      const { data, error } = await supabase
        .from('venue_courts')
        .insert(court)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['venue-courts', variables.venue_id] });
      queryClient.invalidateQueries({ queryKey: ['venue-courts-all'] });
    },
  });
}

export function useUpdateVenueCourt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, venue_id, ...court }: { id: string; venue_id: string; name: string; display_order?: number }) => {
      const { data, error } = await supabase
        .from('venue_courts')
        .update(court)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['venue-courts', variables.venue_id] });
      queryClient.invalidateQueries({ queryKey: ['venue-courts-all'] });
    },
  });
}

export function useDeleteVenueCourt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, venue_id }: { id: string; venue_id: string }) => {
      const { error } = await supabase
        .from('venue_courts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['venue-courts', variables.venue_id] });
      queryClient.invalidateQueries({ queryKey: ['venue-courts-all'] });
    },
  });
}
