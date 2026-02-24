import { useNavigate, useParams } from 'react-router-dom';
import { useLeagueTeams } from '@/hooks/useLeagues';
import { TeamCard } from '@/components/teams/TeamCard';

export default function Teams() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const { data: teams, isLoading } = useLeagueTeams(leagueId);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
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

