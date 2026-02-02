import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LeagueRole } from '@/types/leagues';

export interface LeagueMemberWithDetails {
  id: string;
  league_id: string;
  user_id: string;
  role: LeagueRole;
  team_id: string | null;
  created_at: string;
  profile: {
    email: string | null;
    display_name: string | null;
  } | null;
  team: {
    id: string;
    name: string;
  } | null;
}

export function useLeagueMembers(leagueId: string | undefined) {
  return useQuery({
    queryKey: ['league-members', leagueId],
    queryFn: async (): Promise<LeagueMemberWithDetails[]> => {
      if (!leagueId) return [];
      
      // Fetch league members
      const { data: membersData, error: membersError } = await supabase
        .from('league_members')
        .select(`
          id,
          league_id,
          user_id,
          role,
          team_id,
          created_at,
          teams(id, name)
        `)
        .eq('league_id', leagueId)
        .order('created_at', { ascending: true });

      if (membersError) throw membersError;

      // Fetch profiles separately since there's no direct FK
      const userIds = (membersData || []).map(m => m.user_id);
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, email, display_name')
        .in('user_id', userIds);

      const profilesMap = new Map(
        (profilesData || []).map(p => [p.user_id, p])
      );

      return (membersData || []).map((member: any) => ({
        id: member.id,
        league_id: member.league_id,
        user_id: member.user_id,
        role: member.role,
        team_id: member.team_id,
        created_at: member.created_at,
        profile: profilesMap.get(member.user_id) || null,
        team: member.teams,
      }));
    },
    enabled: !!leagueId,
  });
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      memberId, 
      newRole 
    }: { 
      memberId: string; 
      newRole: LeagueRole 
    }) => {
      const { error } = await supabase
        .from('league_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['league-members'] });
    },
  });
}

export function useUpdateMemberTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      memberId, 
      newTeamId 
    }: { 
      memberId: string; 
      newTeamId: string | null 
    }) => {
      const { error } = await supabase
        .from('league_members')
        .update({ team_id: newTeamId })
        .eq('id', memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['league-members'] });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from('league_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['league-members'] });
    },
  });
}
