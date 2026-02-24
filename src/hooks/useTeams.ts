import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Team } from '@/types/database';

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: async (): Promise<Team[]> => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Team[];
    },
  });
}

export function useUpdateTeamGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ teamId, groupName }: { teamId: string; groupName: string | null }) => {
      const { data, error } = await supabase
        .from('teams')
        .update({ group_name: groupName } as any)
        .eq('id', teamId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['league-teams'] });
    },
  });
}
