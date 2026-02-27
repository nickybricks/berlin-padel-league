import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { FormatType, PlayoffFormat } from '@/types/leagues';

interface UpdateFormatParams {
  leagueId: string;
  format_type: FormatType;
  group_count: number;
  playoff_format: PlayoffFormat;
  playoff_qualifiers_per_group: number;
  home_and_away?: boolean;
}

export function useUpdateLeagueFormat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leagueId, ...updates }: UpdateFormatParams) => {
      const { data, error } = await supabase
        .from('leagues')
        .update(updates as any)
        .eq('id', leagueId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['league', variables.leagueId] });
    },
  });
}

export function useUpdateTeamGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ teamId, groupName }: { teamId: string; groupName: string | null }) => {
      const { error } = await supabase
        .from('teams')
        .update({ group_name: groupName } as any)
        .eq('id', teamId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['league-teams'] });
    },
  });
}

export function useBatchUpdateTeamGroups() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignments: { teamId: string; groupName: string | null }[]) => {
      for (const { teamId, groupName } of assignments) {
        const { error } = await supabase
          .from('teams')
          .update({ group_name: groupName } as any)
          .eq('id', teamId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['league-teams'] });
    },
  });
}
