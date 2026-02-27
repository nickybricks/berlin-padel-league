import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { FormatType, PlayoffFormat } from '@/types/leagues';

interface CreateLeagueInput {
  name: string;
  logo_url?: string | null;
  format_type: FormatType;
  group_count: number;
  home_and_away: boolean;
  max_teams: number | null;
  playoff_format: PlayoffFormat;
  playoff_qualifiers_per_group: number;
}

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function useCreateLeague() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateLeagueInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const code = generateCode();

      // Insert league
      const { data: league, error: leagueError } = await supabase
        .from('leagues')
        .insert({
          name: input.name,
          code,
          logo_url: input.logo_url ?? null,
          format_type: input.format_type,
          group_count: input.format_type === 'round_robin' ? 1 : input.group_count,
          playoff_format: input.playoff_format,
          playoff_qualifiers_per_group: input.playoff_qualifiers_per_group,
          home_and_away: input.home_and_away,
          max_teams: input.max_teams,
          created_by: user.id,
        })
        .select()
        .single();

      if (leagueError) throw leagueError;

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from('league_members')
        .insert({
          league_id: league.id,
          user_id: user.id,
          role: 'admin',
        });

      if (memberError) throw memberError;

      return league;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leagues'] });
    },
  });
}
