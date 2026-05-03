import { MatchWithTeams, MatchResult, Team } from '@/types/database';
import { MatchCard } from './MatchCard';

interface WeekSectionProps {
  week: number;
  matches: MatchWithTeams[];
  results: Map<string, MatchResult>;
  teams?: Team[];
}

export function WeekSection({ week, matches, results, teams }: WeekSectionProps) {
  const playedCount = matches.filter(m => results.has(m.id)).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Spielwoche {week}</h3>
        <span className="text-sm text-muted-foreground">
          {playedCount}/{matches.length} gespielt
        </span>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map(match => (
          <MatchCard
            key={match.id}
            match={match}
            result={results.get(match.id)}
            teams={teams}
          />
        ))}
      </div>
    </div>
  );
}
