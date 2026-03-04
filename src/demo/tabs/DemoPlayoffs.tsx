import { useDemoLeague } from '../DemoLeagueContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Trophy, User } from 'lucide-react';

export default function DemoPlayoffs() {
  const { standings, playoffBracket } = useDemoLeague();

  return (
    <div className="space-y-5">
      {/* Warning banner */}
      <div className="flex items-start gap-3 rounded-xl bg-[hsl(45_90%_55%/0.12)] border border-[hsl(45_90%_55%/0.3)] p-4">
        <Lock className="h-5 w-5 text-[hsl(var(--warning))] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium">Gruppenphase läuft noch</p>
          <p className="text-xs text-muted-foreground">Die Playoff-Paarungen werden nach Abschluss aller Gruppenspiele festgelegt. Aktuelle Zwischenstände sind vorläufig.</p>
        </div>
      </div>

      {/* Qualification */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Aktuelle Qualifikation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(['A', 'B'] as const).map(g => (
            <div key={g}>
              <p className="text-xs font-medium text-muted-foreground mb-2">Gruppe {g}</p>
              <div className="flex flex-wrap gap-2">
                {standings[g].slice(0, 4).map((s, i) => (
                  <div key={s.team.id} className="flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1">
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold">{i + 1}</span>
                    <span className="text-xs font-medium">{s.team.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Bracket */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Turnierbaum</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="flex items-center gap-4 min-w-[700px] py-4">
              {/* QF */}
              <div className="flex flex-col gap-3 shrink-0">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Viertelfinale</p>
                {playoffBracket.qf.map((qf, i) => (
                  <BracketSlot key={i} teamA={qf.teamA?.name ?? '–'} teamB={qf.teamB?.name ?? '–'} />
                ))}
              </div>
              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <span className="text-lg">→</span>
              </div>
              {/* SF */}
              <div className="flex flex-col gap-6 shrink-0">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Halbfinale</p>
                {playoffBracket.sf.map((sf, i) => (
                  <BracketSlot key={i} teamA={sf.teamA} teamB={sf.teamB} />
                ))}
              </div>
              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <span className="text-lg">→</span>
              </div>
              {/* Final */}
              <div className="flex flex-col gap-3 shrink-0">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Finale</p>
                <BracketSlot teamA={playoffBracket.final.teamA} teamB={playoffBracket.final.teamB} />
              </div>
              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <span className="text-lg">→</span>
              </div>
              {/* Champion */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <Trophy className="h-8 w-8 text-[hsl(var(--warning))]" />
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Champion</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Playoff mode explanation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Playoff-Modus</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Viertelfinale:</strong> 1. Gr. A vs 4. Gr. B, 2. Gr. A vs 3. Gr. B, 1. Gr. B vs 4. Gr. A, 2. Gr. B vs 3. Gr. A</li>
            <li><strong>Halbfinale:</strong> Sieger der Viertelfinals</li>
            <li><strong>Finale:</strong> Sieger der Halbfinals</li>
            <li>Alle Playoff-Spiele im <strong>Best-of-3-Modus</strong></li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function BracketSlot({ teamA, teamB }: { teamA: string; teamB: string }) {
  return (
    <div className="rounded-lg border bg-accent/5 divide-y w-44">
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
          <User className="h-2.5 w-2.5 text-muted-foreground" />
        </div>
        <span className="text-xs font-medium truncate">{teamA}</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
          <User className="h-2.5 w-2.5 text-muted-foreground" />
        </div>
        <span className="text-xs font-medium truncate">{teamB}</span>
      </div>
    </div>
  );
}
