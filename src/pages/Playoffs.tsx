import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { BracketMatch } from '@/components/playoffs/BracketMatch';
import { useLeagueById, useLeagueTeams } from '@/hooks/useLeagues';
import { useMatches, useMatchResults } from '@/hooks/useMatches';
import { calculateStandings } from '@/lib/standings';
import { Trophy, Lock } from 'lucide-react';
import type { TeamStanding } from '@/types/database';

export default function Playoffs() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const { data: league } = useLeagueById(leagueId);
  const { data: teams } = useLeagueTeams(leagueId);
  const { data: groupMatches } = useMatches('group');
  const { data: playoffMatches } = useMatches();
  const { data: results } = useMatchResults();

  const leagueTeamIds = useMemo(() => new Set(teams?.map(t => t.id) || []), [teams]);

  const leagueGroupMatches = useMemo(() => {
    if (!groupMatches) return [];
    return groupMatches.filter(m => leagueTeamIds.has(m.team_a_id) && leagueTeamIds.has(m.team_b_id));
  }, [groupMatches, leagueTeamIds]);

  const leagueResults = useMemo(() => {
    if (!results) return [];
    return results.filter(r => leagueGroupMatches.some(m => m.id === r.match_id));
  }, [results, leagueGroupMatches]);

  // Overall standings
  const standings = useMemo(() => {
    if (!teams || !leagueGroupMatches) return [];
    return calculateStandings(teams, leagueGroupMatches, leagueResults);
  }, [teams, leagueGroupMatches, leagueResults]);

  // Group standings for cross_group format
  const standingsByGroup = useMemo(() => {
    if (!teams) return {};
    const groupNames = [...new Set(teams.map(t => t.group_name).filter(Boolean))] as string[];
    const result: Record<string, TeamStanding[]> = {};
    groupNames.sort().forEach(g => {
      result[g] = calculateStandings(teams, leagueGroupMatches, leagueResults, g);
    });
    return result;
  }, [teams, leagueGroupMatches, leagueResults]);

  const playoffFormat = league?.playoff_format || 'top8_bracket';
  const qualifiers = league?.playoff_qualifiers_per_group || 4;

  // Determine expected total matches
  const expectedTotal = leagueGroupMatches.length;
  const groupPhaseComplete = leagueResults.length >= expectedTotal && expectedTotal > 0;

  // Build quarter finals based on format
  const quarterFinals = useMemo(() => {
    if (playoffFormat === 'cross_group') {
      const groupNames = Object.keys(standingsByGroup).sort();
      if (groupNames.length >= 2) {
        const gA = standingsByGroup[groupNames[0]] || [];
        const gB = standingsByGroup[groupNames[1]] || [];
        return [
          { teamA: gA[0]?.team?.name ?? `1. ${groupNames[0]}`, teamB: gB[qualifiers - 1]?.team?.name ?? `${qualifiers}. ${groupNames[1]}` },
          { teamA: gA[1]?.team?.name ?? `2. ${groupNames[0]}`, teamB: gB[qualifiers - 2]?.team?.name ?? `${qualifiers - 1}. ${groupNames[1]}` },
          { teamA: gB[0]?.team?.name ?? `1. ${groupNames[1]}`, teamB: gA[qualifiers - 1]?.team?.name ?? `${qualifiers}. ${groupNames[0]}` },
          { teamA: gB[1]?.team?.name ?? `2. ${groupNames[1]}`, teamB: gA[qualifiers - 2]?.team?.name ?? `${qualifiers - 1}. ${groupNames[0]}` },
        ];
      }
    }

    // Default: top8 or top4 bracket
    const count = playoffFormat === 'top4_bracket' ? 4 : 8;
    const top = standings.slice(0, count);

    if (count === 4) {
      return [
        { teamA: top[0]?.team?.name ?? '1. Platz', teamB: top[3]?.team?.name ?? '4. Platz' },
        { teamA: top[1]?.team?.name ?? '2. Platz', teamB: top[2]?.team?.name ?? '3. Platz' },
      ];
    }

    return [
      { teamA: top[0]?.team?.name ?? '1. Platz', teamB: top[7]?.team?.name ?? '8. Platz' },
      { teamA: top[3]?.team?.name ?? '4. Platz', teamB: top[4]?.team?.name ?? '5. Platz' },
      { teamA: top[1]?.team?.name ?? '2. Platz', teamB: top[6]?.team?.name ?? '7. Platz' },
      { teamA: top[2]?.team?.name ?? '3. Platz', teamB: top[5]?.team?.name ?? '6. Platz' },
    ];
  }, [playoffFormat, standings, standingsByGroup, qualifiers]);

  const quarterMatches = playoffMatches?.filter(m => m.match_type === 'quarter') ?? [];
  const semiMatches = playoffMatches?.filter(m => m.match_type === 'semi') ?? [];
  const finalMatch = playoffMatches?.find(m => m.match_type === 'final');

  const resultsMap = useMemo(() => {
    const map = new Map();
    results?.forEach(r => map.set(r.match_id, r));
    return map;
  }, [results]);

  const isTop4 = playoffFormat === 'top4_bracket' || (playoffFormat === 'cross_group' && quarterFinals.length <= 2);
  const displayTopTeams = playoffFormat === 'top4_bracket' ? standings.slice(0, 4) :
    playoffFormat === 'cross_group' ? [] : standings.slice(0, 8);

  // For cross_group, show group qualifiers
  const groupQualifiers = useMemo(() => {
    if (playoffFormat !== 'cross_group') return null;
    return Object.entries(standingsByGroup).sort(([a], [b]) => a.localeCompare(b)).map(([name, s]) => ({
      name,
      teams: s.slice(0, qualifiers),
    }));
  }, [playoffFormat, standingsByGroup, qualifiers]);

  return (
    <div className="space-y-8">
      {!groupPhaseComplete && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start gap-3">
          <Lock className="h-5 w-5 text-warning mt-0.5" />
          <div>
            <p className="font-medium text-warning-foreground">Gruppenphase läuft noch</p>
            <p className="text-sm text-muted-foreground mt-1">
              Die Playoff-Paarungen werden nach Abschluss aller {expectedTotal} Gruppenspiele festgelegt. Aktuelle Zwischenstände sind vorläufig.
            </p>
          </div>
        </div>
      )}

      {/* Playoff Participants */}
      <div className="bg-card rounded-xl shadow-sm p-4 md:p-6">
        <h2 className="text-lg font-bold mb-4">
          {groupPhaseComplete ? 'Playoff-Teilnehmer' : 'Aktuelle Qualifikation'}
        </h2>

        {groupQualifiers ? (
          <div className="space-y-4">
            {groupQualifiers.map(({ name, teams: gTeams }) => (
              <div key={name}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Gruppe {name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {gTeams.map((standing, index) => (
                    <div key={standing.team.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold bg-accent text-accent-foreground">
                        {index + 1}
                      </span>
                      <span className="font-medium truncate">{standing.team.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {displayTopTeams.map((standing, index) => (
              <div key={standing.team.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                  index < 4 ? 'bg-accent text-accent-foreground' : 'bg-primary/10 text-primary'
                }`}>
                  {index + 1}
                </span>
                <span className="font-medium truncate">{standing.team.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bracket */}
      <div className="bg-card rounded-xl shadow-sm p-4 md:p-6 overflow-x-auto">
        <h2 className="text-lg font-bold mb-6">Turnierbaum</h2>

        <div className="min-w-[800px] flex items-center justify-between gap-8">
          {/* Quarter Finals */}
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
          {playoffFormat === 'cross_group' ? (
            <>
              <li>• <strong>Viertelfinale:</strong> 1. Gr. A vs {qualifiers}. Gr. B, 2. Gr. A vs {qualifiers - 1}. Gr. B, etc.</li>
              <li>• <strong>Halbfinale:</strong> Sieger der Viertelfinals</li>
              <li>• <strong>Finale:</strong> Sieger der Halbfinals</li>
            </>
          ) : playoffFormat === 'top4_bracket' ? (
            <>
              <li>• <strong>Halbfinale:</strong> 1. vs 4., 2. vs 3.</li>
              <li>• <strong>Finale:</strong> Sieger der Halbfinals</li>
            </>
          ) : (
            <>
              <li>• <strong>Viertelfinale:</strong> 1. vs 8., 2. vs 7., 3. vs 6., 4. vs 5.</li>
              <li>• <strong>Halbfinale:</strong> Sieger der Viertelfinals</li>
              <li>• <strong>Finale:</strong> Sieger der Halbfinals</li>
            </>
          )}
          <li>• Alle Playoff-Spiele werden im Best-of-3-Modus gespielt</li>
        </ul>
      </div>
    </div>
  );
}
