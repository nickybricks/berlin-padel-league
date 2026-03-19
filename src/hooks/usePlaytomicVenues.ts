import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PlaytomicVenue {
  id: string;
  league_id: string;
  name: string;
  tenant_id: string;
  city: string | null;
  country: string | null;
  playtomic_url: string | null;
  created_at: string;
}

export function usePlaytomicVenues(leagueId?: string) {
  return useQuery({
    queryKey: ['playtomic-venues', leagueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playtomic_venues' as any)
        .select('*')
        .eq('league_id', leagueId!)
        .order('name');
      if (error) throw error;
      return data as unknown as PlaytomicVenue[];
    },
    enabled: !!leagueId,
  });
}

export function useCreatePlaytomicVenue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (venue: { league_id: string; name: string; tenant_id: string; city?: string; country?: string; playtomic_url?: string }) => {
      const { data, error } = await supabase.from('playtomic_venues' as any).insert(venue).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['playtomic-venues'] }),
  });
}

export function useUpdatePlaytomicVenue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; name?: string; tenant_id?: string; city?: string; country?: string; playtomic_url?: string }) => {
      const { data, error } = await supabase.from('playtomic_venues' as any).update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['playtomic-venues'] }),
  });
}

export function useDeletePlaytomicVenue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('playtomic_venues' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['playtomic-venues'] }),
  });
}
