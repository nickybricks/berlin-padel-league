import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { BracketMatch } from '@/components/playoffs/BracketMatch';
import { useLeagueTeams } from '@/hooks/useLeagues';
import { useMatches, useMatchResults } from '@/hooks/useMatches';
import { calculateStandings } from '@/lib/standings';
import { Trophy, Lock } from 'lucide-react';

export default function Playoffs() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const { data: teams } = useLeagueTeams(leagueId);
  const { data: groupMatches } = useMatches('group');
  const { data: playoffMatches } = useMatches();
  const { data: results } = useMatchResults();

  const leagueTeamIds = useMemo(() => new Set(teams?.map(t => t.id) || []), [teams]);

  const groupATeams = useMemo(() => teams?.filter(t => t.group_name === 'A') ?? [], [teams]);
  const groupBTeams = useMemo(() => teams?.filter(t => t.group_name === 'B') ?? [], [teams]);
  const hasGroups = groupATeams.length > 0 && groupBTeams.length > 0;

  // Calculate standings per group
  const standingsA = useMemo(() => {
    if (!hasGroups || !groupMatches || !results) return [];
    const ids = new Set(groupATeams.map(t => t.id));
    const gm = groupMatches.filter(m => ids.has(m.team_a_id) && ids.has(m.team_b_id));
    return calculateStandings(groupATeams, gm, results);
  }, [hasGroups, groupATeams, groupMatches, results]);

  const standingsB = useMemo(() => {
    if (!hasGroups || !groupMatches || !results) return [];
    const ids = new Set(groupBTeams.map(t => t.id));
    const gm = groupMatches.filter(m => ids.has(m.team_a_id) && ids.has(m.team_b_id));
    return calculateStandings(groupBTeams, gm, results);
  }, [hasGroups, groupBTeams, groupMatches, results]);

  // Expected total group matches
  const expectedGroupMatches = useMemo(() => {
    if (!hasGroups) return 55;
    const nA = groupATeams.length;
    const nB = groupBTeams.length;
    return (nA * (nA - 1)) / 2 + (nB * (nB - 1)) / 2;
  }, [hasGroups, groupATeams, groupBTeams]);

  const groupPhaseComplete = useMemo(() => {
    if (!groupMatches || !results) return false;
    const leagueGroupMatches = groupMatches.filter(m => leagueTeamIds.has(m.team_a_id) && leagueTeamIds.has(m.team_b_id));
    const groupMatchIds = new Set(leagueGroupMatches.map(m => m.id));
    const playedGroupMatches = results.filter(r => groupMatchIds.has(r.match_id));
    return playedGroupMatches.length >= expectedGroupMatches;
  }, [groupMatches, results, leagueTeamIds, expectedGroupMatches]);

  // Cross-group bracket: 1A vs 4B, 2A vs 3B, 1B vs 4A, 2B vs 3A
  const quarterFinals = useMemo(() => {
    if (hasGroups) {
      return [
        { teamA: standingsA[0]?.team?.name ?? '1. Gr. A', teamB: standingsB[3]?.team?.name ?? '4. Gr. B' },
        { teamA: standingsB[1]?.team?.name ?? '2. Gr. B', teamB: standingsA[2]?.team?.name ?? '3. Gr. A' },
        { teamA: standingsB[0]?.team?.name ?? '1. Gr. B', teamB: standingsA[3]?.team?.name ?? '4. Gr. A' },
        { teamA: standingsA[1]?.team?.name ?? '2. Gr. A', teamB: standingsB[2]?.team?.name ?? '3. Gr. B' },
      ];
    }
    return [
      { teamA: '1. Platz', teamB: '8. Platz' },
      { teamA: '4. Platz', teamB: '5. Platz' },
      { teamA: '2. Platz', teamB: '7. Platz' },
      { teamA: '3. Platz', teamB: '6. Platz' },
    ];
  }, [hasGroups, standingsA, standingsB]);

  const quarterMatches = playoffMatches?.filter(m => m.match_type === 'quarter') ?? [];
  const semiMatches = playoffMatches?.filter(m => m.match_type === 'semi') ?? [];
  const finalMatch = playoffMatches?.find(m => m.match_type === 'final');

  const resultsMap = useMemo(() => {
    const map = new Map();
    results?.forEach(r => map.set(r.match_id, r));
    return map;
  }, [results]);

  return (
    <div className="space-y-8">
      {!groupPhaseComplete && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start gap-3">
          <Lock className="h-5 w-5 text-warning mt-0.5" />
          <div>
            <p className="font-medium text-warning-foreground">Gruppenphase läuft noch</p>
            <p className="text-sm text-muted-foreground mt-1">
              Die Playoff-Paarungen werden nach Abschluss aller {expectedGroupMatches} Gruppenspiele festgelegt.
              Aktuelle Zwischenstände sind vorläufig.
            </p>
          </div>
        </div>
      )}

      {/* Top 4 per group preview */}
      {hasGroups ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-bold mb-4">
              {groupPhaseComplete ? 'Playoff-Teilnehmer Gruppe A' : 'Top 4 Gruppe A'}
            </h2>
            <div className="space-y-2">
              {standingsA.slice(0, 4).map((s, i) => (
                <div key={s.team.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="font-medium truncate">{s.team.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-bold mb-4">
              {groupPhaseComplete ? 'Playoff-Teilnehmer Gruppe B' : 'Top 4 Gruppe B'}
            </h2>
            <div className="space-y-2">
              {standingsB.slice(0, 4).map((s, i) => (
                <div key={s.team.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="font-medium truncate">{s.team.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-lg font-bold mb-4">Aktuelle Top 8</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold">
                  {i + 1}
                </span>
                <span className="font-medium truncate">TBD</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bracket */}
      <div className="bg-card rounded-xl shadow-sm p-4 md:p-6 overflow-x-auto">
        <h2 className="text-lg font-bold mb-6">Turnierbaum</h2>
        <div className="min-w-[800px] flex items-center justify-between gap-8">
          <div className="flex flex-col gap-8">
            {quarterFinals.map((qf, i) => (
              <BracketMatch
                key={i}
                match={quarterMatches[i]}
                result={quarterMatches[i] ? resultsMap.get(quarterMatches[i].id) : undefined}
                placeholder={qf}
                round={`VF ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex flex-col gap-24">
            <BracketMatch
              match={semiMatches[0]}
              result={semiMatches[0] ? resultsMap.get(semiMatches[0].id) : undefined}
              placeholder={{ teamA: 'Sieger VF 1', teamB: 'Sieger VF 2' }}
              round="HF 1"
            />
            <BracketMatch
              match={semiMatches[1]}
              result={semiMatches[1] ? resultsMap.get(semiMatches[1].id) : undefined}
              placeholder={{ teamA: 'Sieger VF 3', teamB: 'Sieger VF 4' }}
              round="HF 2"
            />
          </div>
          <div className="flex flex-col items-center">
            <BracketMatch
              match={finalMatch}
              result={finalMatch ? resultsMap.get(finalMatch.id) : undefined}
              placeholder={{ teamA: 'Sieger HF 1', teamB: 'Sieger HF 2' }}
              round="Finale"
            />
            <div className="mt-4 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-playoff" />
              <span className="text-sm font-bold text-playoff">CHAMPION</span>
            </div>
          </div>
        </div>
      </div>

      {/* Playoff Rules */}
      <div className="bg-muted/50 rounded-xl p-4 md:p-6">
        <h3 className="font-bold mb-3">Playoff-Modus</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {hasGroups ? (
            <>
              <li>• <strong>Viertelfinale:</strong> 1.A vs 4.B, 2.B vs 3.A, 1.B vs 4.A, 2.A vs 3.B</li>
              <li>• <strong>Halbfinale:</strong> Sieger VF 1 vs Sieger VF 2, Sieger VF 3 vs Sieger VF 4</li>
            </>
          ) : (
            <li>• <strong>Viertelfinale:</strong> 1. vs 8., 2. vs 7., 3. vs 6., 4. vs 5.</li>
          )}
          <li>• <strong>Finale:</strong> Sieger der Halbfinals</li>
          <li>• Alle Playoff-Spiele werden im Best-of-3-Modus gespielt</li>
        </ul>
      </div>
    </div>
  );
}
