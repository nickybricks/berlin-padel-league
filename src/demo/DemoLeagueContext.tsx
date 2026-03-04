import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Team, Match, MatchResult, TeamStanding } from '@/types/database';
import { calculateStandings, getSetScore, formatSetResult } from '@/lib/standings';

// ── Teams ──────────────────────────────────────────────────────
const TEAMS: Team[] = [
  { id: 'a1', name: 'Smash Brothers', player1_name: 'Max', player2_name: 'Leon', group_name: 'A', league_id: 'demo', logo_url: null, created_at: '', player1_phone: null, player1_email: null, player2_phone: null, player2_email: null },
  { id: 'a2', name: 'Padel Pinguine', player1_name: 'Tim', player2_name: 'Jonas', group_name: 'A', league_id: 'demo', logo_url: null, created_at: '', player1_phone: null, player1_email: null, player2_phone: null, player2_email: null },
  { id: 'a3', name: 'Net Crushers', player1_name: 'Felix', player2_name: 'Moritz', group_name: 'A', league_id: 'demo', logo_url: null, created_at: '', player1_phone: null, player1_email: null, player2_phone: null, player2_email: null },
  { id: 'a4', name: 'Drop Shot FC', player1_name: 'Nico', player2_name: 'Paul', group_name: 'A', league_id: 'demo', logo_url: null, created_at: '', player1_phone: null, player1_email: null, player2_phone: null, player2_email: null },
  { id: 'b1', name: 'Lob City Berlin', player1_name: 'Jan', player2_name: 'Erik', group_name: 'B', league_id: 'demo', logo_url: null, created_at: '', player1_phone: null, player1_email: null, player2_phone: null, player2_email: null },
  { id: 'b2', name: 'Vamos Berlin', player1_name: 'Lukas', player2_name: 'David', group_name: 'B', league_id: 'demo', logo_url: null, created_at: '', player1_phone: null, player1_email: null, player2_phone: null, player2_email: null },
  { id: 'b3', name: 'Die Lobster', player1_name: 'Tom', player2_name: 'Finn', group_name: 'B', league_id: 'demo', logo_url: null, created_at: '', player1_phone: null, player1_email: null, player2_phone: null, player2_email: null },
  { id: 'b4', name: 'Volley Kings', player1_name: 'Ben', player2_name: 'Noah', group_name: 'B', league_id: 'demo', logo_url: null, created_at: '', player1_phone: null, player1_email: null, player2_phone: null, player2_email: null },
];

// ── Round-Robin Matches (3 weeks × 4 matches) ─────────────────
const MATCHES: Match[] = [
  // Week 1 – Group A
  { id: 'm1', team_a_id: 'a1', team_b_id: 'a2', week: 1, match_type: 'group', played_at: null, created_at: '' },
  { id: 'm2', team_a_id: 'a3', team_b_id: 'a4', week: 1, match_type: 'group', played_at: null, created_at: '' },
  // Week 1 – Group B
  { id: 'm3', team_a_id: 'b1', team_b_id: 'b2', week: 1, match_type: 'group', played_at: null, created_at: '' },
  { id: 'm4', team_a_id: 'b3', team_b_id: 'b4', week: 1, match_type: 'group', played_at: null, created_at: '' },
  // Week 2 – Group A
  { id: 'm5', team_a_id: 'a1', team_b_id: 'a3', week: 2, match_type: 'group', played_at: null, created_at: '' },
  { id: 'm6', team_a_id: 'a2', team_b_id: 'a4', week: 2, match_type: 'group', played_at: null, created_at: '' },
  // Week 2 – Group B
  { id: 'm7', team_a_id: 'b1', team_b_id: 'b3', week: 2, match_type: 'group', played_at: null, created_at: '' },
  { id: 'm8', team_a_id: 'b2', team_b_id: 'b4', week: 2, match_type: 'group', played_at: null, created_at: '' },
  // Week 3 – Group A
  { id: 'm9', team_a_id: 'a1', team_b_id: 'a4', week: 3, match_type: 'group', played_at: null, created_at: '' },
  { id: 'm10', team_a_id: 'a2', team_b_id: 'a3', week: 3, match_type: 'group', played_at: null, created_at: '' },
  // Week 3 – Group B
  { id: 'm11', team_a_id: 'b1', team_b_id: 'b4', week: 3, match_type: 'group', played_at: null, created_at: '' },
  { id: 'm12', team_a_id: 'b2', team_b_id: 'b3', week: 3, match_type: 'group', played_at: null, created_at: '' },
];

// ── Pre-filled results for week 1 ─────────────────────────────
const INITIAL_RESULTS: Record<string, MatchResult> = {
  m1: { id: 'r1', match_id: 'm1', set1_a: 6, set1_b: 3, set2_a: 6, set2_b: 2, set3_a: null, set3_b: null, winner_id: 'a1', entered_by: null, entered_at: '', comment: null },
  m2: { id: 'r2', match_id: 'm2', set1_a: 6, set1_b: 4, set2_a: 3, set2_b: 6, set3_a: 6, set3_b: 3, winner_id: 'a3', entered_by: null, entered_at: '', comment: null },
  m3: { id: 'r3', match_id: 'm3', set1_a: 6, set1_b: 1, set2_a: 6, set2_b: 4, set3_a: null, set3_b: null, winner_id: 'b1', entered_by: null, entered_at: '', comment: null },
  m4: { id: 'r4', match_id: 'm4', set1_a: 4, set1_b: 6, set2_a: 6, set2_b: 3, set3_a: 4, set3_b: 6, winner_id: 'b4', entered_by: null, entered_at: '', comment: null },
};

export interface DemoLeagueContextType {
  teams: Team[];
  matches: Match[];
  results: Record<string, MatchResult>;
  standings: { A: TeamStanding[]; B: TeamStanding[]; all: TeamStanding[] };
  playoffBracket: { qf: { teamA: Team | null; teamB: Team | null; label: string }[]; sf: { teamA: string; teamB: string }[]; final: { teamA: string; teamB: string } };
  submitResult: (matchId: string, sets: { a: number; b: number }[], comment?: string) => void;
  clearResult: (matchId: string) => void;
  getTeam: (id: string) => Team | undefined;
  getMatchGroup: (match: Match) => string;
  selectedMatchId: string | null;
  setSelectedMatchId: (id: string | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DemoLeagueContext = createContext<DemoLeagueContextType | null>(null);

export function useDemoLeague() {
  const ctx = useContext(DemoLeagueContext);
  if (!ctx) throw new Error('useDemoLeague must be used within DemoLeagueProvider');
  return ctx;
}

export function DemoLeagueProvider({ children }: { children: React.ReactNode }) {
  const [results, setResults] = useState<Record<string, MatchResult>>(INITIAL_RESULTS);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('tabelle');

  const getTeam = useCallback((id: string) => TEAMS.find(t => t.id === id), []);
  const getMatchGroup = useCallback((match: Match) => {
    const teamA = TEAMS.find(t => t.id === match.team_a_id);
    return teamA?.group_name || '';
  }, []);

  const standings = useMemo(() => {
    const resultArr = Object.values(results);
    return {
      A: calculateStandings(TEAMS, MATCHES, resultArr, 'A'),
      B: calculateStandings(TEAMS, MATCHES, resultArr, 'B'),
      all: calculateStandings(TEAMS, MATCHES, resultArr),
    };
  }, [results]);

  const playoffBracket = useMemo(() => {
    const a = standings.A;
    const b = standings.B;
    const qf = [
      { teamA: a[0]?.team ?? null, teamB: b[3]?.team ?? null, label: 'VF 1' },
      { teamA: a[1]?.team ?? null, teamB: b[2]?.team ?? null, label: 'VF 2' },
      { teamA: b[0]?.team ?? null, teamB: a[3]?.team ?? null, label: 'VF 3' },
      { teamA: b[1]?.team ?? null, teamB: a[2]?.team ?? null, label: 'VF 4' },
    ];
    return {
      qf,
      sf: [
        { teamA: 'Sieger VF 1', teamB: 'Sieger VF 2' },
        { teamA: 'Sieger VF 3', teamB: 'Sieger VF 4' },
      ],
      final: { teamA: 'Sieger HF 1', teamB: 'Sieger HF 2' },
    };
  }, [standings]);

  const submitResult = useCallback((matchId: string, sets: { a: number; b: number }[], comment?: string) => {
    const match = MATCHES.find(m => m.id === matchId);
    if (!match) return;

    let setsA = 0, setsB = 0;
    sets.forEach(s => { if (s.a > s.b) setsA++; else setsB++; });

    const result: MatchResult = {
      id: `r-${matchId}`,
      match_id: matchId,
      set1_a: sets[0].a,
      set1_b: sets[0].b,
      set2_a: sets[1].a,
      set2_b: sets[1].b,
      set3_a: sets[2]?.a ?? null,
      set3_b: sets[2]?.b ?? null,
      winner_id: setsA > setsB ? match.team_a_id : match.team_b_id,
      entered_by: null,
      entered_at: new Date().toISOString(),
      comment: comment || null,
    };
    setResults(prev => ({ ...prev, [matchId]: result }));
  }, []);

  const clearResult = useCallback((matchId: string) => {
    setResults(prev => {
      const next = { ...prev };
      delete next[matchId];
      return next;
    });
  }, []);

  return (
    <DemoLeagueContext.Provider value={{
      teams: TEAMS,
      matches: MATCHES,
      results,
      standings,
      playoffBracket,
      submitResult,
      clearResult,
      getTeam,
      getMatchGroup,
      selectedMatchId,
      setSelectedMatchId,
      activeTab,
      setActiveTab,
    }}>
      {children}
    </DemoLeagueContext.Provider>
  );
}
