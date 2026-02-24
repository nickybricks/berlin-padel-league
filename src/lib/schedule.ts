import { Team } from '@/types/database';

interface ScheduledMatch {
  team_a_id: string;
  team_b_id: string;
  week: number;
}

// Generate round-robin schedule within a single group
function generateGroupSchedule(teams: Team[], weekOffset: number = 0): ScheduledMatch[] {
  const matches: ScheduledMatch[] = [];
  const n = teams.length;

  const teamsWithBye = [...teams];
  const hasOddTeams = n % 2 === 1;

  if (hasOddTeams) {
    teamsWithBye.unshift({ id: 'BYE', name: 'BYE', created_at: '' } as Team);
  }

  const totalTeams = teamsWithBye.length;
  const rounds = totalTeams - 1;

  const positions = Array.from({ length: totalTeams }, (_, i) => i);

  for (let round = 0; round < rounds; round++) {
    const week = round + 1 + weekOffset;

    for (let i = 0; i < totalTeams / 2; i++) {
      const teamAIdx = positions[i];
      const teamBIdx = positions[totalTeams - 1 - i];

      const teamA = teamsWithBye[teamAIdx];
      const teamB = teamsWithBye[teamBIdx];

      if (teamA.id !== 'BYE' && teamB.id !== 'BYE') {
        matches.push({
          team_a_id: teamA.id,
          team_b_id: teamB.id,
          week,
        });
      }
    }

    const last = positions.pop()!;
    positions.splice(1, 0, last);
  }

  return matches;
}

// Generate schedule for two groups (each group plays round-robin)
export function generateSchedule(teams: Team[]): ScheduledMatch[] {
  const groupA = teams.filter(t => t.group_name === 'A');
  const groupB = teams.filter(t => t.group_name === 'B');

  if (groupA.length === 0 || groupB.length === 0) {
    // Fallback: single group round-robin
    return generateGroupSchedule(teams);
  }

  // Both groups play in parallel, same week numbers
  const matchesA = generateGroupSchedule(groupA);
  const matchesB = generateGroupSchedule(groupB);

  return [...matchesA, ...matchesB];
}

// Get the number of weeks in the schedule
export function getWeekCount(matchCount: number, matchesPerWeek: number = 5): number {
  return Math.ceil(matchCount / matchesPerWeek);
}
