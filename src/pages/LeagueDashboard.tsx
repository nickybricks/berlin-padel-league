import { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { StandingsTable } from '@/components/standings/StandingsTable';
import { useLeagueById, useLeagueTeams } from '@/hooks/useLeagues';
import { useMatches, useMatchResults } from '@/hooks/useMatches';
import { calculateStandings } from '@/lib/standings';
import { Loader2 } from 'lucide-react';

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

  const groupATeams = useMemo(() => teams?.filter(t => t.group_name === 'A') ?? [], [teams]);
  const groupBTeams = useMemo(() => teams?.filter(t => t.group_name === 'B') ?? [], [teams]);
  const hasGroups = groupATeams.length > 0 && groupBTeams.length > 0;

  const standingsA = useMemo(() => {
    if (!hasGroups || !leagueMatches || !results) return [];
    const groupTeamIds = new Set(groupATeams.map(t => t.id));
    const groupMatches = leagueMatches.filter(m => groupTeamIds.has(m.team_a_id) && groupTeamIds.has(m.team_b_id));
    const groupResults = results.filter(r => groupMatches.some(m => m.id === r.match_id));
    return calculateStandings(groupATeams, groupMatches, groupResults);
  }, [hasGroups, groupATeams, leagueMatches, results]);

  const standingsB = useMemo(() => {
    if (!hasGroups || !leagueMatches || !results) return [];
    const groupTeamIds = new Set(groupBTeams.map(t => t.id));
    const groupMatches = leagueMatches.filter(m => groupTeamIds.has(m.team_a_id) && groupTeamIds.has(m.team_b_id));
    const groupResults = results.filter(r => groupMatches.some(m => m.id === r.match_id));
    return calculateStandings(groupBTeams, groupMatches, groupResults);
  }, [hasGroups, groupBTeams, leagueMatches, results]);

  const allStandings = useMemo(() => {
    if (hasGroups) return [];
    if (!teams || !leagueMatches || !results) return [];
    const leagueResults = results.filter(r => leagueMatches.some(m => m.id === r.match_id));
    return calculateStandings(teams, leagueMatches, leagueResults);
  }, [hasGroups, teams, leagueMatches, results]);

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
      {hasGroups ? (
        <>
          <div className="bg-card rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-bold mb-4">Gruppe A</h2>
            <StandingsTable standings={standingsA} loading={isLoading} playoffCount={4} />
          </div>
          <div className="bg-card rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-bold mb-4">Gruppe B</h2>
            <StandingsTable standings={standingsB} loading={isLoading} playoffCount={4} />
          </div>
        </>
      ) : (
        <div className="bg-card rounded-xl shadow-sm p-4 md:p-6">
          <StandingsTable standings={allStandings} loading={isLoading} playoffCount={8} />
        </div>
      )}
    </div>
  );
}
