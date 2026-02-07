import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { WeekSection } from '@/components/schedule/WeekSection';
import { useMatches, useMatchResults, useCreateMatches } from '@/hooks/useMatches';
import { useLeagueTeams } from '@/hooks/useLeagues';
import { generateSchedule } from '@/lib/schedule';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export default function Schedule() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const [weekFilter, setWeekFilter] = useState<string>('all');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: teams } = useLeagueTeams(leagueId);
  const { data: matches, isLoading: matchesLoading } = useMatches('group');
  const { data: results } = useMatchResults();
  const createMatches = useCreateMatches();
  const { isAdmin } = useAuth();

  // Create set of league team IDs for filtering
  const leagueTeamIds = useMemo(() => new Set(teams?.map(t => t.id) || []), [teams]);

  // Create results map for quick lookup
  const resultsMap = useMemo(() => {
    const map = new Map();
    results?.forEach(r => map.set(r.match_id, r));
    return map;
  }, [results]);

  // Filter matches to only include teams from this league and group by week
  const matchesByWeek = useMemo(() => {
    if (!matches) return new Map();

    const grouped = new Map<number, typeof matches>();
    matches.forEach(match => {
      // Only include matches from this league
      if (!leagueTeamIds.has(match.team_a_id) || !leagueTeamIds.has(match.team_b_id)) {
        return;
      }

      // Apply filters
      if (teamFilter !== 'all' &&
          match.team_a_id !== teamFilter &&
          match.team_b_id !== teamFilter) {
        return;
      }

      const hasResult = resultsMap.has(match.id);
      if (statusFilter === 'played' && !hasResult) return;
      if (statusFilter === 'open' && hasResult) return;

      const existing = grouped.get(match.week) || [];
      existing.push(match);
      grouped.set(match.week, existing);
    });

    return grouped;
  }, [matches, leagueTeamIds, teamFilter, statusFilter, resultsMap]);

  // Get all weeks
  const weeks = useMemo(() => {
    const allWeeks = Array.from(matchesByWeek.keys()).sort((a, b) => a - b);
    if (weekFilter !== 'all') {
      return allWeeks.filter(w => w === parseInt(weekFilter));
    }
    return allWeeks;
  }, [matchesByWeek, weekFilter]);

  // Generate schedule if no matches exist
  const handleGenerateSchedule = async () => {
    if (!teams || matches?.length) return;

    try {
      const schedule = generateSchedule(teams);
      await createMatches.mutateAsync(
        schedule.map(m => ({
          team_a_id: m.team_a_id,
          team_b_id: m.team_b_id,
          week: m.week,
          match_type: 'group' as const,
        }))
      );

      toast({
        title: 'Spielplan erstellt',
        description: `${schedule.length} Spiele wurden generiert.`,
      });
    } catch (error: any) {
      toast({
        title: 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const maxWeek = matches?.length
    ? Math.max(...matches.map(m => m.week))
    : 11;

  return (
    <div className="space-y-6">
      {/* Generate Schedule Button (Admin only) */}
      {isAdmin && (!matches || matches.length === 0) && (
        <Button
          onClick={handleGenerateSchedule}
          disabled={createMatches.isPending}
        >
          {createMatches.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Spielplan generieren
        </Button>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 p-4 bg-card rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
        </div>

        <Select value={weekFilter} onValueChange={setWeekFilter}>
          <SelectTrigger className="w-[140px] bg-background">
            <SelectValue placeholder="Spielwoche" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">Alle Wochen</SelectItem>
            {Array.from({ length: maxWeek }, (_, i) => (
              <SelectItem key={i + 1} value={String(i + 1)}>
                Woche {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={teamFilter} onValueChange={setTeamFilter}>
          <SelectTrigger className="w-[160px] bg-background">
            <SelectValue placeholder="Team" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">Alle Teams</SelectItem>
            {teams?.map(team => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] bg-background">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">Alle</SelectItem>
            <SelectItem value="open">Ausstehend</SelectItem>
            <SelectItem value="played">Gespielt</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Match List */}
      {matchesLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="h-40 bg-muted animate-pulse rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : weeks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {matches?.length === 0
            ? 'Noch kein Spielplan erstellt.'
            : 'Keine Spiele gefunden.'}
        </div>
      ) : (
        <div className="space-y-8">
          {weeks.map(week => (
            <WeekSection
              key={week}
              week={week}
              matches={matchesByWeek.get(week) || []}
              results={resultsMap}
            />
          ))}
        </div>
      )}
    </div>
  );
}

