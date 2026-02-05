import { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { StandingsTable } from '@/components/standings/StandingsTable';
import { useLeagueById, useLeagueTeams } from '@/hooks/useLeagues';
import { useMatches, useMatchResults } from '@/hooks/useMatches';
import { calculateStandings } from '@/lib/standings';
import { Trophy, Users, Calendar, Target, Loader2 } from 'lucide-react';

export default function LeagueDashboard() {
  const { leagueId } = useParams<{ leagueId: string }>();

  const { data: league, isLoading: leagueLoading, error: leagueError } = useLeagueById(leagueId);
  const { data: teams, isLoading: teamsLoading } = useLeagueTeams(leagueId);
  const { data: matches, isLoading: matchesLoading } = useMatches('group');
  const { data: results, isLoading: resultsLoading } = useMatchResults();

  // Filter matches to only include teams from this league
  const leagueTeamIds = useMemo(() => new Set(teams?.map(t => t.id) || []), [teams]);

  const leagueMatches = useMemo(() => {
    if (!matches) return [];
    return matches.filter(m =>
      leagueTeamIds.has(m.team_a_id) && leagueTeamIds.has(m.team_b_id)
    );
  }, [matches, leagueTeamIds]);

  const standings = useMemo(() => {
    if (!teams || !leagueMatches || !results) return [];
    const leagueResults = results.filter(r =>
      leagueMatches.some(m => m.id === r.match_id)
    );
    return calculateStandings(teams, leagueMatches, leagueResults);
  }, [teams, leagueMatches, results]);

  const playedCount = useMemo(() => {
    return results?.filter(r => leagueMatches.some(m => m.id === r.match_id)).length ?? 0;
  }, [results, leagueMatches]);

  const totalMatches = leagueMatches.length;
  const progress = totalMatches > 0 ? Math.round((playedCount / totalMatches) * 100) : 0;

  const isLoading = leagueLoading || teamsLoading || matchesLoading || resultsLoading;

  if (leagueError) {
    return <Navigate to="/" replace />;
  }

  if (leagueLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-primary p-6 md:p-8 text-primary-foreground">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            {league?.name || 'Liga'}
          </h1>
          <p className="text-primary-foreground/80 max-w-xl">
            Saison 2025 • Gruppenphase • {teams?.length ?? 0} Teams
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-primary-foreground/10 rounded-xl p-4">
            <div className="flex items-center gap-2 text-primary-foreground/70 text-sm mb-1">
              <Users className="h-4 w-4" />
              Teams
            </div>
            <div className="text-2xl font-bold">{teams?.length ?? 0}</div>
          </div>
          <div className="bg-primary-foreground/10 rounded-xl p-4">
            <div className="flex items-center gap-2 text-primary-foreground/70 text-sm mb-1">
              <Calendar className="h-4 w-4" />
              Gespielt
            </div>
            <div className="text-2xl font-bold">{playedCount}/{totalMatches}</div>
          </div>
          <div className="bg-primary-foreground/10 rounded-xl p-4">
            <div className="flex items-center gap-2 text-primary-foreground/70 text-sm mb-1">
              <Target className="h-4 w-4" />
              Fortschritt
            </div>
            <div className="text-2xl font-bold">{progress}%</div>
          </div>
          <div className="bg-primary-foreground/10 rounded-xl p-4">
            <div className="flex items-center gap-2 text-primary-foreground/70 text-sm mb-1">
              <Trophy className="h-4 w-4" />
              Playoffs
            </div>
            <div className="text-2xl font-bold">Top 8</div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <Trophy className="w-full h-full" />
        </div>
      </div>

      {/* Standings Table */}
      <div className="bg-card rounded-xl border p-4 md:p-6">
        <StandingsTable standings={standings} loading={isLoading} />
      </div>
    </div>
  );
}

