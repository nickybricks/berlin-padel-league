export type LeagueRole = 'admin' | 'player';

export interface League {
  id: string;
  name: string;
  code: string;
  invite_token: string;
  created_by: string | null;
  created_at: string;
}

export interface LeagueMember {
  id: string;
  league_id: string;
  user_id: string;
  role: LeagueRole;
  team_id: string | null;
  created_at: string;
}

export interface LeagueMemberWithDetails extends LeagueMember {
  league?: League;
  user?: {
    email: string;
    display_name: string | null;
  };
}
