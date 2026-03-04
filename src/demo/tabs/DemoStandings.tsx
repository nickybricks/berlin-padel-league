import { useState } from 'react';
import { useDemoLeague } from '../DemoLeagueContext';
import { TeamStanding } from '@/types/database';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User } from 'lucide-react';

export default function DemoStandings({ compact = false }: { compact?: boolean }) {
  const { standings } = useDemoLeague();
  const [group, setGroup] = useState<'A' | 'B' | 'all'>('A');

  const data = standings[group];
  const tabs: { key: 'A' | 'B' | 'all'; label: string }[] = [
    { key: 'A', label: 'Gruppe A' },
    { key: 'B', label: 'Gruppe B' },
    { key: 'all', label: 'Gesamt' },
  ];

  const isQualified = (_s: TeamStanding, idx: number) => idx < 4;

  const diffColor = (v: number) =>
    v > 0 ? 'text-accent' : v < 0 ? 'text-destructive' : 'text-muted-foreground';

  return (
    <div className="space-y-4">
      {/* Sub-tab pills */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setGroup(t.key)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              group === t.key
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2">
              <TableHead className="w-8 text-center">#</TableHead>
              <TableHead>Team</TableHead>
              {!compact && <TableHead className="text-center w-10">Sp</TableHead>}
              <TableHead className="text-center w-10">S</TableHead>
              <TableHead className="text-center w-10">N</TableHead>
              <TableHead className="text-center">Sätze</TableHead>
              {!compact && <TableHead className="text-center">Spiele</TableHead>}
              <TableHead className="text-center w-12">Pkt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((s, idx) => (
              <TableRow
                key={s.team.id}
                className={`table-row-animate ${isQualified(s, idx) ? 'playoff-qualified' : ''}`}
              >
                <TableCell className="text-center font-medium text-muted-foreground">
                  {idx + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <span className={`font-medium ${compact ? 'text-xs' : 'text-sm'} truncate`}>
                      {s.team.name}
                    </span>
                  </div>
                </TableCell>
                {!compact && (
                  <TableCell className="text-center text-sm">{s.played}</TableCell>
                )}
                <TableCell className="text-center text-sm font-medium text-accent">{s.wins}</TableCell>
                <TableCell className="text-center text-sm font-medium text-destructive">{s.losses}</TableCell>
                <TableCell className="text-center text-sm">
                  {s.setsWon}:{s.setsLost}{' '}
                  <span className={`text-xs font-medium ${diffColor(s.setDiff)}`}>
                    ({s.setDiff > 0 ? '+' : ''}{s.setDiff})
                  </span>
                </TableCell>
                {!compact && (
                  <TableCell className="text-center text-sm">
                    {s.gamesWon}:{s.gamesLost}{' '}
                    <span className={`text-xs font-medium ${diffColor(s.gameDiff)}`}>
                      ({s.gameDiff > 0 ? '+' : ''}{s.gameDiff})
                    </span>
                  </TableCell>
                )}
                <TableCell className="text-center text-sm font-bold">{s.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!compact && (
        <p className="text-xs text-muted-foreground">
          🟢 Playoff-Qualifikation (Top 4) · Sp = Spiele · S = Siege · N = Niederlagen
        </p>
      )}
    </div>
  );
}
