import { useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { StandingsTable } from '@/components/standings/StandingsTable';
import { useTeams } from '@/hooks/useTeams';
import { useMatches, useMatchResults } from '@/hooks/useMatches';
import { calculateStandings } from '@/lib/standings';
import { Trophy, Users, Calendar, Target } from 'lucide-react';

export default function Index() {
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { data: matches, isLoading: matchesLoading } = useMatches('group');
  const { data: results, isLoading: resultsLoading } = useMatchResults();

  const standings = useMemo(() => {
    if (!teams || !matches || !results) return [];
    return calculateStandings(teams, matches, results);
  }, [teams, matches, results]);

  const playedCount = results?.length ?? 0;
  const totalMatches = 55;
  const progress = Math.round((playedCount / totalMatches) * 100);

  const isLoading = teamsLoading || matchesLoading || resultsLoading;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-primary p-6 md:p-8 text-primary-foreground">
          <div className="relative z-10">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              Padel Freizeit-Liga
            </h1>
            <p className="text-primary-foreground/80 max-w-xl">
              Saison 2025 • Gruppenphase • {teams?.length ?? 11} Teams
            </p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-primary-foreground/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-primary-foreground/70 text-sm mb-1">
                <Users className="h-4 w-4" />
                Teams
              </div>
              <div className="text-2xl font-bold">{teams?.length ?? 11}</div>
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
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            Aktuelle Tabelle
          </h2>
          <StandingsTable standings={standings} loading={isLoading} />
        </div>
      </div>
    </Layout>
  );
}
