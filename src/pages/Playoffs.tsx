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

  // Filter matches to only include teams from this league
  const leagueTeamIds = useMemo(() => new Set(teams?.map(t => t.id) || []), [teams]);

  // Calculate standings
  const standings = useMemo(() => {
    if (!teams || !groupMatches || !results) return [];
    const leagueGroupMatches = groupMatches.filter(m =>
      leagueTeamIds.has(m.team_a_id) && leagueTeamIds.has(m.team_b_id)
    );
    return calculateStandings(teams, leagueGroupMatches, results);
  }, [teams, groupMatches, results, leagueTeamIds]);

  // Check if group phase is complete
  const groupPhaseComplete = useMemo(() => {
    if (!groupMatches || !results) return false;
    const groupMatchIds = new Set(groupMatches.map(m => m.id));
    const playedGroupMatches = results.filter(r => groupMatchIds.has(r.match_id));
    return playedGroupMatches.length >= 55;
  }, [groupMatches, results]);

  // Get top 8 teams
  const top8 = standings.slice(0, 8);

  // Create playoff bracket placeholders
  const quarterFinals = [
    { teamA: top8[0]?.team?.name ?? '1. Platz', teamB: top8[7]?.team?.name ?? '8. Platz' },
    { teamA: top8[3]?.team?.name ?? '4. Platz', teamB: top8[4]?.team?.name ?? '5. Platz' },
    { teamA: top8[1]?.team?.name ?? '2. Platz', teamB: top8[6]?.team?.name ?? '7. Platz' },
    { teamA: top8[2]?.team?.name ?? '3. Platz', teamB: top8[5]?.team?.name ?? '6. Platz' },
  ];

  // Get playoff matches by type
  const quarterMatches = playoffMatches?.filter(m => m.match_type === 'quarter') ?? [];
  const semiMatches = playoffMatches?.filter(m => m.match_type === 'semi') ?? [];
  const finalMatch = playoffMatches?.find(m => m.match_type === 'final');

  // Results map
  const resultsMap = useMemo(() => {
    const map = new Map();
    results?.forEach(r => map.set(r.match_id, r));
    return map;
  }, [results]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-2">
          <Trophy className="h-7 w-7 text-accent" />
          Playoffs
        </h1>
        <p className="text-muted-foreground mt-1">
          Top 8 kämpfen um den Titel
        </p>
      </div>

      {/* Group Phase Status */}
      {!groupPhaseComplete && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start gap-3">
          <Lock className="h-5 w-5 text-warning mt-0.5" />
          <div>
            <p className="font-medium text-warning-foreground">
              Gruppenphase läuft noch
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Die Playoff-Paarungen werden nach Abschluss aller 55 Gruppenspiele festgelegt.
              Aktuelle Zwischenstände sind vorläufig.
            </p>
          </div>
        </div>
      )}

      {/* Current Top 8 Preview */}
      <div className="bg-card rounded-xl border p-4 md:p-6">
        <h2 className="text-lg font-bold mb-4">
          {groupPhaseComplete ? 'Playoff-Teilnehmer' : 'Aktuelle Top 8'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {top8.map((standing, index) => (
            <div
              key={standing.team.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
            >
              <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                index < 4 ? 'bg-accent text-accent-foreground' : 'bg-primary/10 text-primary'
              }`}>
                {index + 1}
              </span>
              <span className="font-medium truncate">{standing.team.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bracket Visualization */}
      <div className="bg-card rounded-xl border p-4 md:p-6 overflow-x-auto">
        <h2 className="text-lg font-bold mb-6">Turnierbaum</h2>

        <div className="min-w-[800px] flex items-center justify-between gap-8">
          {/* Quarter Finals */}
          <div className="flex flex-col gap-8">
            <BracketMatch
              match={quarterMatches[0]}
              result={quarterMatches[0] ? resultsMap.get(quarterMatches[0].id) : undefined}
              placeholder={quarterFinals[0]}
              round="VF 1"
            />
            <BracketMatch
              match={quarterMatches[1]}
              result={quarterMatches[1] ? resultsMap.get(quarterMatches[1].id) : undefined}
              placeholder={quarterFinals[1]}
              round="VF 2"
            />
            <BracketMatch
              match={quarterMatches[2]}
              result={quarterMatches[2] ? resultsMap.get(quarterMatches[2].id) : undefined}
              placeholder={quarterFinals[2]}
              round="VF 3"
            />
            <BracketMatch
              match={quarterMatches[3]}
              result={quarterMatches[3] ? resultsMap.get(quarterMatches[3].id) : undefined}
              placeholder={quarterFinals[3]}
              round="VF 4"
            />
          </div>

          {/* Semi Finals */}
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

          {/* Final */}
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
          <li>• <strong>Viertelfinale:</strong> 1. vs 8., 2. vs 7., 3. vs 6., 4. vs 5.</li>
          <li>• <strong>Halbfinale:</strong> Sieger der Viertelfinals</li>
          <li>• <strong>Finale:</strong> Sieger der Halbfinals</li>
          <li>• Alle Playoff-Spiele werden im Best-of-3-Modus gespielt</li>
        </ul>
      </div>
    </div>
  );
}

