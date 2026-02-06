import { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { StandingsTable } from '@/components/standings/StandingsTable';
import { useLeagueById, useLeagueTeams } from '@/hooks/useLeagues';
import { useMatches, useMatchResults } from '@/hooks/useMatches';
import { calculateStandings } from '@/lib/standings';
import { Trophy, Users, Loader2 } from 'lucide-react';

function CircularProgress({ played, total }: { played: number; total: number }) {
  const radius = 54;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const arcCircumference = circumference * 0.75;
  const progress = total > 0 ? played / total : 0;
  const arcOffset = arcCircumference - progress * arcCircumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <svg width={radius * 2} height={radius * 2} className="-rotate-[135deg]">
          <circle
            className="text-muted"
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeDasharray={`${arcCircumference} ${circumference}`}
          />
          <circle
            className="text-primary transition-all duration-500"
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeDasharray={`${arcCircumference} ${circumference}`}
            strokeDashoffset={arcOffset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{played}/{total}</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground">Gespielt</span>
    </div>
  );
}

export default function LeagueDashboard() {
  const { leagueId } = useParams<{ leagueId: string }>();

  const { data: league, isLoading: leagueLoading, error: leagueError } = useLeagueById(leagueId);
  const { data: teams, isLoading: teamsLoading } = useLeagueTeams(leagueId);
  const { data: matches, isLoading: matchesLoading } = useMatches('group');
  const { data: results, isLoading: resultsLoading } = useMatchResults();

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
    <div className="space-y-6">
      {/* Hero Card — compact, white, no border */}
      <div className="bg-card rounded-2xl shadow-sm p-5 md:p-6">
        <div className="flex items-center gap-6">
          {/* Left: Circular progress */}
          <div className="shrink-0">
            <CircularProgress played={playedCount} total={totalMatches} />
          </div>

          {/* Right: League info */}
          <div className="flex flex-col gap-3 min-w-0">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">
                {league?.name || 'Liga'}
              </h1>
              <p className="text-sm text-muted-foreground">
                Saison 2025 • Gruppenphase
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 shrink-0" />
                <span className="font-medium text-foreground">{teams?.length ?? 0}</span>
                <span>Teams</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trophy className="h-4 w-4 shrink-0" />
                <span>Playoffs: Top 8</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standings Table */}
      <div className="bg-card rounded-xl shadow-sm p-4 md:p-6">
        <StandingsTable standings={standings} loading={isLoading} />
      </div>
    </div>
  );
}
