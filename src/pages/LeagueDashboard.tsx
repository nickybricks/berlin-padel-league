import { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
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
      <Layout leagueId={leagueId}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout leagueId={leagueId}>
      <div className="space-y-6">
        {/* Hero Section - Subtle gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 p-6 md:p-8">
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-1">
              {league?.name || 'Liga'}
            </h1>
            <p className="text-muted-foreground text-sm">
              Saison 2025 • Gruppenphase • {teams?.length ?? 0} Teams
            </p>
          </div>
          
          {/* Stats Grid - Cleaner cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide mb-1">
                <Users className="h-3.5 w-3.5" />
                Teams
              </div>
              <div className="text-2xl font-semibold tabular-nums">{teams?.length ?? 0}</div>
            </div>
            <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide mb-1">
                <Calendar className="h-3.5 w-3.5" />
                Gespielt
              </div>
              <div className="text-2xl font-semibold tabular-nums">{playedCount}/{totalMatches}</div>
            </div>
            <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide mb-1">
                <Target className="h-3.5 w-3.5" />
                Fortschritt
              </div>
              <div className="text-2xl font-semibold tabular-nums">{progress}%</div>
            </div>
            <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide mb-1">
                <Trophy className="h-3.5 w-3.5" />
                Playoffs
              </div>
              <div className="text-2xl font-semibold">Top 8</div>
            </div>
          </div>

          {/* Background decoration - More subtle */}
          <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.03]">
            <Trophy className="w-full h-full text-foreground" />
          </div>
        </div>

        {/* Standings Table - Cleaner container */}
        <div className="bg-card rounded-xl border border-border/50 p-4 md:p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
            <Trophy className="h-4 w-4 text-accent" />
            Aktuelle Tabelle
          </h2>
          <StandingsTable standings={standings} loading={isLoading} />
        </div>
      </div>
    </Layout>
  );
}
