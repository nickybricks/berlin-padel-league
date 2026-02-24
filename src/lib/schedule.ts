import { Team } from '@/types/database';

interface ScheduledMatch {
  team_a_id: string;
  team_b_id: string;
  week: number;
}

// Generate proper round-robin schedule for 11 teams (55 matches)
// Uses the circle method: each week, every team plays at most once
// With 11 teams (odd), we have 11 weeks with 5 matches each (one team has bye per week)
export function generateSchedule(teams: Team[]): ScheduledMatch[] {
  const matches: ScheduledMatch[] = [];
  const n = teams.length;
  
  // For odd number of teams, add a "bye" placeholder
  const teamsWithBye = [...teams];
  const hasOddTeams = n % 2 === 1;
  
  if (hasOddTeams) {
    // Add a virtual "bye" team at position 0
    teamsWithBye.unshift({ id: 'BYE', name: 'BYE', created_at: '' } as Team);
  }
  
  const totalTeams = teamsWithBye.length; // 12 for 11 real teams
  const rounds = totalTeams - 1; // 11 rounds
  
  // Circle method: fix position 0, rotate the rest
  // Create initial positions (indices into teamsWithBye)
  const positions = Array.from({ length: totalTeams }, (_, i) => i);
  
  for (let round = 0; round < rounds; round++) {
    const week = round + 1;
    
    // Generate matches for this round
    for (let i = 0; i < totalTeams / 2; i++) {
      const teamAIdx = positions[i];
      const teamBIdx = positions[totalTeams - 1 - i];
      
      const teamA = teamsWithBye[teamAIdx];
      const teamB = teamsWithBye[teamBIdx];
      
      // Skip matches involving the "bye" team
      if (teamA.id !== 'BYE' && teamB.id !== 'BYE') {
        matches.push({
          team_a_id: teamA.id,
          team_b_id: teamB.id,
          week,
        });
      }
    }
    
    // Rotate: keep position 0 fixed, rotate the rest clockwise
    const last = positions.pop()!;
    positions.splice(1, 0, last);
  }
  
  return matches;
}

// Get the number of weeks in the schedule
export function getWeekCount(matchCount: number): number {
  const matchesPerWeek = 5;
  return Math.ceil(matchCount / matchesPerWeek);
}
