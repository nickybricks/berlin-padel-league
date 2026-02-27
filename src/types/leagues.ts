export type LeagueRole = 'admin' | 'player';
export type FormatType = 'round_robin' | 'groups';
export type PlayoffFormat = 'top8_bracket' | 'top4_bracket' | 'cross_group';

export interface League {
  id: string;
  name: string;
  code: string;
  invite_token: string;
  logo_url: string | null;
  created_by: string | null;
  created_at: string;
  format_type: FormatType;
  group_count: number;
  playoff_format: PlayoffFormat;
  playoff_qualifiers_per_group: number;
  home_and_away: boolean;
  max_teams: number | null;
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
