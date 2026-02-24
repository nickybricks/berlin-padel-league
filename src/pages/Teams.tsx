import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLeagueTeams } from '@/hooks/useLeagues';
import { TeamCard } from '@/components/teams/TeamCard';
import { Badge } from '@/components/ui/badge';

export default function Teams() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const { data: teams, isLoading } = useLeagueTeams(leagueId);
  const navigate = useNavigate();

  const groupA = useMemo(() => teams?.filter(t => t.group_name === 'A') ?? [], [teams]);
  const groupB = useMemo(() => teams?.filter(t => t.group_name === 'B') ?? [], [teams]);
  const ungrouped = useMemo(() => teams?.filter(t => !t.group_name) ?? [], [teams]);
  const hasGroups = groupA.length > 0 || groupB.length > 0;

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      )}

      {!isLoading && teams && hasGroups && (
        <>
          {groupA.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Gruppe A</h2>
                <Badge variant="secondary">{groupA.length} Teams</Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groupA.map((team) => (
                  <TeamCard key={team.id} team={team} onClick={() => navigate(`/league/${leagueId}/teams/${team.id}`)} />
                ))}
              </div>
            </div>
          )}
          {groupB.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Gruppe B</h2>
                <Badge variant="secondary">{groupB.length} Teams</Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groupB.map((team) => (
                  <TeamCard key={team.id} team={team} onClick={() => navigate(`/league/${leagueId}/teams/${team.id}`)} />
                ))}
              </div>
            </div>
          )}
          {ungrouped.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-muted-foreground">Ohne Gruppe</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ungrouped.map((team) => (
                  <TeamCard key={team.id} team={team} onClick={() => navigate(`/league/${leagueId}/teams/${team.id}`)} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!isLoading && teams && !hasGroups && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} onClick={() => navigate(`/league/${leagueId}/teams/${team.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
