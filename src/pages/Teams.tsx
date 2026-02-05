import { useNavigate, useParams } from 'react-router-dom';
import { useLeagueTeams } from '@/hooks/useLeagues';
import { TeamCard } from '@/components/teams/TeamCard';
import { Users } from 'lucide-react';

export default function Teams() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const { data: teams, isLoading } = useLeagueTeams(leagueId);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Users className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Teams</h1>
          <p className="text-sm text-muted-foreground">
            Alle {teams?.length || 0} Teams der Liga
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      )}

      {/* Team Grid */}
      {!isLoading && teams && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onClick={() => navigate(`/league/${leagueId}/teams/${team.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

