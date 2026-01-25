import { Team } from '@/types/database';

interface ScheduledMatch {
  team_a_id: string;
  team_b_id: string;
  week: number;
}

// Generate round-robin schedule for 11 teams (55 matches)
export function generateSchedule(teams: Team[]): ScheduledMatch[] {
  const matches: ScheduledMatch[] = [];
  const n = teams.length;
  
  // For odd number of teams, we use a "bye" concept
  // Create all possible pairings
  const pairings: { a: number; b: number }[] = [];
  
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      pairings.push({ a: i, b: j });
    }
  }
  
  // Distribute matches across weeks (aim for ~5-6 matches per week)
  const matchesPerWeek = Math.ceil(pairings.length / 11); // About 5 matches per week
  
  pairings.forEach((pairing, index) => {
    const week = Math.floor(index / matchesPerWeek) + 1;
    matches.push({
      team_a_id: teams[pairing.a].id,
      team_b_id: teams[pairing.b].id,
      week,
    });
  });
  
  return matches;
}

// Get the number of weeks in the schedule
export function getWeekCount(matchCount: number): number {
  const matchesPerWeek = 5;
  return Math.ceil(matchCount / matchesPerWeek);
}
