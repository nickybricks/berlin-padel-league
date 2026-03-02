import { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { StandingsTable } from '@/components/standings/StandingsTable';
import { useLeagueById, useLeagueTeams } from '@/hooks/useLeagues';
import { useMatches, useMatchResults } from '@/hooks/useMatches';
import { calculateStandings } from '@/lib/standings';
import { Loader2 } from 'lucide-react';
import type { TeamStanding } from '@/types/database';

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

  const leagueResults = useMemo(() => {
    if (!results) return [];
    return results.filter(r => leagueMatches.some(m => m.id === r.match_id));
  }, [results, leagueMatches]);

  const standings = useMemo(() => {
    if (!teams || !leagueMatches || !leagueResults) return [];
    return calculateStandings(teams, leagueMatches, leagueResults);
  }, [teams, leagueMatches, leagueResults]);

  // Group standings
  const standingsByGroup = useMemo(() => {
    if (!league || league.format_type !== 'groups' || !teams) return {};
    const groupNames = [...new Set(teams.map(t => t.group_name).filter(Boolean))] as string[];
    const result: Record<string, TeamStanding[]> = {};
    groupNames.forEach(g => {
      result[g] = calculateStandings(teams, leagueMatches, leagueResults, g);
    });
    return result;
  }, [league, teams, leagueMatches, leagueResults]);

  const isLoading = leagueLoading || teamsLoading || matchesLoading || resultsLoading;

  if (leagueError) return <Navigate to="/leagues" replace />;

  if (leagueLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl shadow-sm p-4 md:p-6">
        <StandingsTable
          standings={standings}
          loading={isLoading}
          formatType={league?.format_type}
          groupCount={league?.group_count}
          playoffQualifiers={league?.playoff_qualifiers_per_group}
          standingsByGroup={standingsByGroup}
        />
      </div>
    </div>
  );
}
