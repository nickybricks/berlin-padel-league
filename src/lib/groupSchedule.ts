import { Team } from '@/types/database';
import { generateSchedule } from './schedule';

interface ScheduledMatch {
  team_a_id: string;
  team_b_id: string;
  week: number;
}

/**
 * Generate round-robin schedule within each group.
 * Week numbers are continuous across groups.
 */
export function generateGroupSchedule(groups: Map<string, Team[]>): ScheduledMatch[] {
  const allMatches: ScheduledMatch[] = [];

  for (const [, groupTeams] of groups) {
    if (groupTeams.length < 2) continue;
    const groupMatches = generateSchedule(groupTeams);
    allMatches.push(...groupMatches);
  }

  return allMatches;
}

/**
 * Group teams by their group_name field.
 */
export function groupTeamsByName(teams: Team[]): Map<string, Team[]> {
  const groups = new Map<string, Team[]>();
  teams.forEach(team => {
    const group = team.group_name || 'A';
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(team);
  });
  return groups;
}
