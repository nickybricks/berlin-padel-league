import { TeamStanding } from '@/types/database';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StandingsTableProps {
  standings: TeamStanding[];
  loading?: boolean;
}

export function StandingsTable({ standings, loading }: StandingsTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left text-sm text-muted-foreground">
            <th className="pb-3 pl-4 w-12">#</th>
            <th className="pb-3">Team</th>
            <th className="pb-3 text-center hidden sm:table-cell">Sp</th>
            <th className="pb-3 text-center hidden sm:table-cell">S</th>
            <th className="pb-3 text-center hidden sm:table-cell">N</th>
            <th className="pb-3 text-center hidden md:table-cell">Sätze</th>
            <th className="pb-3 text-center hidden lg:table-cell">Spiele</th>
            <th className="pb-3 text-center pr-4 font-semibold">Pkt</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing, index) => {
            const isPlayoff = standing.rank <= 8;
            const isTop3 = standing.rank <= 3;
            
            return (
              <tr
                key={standing.team.id}
                className={`table-row-animate border-b last:border-0 ${
                  isPlayoff ? 'playoff-qualified' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-4 pl-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                    isTop3
                      ? 'bg-accent text-accent-foreground'
                      : isPlayoff
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {standing.rank}
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{standing.team.name}</span>
                    {isTop3 && (
                      <Trophy className={`h-4 w-4 ${
                        standing.rank === 1 ? 'text-yellow-500' :
                        standing.rank === 2 ? 'text-gray-400' :
                        'text-amber-600'
                      }`} />
                    )}
                  </div>
                </td>
                <td className="py-4 text-center hidden sm:table-cell text-muted-foreground">
                  {standing.played}
                </td>
                <td className="py-4 text-center hidden sm:table-cell text-success font-medium">
                  {standing.wins}
                </td>
                <td className="py-4 text-center hidden sm:table-cell text-destructive font-medium">
                  {standing.losses}
                </td>
                <td className="py-4 text-center hidden md:table-cell">
                  <span className="text-muted-foreground">
                    {standing.setsWon}:{standing.setsLost}
                  </span>
                  <span className={`ml-2 text-xs font-medium ${
                    standing.setDiff > 0 ? 'text-success' :
                    standing.setDiff < 0 ? 'text-destructive' :
                    'text-muted-foreground'
                  }`}>
                    ({standing.setDiff > 0 ? '+' : ''}{standing.setDiff})
                  </span>
                </td>
                <td className="py-4 text-center hidden lg:table-cell">
                  <span className="text-muted-foreground">
                    {standing.gamesWon}:{standing.gamesLost}
                  </span>
                  <span className={`ml-2 text-xs font-medium ${
                    standing.gameDiff > 0 ? 'text-success' :
                    standing.gameDiff < 0 ? 'text-destructive' :
                    'text-muted-foreground'
                  }`}>
                    ({standing.gameDiff > 0 ? '+' : ''}{standing.gameDiff})
                  </span>
                </td>
                <td className="py-4 text-center pr-4">
                  <span className="inline-flex items-center justify-center min-w-[2.5rem] px-3 py-1 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                    {standing.points}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Legend */}
      <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-accent" />
          <span>Playoff-Qualifikation (Top 8)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Sp</span> = Spiele
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">S</span> = Siege
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">N</span> = Niederlagen
        </div>
      </div>
    </div>
  );
}
