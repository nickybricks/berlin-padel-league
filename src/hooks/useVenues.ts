import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Venue } from '@/types/bookings';

export function useVenues() {
  return useQuery({
    queryKey: ['venues'],
    queryFn: async (): Promise<Venue[]> => {
      const { data, error } = await supabase
        .from('padel_venues')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Venue[];
    },
  });
}

export function useCreateVenue() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (venue: { name: string; address?: string }) => {
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
