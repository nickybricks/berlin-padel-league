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
          <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground/70">
            <th className="pb-4 pl-4 w-12 font-medium">#</th>
            <th className="pb-4 w-12"></th>
            <th className="pb-4 font-medium">Team</th>
            <th className="pb-4 text-center hidden sm:table-cell font-medium">Sp</th>
            <th className="pb-4 text-center hidden sm:table-cell font-medium">S</th>
            <th className="pb-4 text-center hidden sm:table-cell font-medium">N</th>
            <th className="pb-4 text-center hidden md:table-cell font-medium">Sätze</th>
            <th className="pb-4 text-center hidden lg:table-cell font-medium">Spiele</th>
            <th className="pb-4 text-center pr-4 font-medium">Pkt</th>
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
                className={`transition-colors ${index % 2 === 1 ? 'bg-muted/30' : ''}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-5 pl-0">
                  <div className="flex items-center">
                    {/* Subtle indicator for playoff teams */}
                    <div className={`w-0.5 h-8 rounded-full mr-3 ${isPlayoff ? 'bg-accent/60' : 'bg-transparent'}`} />
                    <span className="text-sm tabular-nums text-muted-foreground w-6 text-center">
                      {standing.rank}
                    </span>
                  </div>
                </td>
                <td className="py-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-border/40 bg-muted/50 overflow-hidden">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={`${standing.team.name} Logo`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Users className="h-4 w-4 text-muted-foreground/60" />
                    )}
                  </div>
                </td>
                <td className="py-5">
                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/teams/${standing.team.id}`}
                      className="font-medium hover:text-accent transition-colors"
                    >
                      {standing.team.name}
                    </Link>
                    {isTop3 && (
                      <Trophy className={`h-3.5 w-3.5 ${
                        standing.rank === 1 ? 'text-yellow-500' :
                        standing.rank === 2 ? 'text-muted-foreground/60' :
                        'text-amber-600/70'
                      }`} />
                    )}
                  </div>
                </td>
                <td className="py-5 text-center hidden sm:table-cell text-muted-foreground tabular-nums">
                  {standing.played}
                </td>
                <td className="py-5 text-center hidden sm:table-cell text-foreground/80 tabular-nums">
                  {standing.wins}
                </td>
                <td className="py-5 text-center hidden sm:table-cell text-muted-foreground tabular-nums">
                  {standing.losses}
                </td>
                <td className="py-5 text-center hidden md:table-cell tabular-nums">
                  <span className="text-muted-foreground">
                    {standing.setsWon}:{standing.setsLost}
                  </span>
                  <span className={`ml-1.5 text-xs ${
                    standing.setDiff > 0 ? 'text-foreground/60' :
                    standing.setDiff < 0 ? 'text-muted-foreground' :
                    'text-muted-foreground'
                  }`}>
                    ({standing.setDiff > 0 ? '+' : ''}{standing.setDiff})
                  </span>
                </td>
                <td className="py-5 text-center hidden lg:table-cell tabular-nums">
                  <span className="text-muted-foreground">
                    {standing.gamesWon}:{standing.gamesLost}
                  </span>
                  <span className={`ml-1.5 text-xs ${
                    standing.gameDiff > 0 ? 'text-foreground/60' :
                    standing.gameDiff < 0 ? 'text-muted-foreground' :
                    'text-muted-foreground'
                  }`}>
                    ({standing.gameDiff > 0 ? '+' : ''}{standing.gameDiff})
                  </span>
                </td>
                <td className="py-5 text-center pr-4">
                  <span className="text-lg font-semibold tabular-nums text-foreground">
                    {standing.points}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Legend - More subtle */}
      <div className="mt-6 pt-4 flex flex-wrap gap-6 text-xs text-muted-foreground/60">
        <div className="flex items-center gap-1.5">
          <div className="w-0.5 h-3 rounded-full bg-accent/60" />
          <span>Playoff (Top 8)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium">Sp</span>
          <span>Spiele</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium">S</span>
          <span>Siege</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium">N</span>
          <span>Niederlagen</span>
        </div>
      </div>
    </div>
  );
}
