import { Link } from 'react-router-dom';
import { TeamStanding } from '@/types/database';
import { Trophy, Users } from 'lucide-react';

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

  const getLogoUrl = (logoPath: string | null) => {
    if (!logoPath) return null;
    return `https://hoinybrkpfhedbltdbxq.supabase.co/storage/v1/object/public/${logoPath}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left text-[11px] sm:text-sm text-muted-foreground">
            <th className="pb-3 pl-1 sm:pl-4 w-8 sm:w-12">#</th>
            <th className="pb-3 w-8 sm:w-12"></th>
            <th className="pb-3">Team</th>
            <th className="pb-3 text-center">Sp</th>
            <th className="pb-3 text-center">S</th>
            <th className="pb-3 text-center">N</th>
            <th className="pb-3 text-center hidden sm:table-cell">Sätze</th>
            <th className="pb-3 text-center hidden md:table-cell">Spiele</th>
            <th className="pb-3 text-center pr-2 sm:pr-4 font-semibold">Pkt</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing, index) => {
            const isPlayoff = standing.rank <= 8;
            const isTop3 = standing.rank <= 3;
            const logoUrl = getLogoUrl(standing.team.logo_url);
            
            return (
              <tr
                key={standing.team.id}
                className="table-row-animate border-b last:border-0"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-3 sm:py-4 pl-0">
                  <div className="flex items-center">
                    <div className={`w-1 h-8 sm:h-10 rounded-full mr-1.5 sm:mr-3 ${isPlayoff ? 'bg-success' : 'bg-transparent'}`} />
                    <span className="text-[11px] sm:text-sm font-medium text-muted-foreground w-5 sm:w-6 text-center">
                      {standing.rank}
                    </span>
                  </div>
                </td>
                <td className="py-3 sm:py-4">
                  <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-md bg-muted overflow-hidden">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={`${standing.team.name} Logo`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    )}
                  </div>
                </td>
                <td className="py-3 sm:py-4">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Link 
                      to={`/teams/${standing.team.id}`}
                      className="text-[11px] sm:text-sm font-semibold hover:text-primary transition-colors truncate max-w-[80px] sm:max-w-none"
                    >
                      {standing.team.name}
                    </Link>
                    {isTop3 && (
                      <Trophy className={`h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 ${
                        standing.rank === 1 ? 'text-yellow-500' :
                        standing.rank === 2 ? 'text-gray-400' :
                        'text-amber-600'
                      }`} />
                    )}
                  </div>
                </td>
                <td className="py-3 sm:py-4 text-center text-[11px] sm:text-sm text-muted-foreground">
                  {standing.played}
                </td>
                <td className="py-3 sm:py-4 text-center text-[11px] sm:text-sm text-success font-medium">
                  {standing.wins}
                </td>
                <td className="py-3 sm:py-4 text-center text-[11px] sm:text-sm text-destructive font-medium">
                  {standing.losses}
                </td>
                <td className="py-3 sm:py-4 text-center text-[11px] sm:text-sm hidden sm:table-cell">
                  <span className="text-muted-foreground">
                    {standing.setsWon}:{standing.setsLost}
                  </span>
                  <span className={`ml-1 text-[9px] sm:text-xs font-medium ${
                    standing.setDiff > 0 ? 'text-success' :
                    standing.setDiff < 0 ? 'text-destructive' :
                    'text-muted-foreground'
                  }`}>
                    ({standing.setDiff > 0 ? '+' : ''}{standing.setDiff})
                  </span>
                </td>
                <td className="py-3 sm:py-4 text-center text-[11px] sm:text-sm hidden md:table-cell">
                  <span className="text-muted-foreground">
                    {standing.gamesWon}:{standing.gamesLost}
                  </span>
                  <span className={`ml-1 text-[9px] sm:text-xs font-medium ${
                    standing.gameDiff > 0 ? 'text-success' :
                    standing.gameDiff < 0 ? 'text-destructive' :
                    'text-muted-foreground'
                  }`}>
                    ({standing.gameDiff > 0 ? '+' : ''}{standing.gameDiff})
                  </span>
                </td>
                <td className="py-3 sm:py-4 text-center pr-1 sm:pr-4">
                  <span className="text-[11px] sm:text-sm font-bold">
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
          <div className="w-1 h-4 rounded-full bg-success" />
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
