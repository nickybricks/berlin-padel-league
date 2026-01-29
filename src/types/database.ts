export type AppRole = 'admin' | 'captain' | 'viewer';

export interface Team {
  id: string;
  name: string;
  created_at: string;
  logo_url: string | null;
  captain_name: string | null;
  captain_phone: string | null;
  captain_email: string | null;
  player2_name: string | null;
  player2_phone: string | null;
  player2_email: string | null;
}

export interface Match {
  id: string;
  team_a_id: string;
  team_b_id: string;
  week: number;
  match_type: 'group' | 'quarter' | 'semi' | 'final' | 'third';
  played_at: string | null;
  created_at: string;
  team_a?: Team;
  team_b?: Team;
  result?: MatchResult;
}

export interface MatchResult {
  id: string;
  match_id: string;
  set1_a: number;
  set1_b: number;
  set2_a: number;
  set2_b: number;
  set3_a: number | null;
  set3_b: number | null;
  winner_id: string;
  entered_by: string | null;
  entered_at: string;
  comment: string | null;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  team_id: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamStanding {
  team: Team;
  played: number;
  wins: number;
  losses: number;
  setsWon: number;
  setsLost: number;
  gamesWon: number;
  gamesLost: number;
  points: number;
  setDiff: number;
  gameDiff: number;
  rank: number;
}

export interface MatchWithTeams extends Match {
  team_a: Team;
  team_b: Team;
  result?: MatchResult;
}
