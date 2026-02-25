import { Team, MatchResult, Match, TeamStanding } from '@/types/database';

export function calculateStandings(
  teams: Team[],
  matches: Match[],
  results: MatchResult[],
  groupName?: string
): TeamStanding[] {
  // Filter teams by group if specified
  const filteredTeams = groupName
    ? teams.filter(t => t.group_name === groupName)
    : teams;
  // Initialize standings for each team
  const standingsMap = new Map<string, TeamStanding>();
  
  filteredTeams.forEach(team => {
    standingsMap.set(team.id, {
      team,
      played: 0,
      wins: 0,
      losses: 0,
      setsWon: 0,
      setsLost: 0,
      gamesWon: 0,
      gamesLost: 0,
      points: 0,
      setDiff: 0,
      gameDiff: 0,
      rank: 0,
    });
  });

  // Process each result
  results.forEach(result => {
    const match = matches.find(m => m.id === result.match_id);
    if (!match || match.match_type !== 'group') return;

    const teamAStanding = standingsMap.get(match.team_a_id);
    const teamBStanding = standingsMap.get(match.team_b_id);

    if (!teamAStanding || !teamBStanding) return;

    // Count sets won by each team
    let setsA = 0;
    let setsB = 0;
    let gamesA = 0;
    let gamesB = 0;

    // Set 1
    gamesA += result.set1_a;
    gamesB += result.set1_b;
    if (result.set1_a > result.set1_b) setsA++;
    else setsB++;

    // Set 2
    gamesA += result.set2_a;
    gamesB += result.set2_b;
    if (result.set2_a > result.set2_b) setsA++;
    else setsB++;

    // Set 3 (if played)
    if (result.set3_a !== null && result.set3_b !== null) {
      gamesA += result.set3_a;
      gamesB += result.set3_b;
      if (result.set3_a > result.set3_b) setsA++;
      else setsB++;
    }

    // Update Team A
    teamAStanding.played++;
    teamAStanding.setsWon += setsA;
    teamAStanding.setsLost += setsB;
    teamAStanding.gamesWon += gamesA;
    teamAStanding.gamesLost += gamesB;

    // Update Team B
    teamBStanding.played++;
    teamBStanding.setsWon += setsB;
    teamBStanding.setsLost += setsA;
    teamBStanding.gamesWon += gamesB;
    teamBStanding.gamesLost += gamesA;

    // Determine winner
    if (result.winner_id === match.team_a_id) {
      teamAStanding.wins++;
      teamAStanding.points += 3;
      teamBStanding.losses++;
    } else {
      teamBStanding.wins++;
      teamBStanding.points += 3;
      teamAStanding.losses++;
    }
  });

  // Calculate differences and convert to array
  const standings = Array.from(standingsMap.values()).map(s => ({
    ...s,
    setDiff: s.setsWon - s.setsLost,
    gameDiff: s.gamesWon - s.gamesLost,
  }));

  // Sort by: Points > Set Difference > Game Difference
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.setDiff !== a.setDiff) return b.setDiff - a.setDiff;
    return b.gameDiff - a.gameDiff;
  });

  // Assign ranks
  standings.forEach((s, index) => {
    s.rank = index + 1;
  });

  return standings;
}

export function formatSetResult(result: MatchResult): string {
  const sets: string[] = [];
  sets.push(`${result.set1_a}:${result.set1_b}`);
  sets.push(`${result.set2_a}:${result.set2_b}`);
  if (result.set3_a !== null && result.set3_b !== null) {
    sets.push(`${result.set3_a}:${result.set3_b}`);
  }
  return sets.join(', ');
}

export function getSetScore(result: MatchResult): string {
  let setsA = 0;
  let setsB = 0;

  if (result.set1_a > result.set1_b) setsA++;
  else setsB++;

  if (result.set2_a > result.set2_b) setsA++;
  else setsB++;

  if (result.set3_a !== null && result.set3_b !== null) {
    if (result.set3_a > result.set3_b) setsA++;
    else setsB++;
  }

  return `${setsA}:${setsB}`;
}
