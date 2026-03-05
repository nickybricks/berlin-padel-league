/**
 * Re-assign week numbers for a set of matches so that no team plays
 * more than once per week. Uses a greedy algorithm.
 *
 * This is needed when a schedule was originally generated for all teams
 * (single round-robin) and then groups were applied – the remaining
 * intra-group matches may have multiple matches for the same team
 * in the same original week.
 */
export function reassignWeeks<T extends { team_a_id: string; team_b_id: string; week: number }>(
  matches: T[]
): T[] {
  if (matches.length === 0) return matches;

  // Sort by original week to preserve relative ordering
  const sorted = [...matches].sort((a, b) => a.week - b.week);

  const result: T[] = [];
  // Track which teams are already playing in each new week
  const weekTeams = new Map<number, Set<string>>();

  for (const match of sorted) {
    let assignedWeek = 1;

    // Find the earliest week where neither team is already playing
    while (true) {
      const teams = weekTeams.get(assignedWeek);
      if (!teams || (!teams.has(match.team_a_id) && !teams.has(match.team_b_id))) {
        break;
      }
      assignedWeek++;
    }

    // Assign match to this week
    if (!weekTeams.has(assignedWeek)) {
      weekTeams.set(assignedWeek, new Set());
    }
    weekTeams.get(assignedWeek)!.add(match.team_a_id);
    weekTeams.get(assignedWeek)!.add(match.team_b_id);

    result.push({ ...match, week: assignedWeek });
  }

  return result;
}
