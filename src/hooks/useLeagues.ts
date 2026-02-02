import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { League, LeagueMember } from '@/types/leagues';

export function useLeagueByCode(code: string | undefined) {
  return useQuery({
    queryKey: ['league', 'code', code],
    queryFn: async () => {
      if (!code) return null;
      const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .eq('code', code.toUpperCase())
        .single();
      if (error) throw error;
      return data as League;
    },
    enabled: !!code,
  });
}

export function useLeagueById(id: string | undefined) {
  return useQuery({
    queryKey: ['league', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as League;
    },
    enabled: !!id,
  });
}

export function useUserLeagues(userId: string | undefined) {
  return useQuery({
    queryKey: ['user-leagues', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('league_members')
        .select(`
          *,
          league:leagues(*)
        `)
        .eq('user_id', userId);
      if (error) throw error;
      return data as (LeagueMember & { league: League })[];
    },
    enabled: !!userId,
  });
}

export function useJoinLeague() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      leagueId, 
      userId, 
      teamId 
    }: { 
      leagueId: string; 
      userId: string; 
      teamId?: string;
    }) => {
      const { data, error } = await supabase
        .from('league_members')
        .insert({
          league_id: leagueId,
          user_id: userId,
          role: 'player',
          team_id: teamId || null,
        })
        .select()
        .single();
      if (error) throw error;
      return data as LeagueMember;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-leagues'] });
      queryClient.invalidateQueries({ queryKey: ['league-members'] });
    },
  });
}

export function useLeagueTeams(leagueId: string | undefined) {
  return useQuery({
    queryKey: ['league-teams', leagueId],
    queryFn: async () => {
      if (!leagueId) return [];
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('league_id', leagueId)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!leagueId,
  });
}

export function useCheckEmailInLeagueTeam(leagueId: string | undefined, email: string | undefined) {
  return useQuery({
    queryKey: ['email-team-check', leagueId, email],
    queryFn: async () => {
      if (!leagueId || !email) return null;
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('league_id', leagueId)
        .or(`player1_email.eq.${email},player2_email.eq.${email}`)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!leagueId && !!email,
  });
}

// Helper to determine which player slot is available for a team
export function getAvailablePlayerSlot(team: { player1_email: string | null; player2_email: string | null }): 'player1' | 'player2' | null {
  if (!team.player1_email) return 'player1';
  if (!team.player2_email) return 'player2';
  return null;
}
