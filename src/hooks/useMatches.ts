import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Match, MatchResult, MatchWithTeams } from '@/types/database';
import { useEffect } from 'react';

export function useMatches(matchType?: string) {
  const query = useQuery({
    queryKey: ['matches', matchType],
    queryFn: async (): Promise<MatchWithTeams[]> => {
      let queryBuilder = supabase
        .from('matches')
        .select(`
          *,
          team_a:teams!matches_team_a_id_fkey(*),
          team_b:teams!matches_team_b_id_fkey(*)
        `)
        .order('week')
        .order('created_at');

      if (matchType) {
        queryBuilder = queryBuilder.eq('match_type', matchType);
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;
      return data as MatchWithTeams[];
    },
  });

  return query;
}

export function useMatchResults() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['match_results'],
    queryFn: async (): Promise<MatchResult[]> => {
      const { data, error } = await supabase
        .from('match_results')
        .select('*')
        .order('entered_at', { ascending: false });

      if (error) throw error;
      return data as MatchResult[];
    },
  });

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('match_results_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'match_results',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['match_results'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useSubmitResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (result: Omit<MatchResult, 'id' | 'entered_at'>) => {
      const { data, error } = await supabase
        .from('match_results')
        .insert(result)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match_results'] });
    },
  });
}

export function useCreateMatches() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (matches: Omit<Match, 'id' | 'created_at' | 'played_at'>[]) => {
      const { data, error } = await supabase
        .from('matches')
        .insert(matches)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
}

export function useUpsertResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (result: Omit<MatchResult, 'id' | 'entered_at'>) => {
      const { data, error } = await supabase
        .from('match_results')
        .upsert(result, { onConflict: 'match_id' })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match_results'] });
    },
  });
}

export function useDeleteResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (matchId: string) => {
      const { error } = await supabase
        .from('match_results')
        .delete()
        .eq('match_id', matchId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match_results'] });
    },
  });
}

export function useUpdateMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, team_a_id, team_b_id }: { id: string; team_a_id: string; team_b_id: string }) => {
      const { data, error } = await supabase
        .from('matches')
        .update({ team_a_id, team_b_id })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['match_results'] });
    },
  });
}
