import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shuffle, Save, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useBatchUpdateTeamGroups } from '@/hooks/useLeagueFormat';
import type { Team, Match, MatchResult } from '@/types/database';
import type { League } from '@/types/leagues';

interface GroupAssignmentProps {
  league: League;
  teams: Team[];
  matches: Match[];
  results: MatchResult[];
}

export function GroupAssignment({ league, teams, matches, results }: GroupAssignmentProps) {
  const groupCount = league.group_count || 2;
  const groupNames = Array.from({ length: groupCount }, (_, i) => String.fromCharCode(65 + i));

  // Initialize assignments from current team data
  const [assignments, setAssignments] = useState<Record<string, string | null>>(() => {
    const map: Record<string, string | null> = {};
    teams.forEach(t => { map[t.id] = t.group_name || null; });
    return map;
  });

  const batchUpdate = useBatchUpdateTeamGroups();

  // Find teams that have already played against each other (connected teams)
  const connectedPairs = useMemo(() => {
    const pairs: [string, string][] = [];
    const matchIds = new Set(results.map(r => r.match_id));
    matches.forEach(m => {
      if (matchIds.has(m.id) && m.match_type === 'group') {
        pairs.push([m.team_a_id, m.team_b_id]);
      }
    });
    return pairs;
  }, [matches, results]);

  // Build connected components using union-find
  const connectedGroups = useMemo(() => {
    const parent: Record<string, string> = {};
    teams.forEach(t => { parent[t.id] = t.id; });

    const find = (x: string): string => {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    };
    const union = (a: string, b: string) => {
      parent[find(a)] = find(b);
    };

    connectedPairs.forEach(([a, b]) => union(a, b));

    const groups: Record<string, string[]> = {};
    teams.forEach(t => {
      const root = find(t.id);
      if (!groups[root]) groups[root] = [];
      groups[root].push(t.id);
    });
    return Object.values(groups);
  }, [teams, connectedPairs]);

  // Check for constraint violations
  const violations = useMemo(() => {
    const issues: string[] = [];
    connectedPairs.forEach(([a, b]) => {
      const gA = assignments[a];
      const gB = assignments[b];
      if (gA && gB && gA !== gB) {
        const tA = teams.find(t => t.id === a)?.name;
        const tB = teams.find(t => t.id === b)?.name;
        issues.push(`${tA} und ${tB} haben bereits gegeneinander gespielt, müssen in einer Gruppe sein`);
      }
    });
    return issues;
  }, [assignments, connectedPairs, teams]);

  const handleAssign = (teamId: string, group: string | null) => {
    setAssignments(prev => ({ ...prev, [teamId]: group }));
  };

  const handleRandomAssign = () => {
    const newAssignments: Record<string, string | null> = {};

    // First, place connected components together
    const groupBuckets: string[][] = groupNames.map(() => []);

    // Sort connected groups by size descending (place largest first)
    const sortedGroups = [...connectedGroups].sort((a, b) => b.length - a.length);

    sortedGroups.forEach(component => {
      // Find group with fewest members
      const minIdx = groupBuckets.reduce((best, bucket, idx) =>
        bucket.length < groupBuckets[best].length ? idx : best, 0);
      component.forEach(tid => {
        groupBuckets[minIdx].push(tid);
        newAssignments[tid] = groupNames[minIdx];
      });
    });

    setAssignments(newAssignments);
    toast.success('Teams zufällig zugeteilt');
  };

  const handleSave = async () => {
    if (violations.length > 0) {
      toast.error('Es gibt Konflikte – bitte beheben');
      return;
    }

    const unassigned = teams.filter(t => !assignments[t.id]);
    if (unassigned.length > 0) {
      toast.error(`${unassigned.length} Teams sind noch keiner Gruppe zugeteilt`);
      return;
    }

    try {
      await batchUpdate.mutateAsync(
        teams.map(t => ({ teamId: t.id, groupName: assignments[t.id] || null }))
      );
      toast.success('Gruppenzuteilung gespeichert');
    } catch {
      toast.error('Fehler beim Speichern');
    }
  };

  const teamsInGroup = (group: string) =>
    teams.filter(t => assignments[t.id] === group);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          Gruppenzuteilung
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Violations */}
        {violations.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 space-y-1">
            {violations.map((v, i) => (
              <p key={i} className="text-sm text-destructive">{v}</p>
            ))}
          </div>
        )}

        {/* Random Assignment */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRandomAssign}>
            <Shuffle className="mr-2 h-4 w-4" />
            Zufällig zuteilen
          </Button>
        </div>

        {/* Group Columns */}
        <div className={`grid gap-4 ${groupCount <= 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-' + groupCount}`}>
          {groupNames.map(group => (
            <div key={group} className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Gruppe {group}</h3>
                <Badge variant="secondary">{teamsInGroup(group).length} Teams</Badge>
              </div>
              <div className="space-y-2">
                {teamsInGroup(group).map(team => (
                  <div key={team.id} className="flex items-center justify-between bg-background rounded-md px-3 py-2 text-sm">
                    <span className="font-medium truncate">{team.name}</span>
                    <button
                      onClick={() => handleAssign(team.id, null)}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Unassigned Teams */}
        {teams.filter(t => !assignments[t.id]).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Nicht zugeteilt</h4>
            <div className="space-y-2">
              {teams.filter(t => !assignments[t.id]).map(team => (
                <div key={team.id} className="flex items-center gap-3 bg-muted/30 rounded-md px-3 py-2">
                  <span className="text-sm font-medium flex-1">{team.name}</span>
                  <Select
                    value=""
                    onValueChange={(v) => handleAssign(team.id, v)}
                  >
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue placeholder="Gruppe..." />
                    </SelectTrigger>
                    <SelectContent>
                      {groupNames.map(g => (
                        <SelectItem key={g} value={g}>Gruppe {g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button onClick={handleSave} disabled={batchUpdate.isPending || violations.length > 0} size="sm">
          {batchUpdate.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Gruppenzuteilung speichern
        </Button>
      </CardContent>
    </Card>
  );
}
