import { useState, useMemo } from 'react';
import { useDemoLeague } from '../DemoLeagueContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Clock, User } from 'lucide-react';
import { getSetScore, formatSetResult } from '@/lib/standings';

export default function DemoSchedule({ compact = false }: { compact?: boolean }) {
  const { matches, results, teams, getTeam, getMatchGroup, setActiveTab, setSelectedMatchId } = useDemoLeague();
  const [groupFilter, setGroupFilter] = useState('all');
  const [weekFilter, setWeekFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return matches.filter(m => {
      if (groupFilter !== 'all' && getMatchGroup(m) !== groupFilter) return false;
      if (weekFilter !== 'all' && m.week !== Number(weekFilter)) return false;
      if (teamFilter !== 'all' && m.team_a_id !== teamFilter && m.team_b_id !== teamFilter) return false;
      const hasResult = !!results[m.id];
      if (statusFilter === 'played' && !hasResult) return false;
      if (statusFilter === 'pending' && hasResult) return false;
      return true;
    });
  }, [matches, results, groupFilter, weekFilter, teamFilter, statusFilter, getMatchGroup]);

  const weeks = [1, 2, 3];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className={`flex flex-wrap gap-2 ${compact ? 'hidden' : ''}`}>
        <Select value={groupFilter} onValueChange={setGroupFilter}>
          <SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Gruppen</SelectItem>
            <SelectItem value="A">Gruppe A</SelectItem>
            <SelectItem value="B">Gruppe B</SelectItem>
          </SelectContent>
        </Select>
        <Select value={weekFilter} onValueChange={setWeekFilter}>
          <SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Wochen</SelectItem>
            <SelectItem value="1">Woche 1</SelectItem>
            <SelectItem value="2">Woche 2</SelectItem>
            <SelectItem value="3">Woche 3</SelectItem>
          </SelectContent>
        </Select>
        <Select value={teamFilter} onValueChange={setTeamFilter}>
          <SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Teams</SelectItem>
            {teams.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle</SelectItem>
            <SelectItem value="played">Gespielt</SelectItem>
            <SelectItem value="pending">Ausstehend</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Matches by week */}
      {weeks.map(week => {
        const weekMatches = filtered.filter(m => m.week === week);
        if (weekMatches.length === 0) return null;
        const playedCount = weekMatches.filter(m => results[m.id]).length;

        return (
          <div key={week} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold ${compact ? 'text-sm' : 'text-base'}`}>Spielwoche {week}</h3>
              <span className="text-xs text-muted-foreground">{playedCount}/{weekMatches.length} gespielt</span>
            </div>
            <div className={`grid gap-3 ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
              {weekMatches.map(match => {
                const result = results[match.id];
                const teamA = getTeam(match.team_a_id);
                const teamB = getTeam(match.team_b_id);
                if (!teamA || !teamB) return null;

                const isPlayed = !!result;
                const isWinnerA = result?.winner_id === match.team_a_id;

                return (
                  <Card
                    key={match.id}
                    className={`match-card p-3 ${!isPlayed ? 'cursor-pointer hover:border-accent/50' : ''}`}
                    onClick={() => {
                      if (!isPlayed) {
                        setSelectedMatchId(match.id);
                        setActiveTab('ergebnis');
                      }
                    }}
                  >
                    {/* Status row */}
                    <div className="flex items-center justify-between mb-2">
                      {isPlayed ? (
                        <Badge className="sport-badge bg-accent/10 text-accent border-accent/20">
                          <Check className="h-3 w-3" /> Gespielt
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="sport-badge">
                          <Clock className="h-3 w-3" /> Ausstehend
                        </Badge>
                      )}
                      {isPlayed && result && (
                        <span className="text-sm font-bold text-accent">{getSetScore(result)}</span>
                      )}
                    </div>

                    {/* Team A */}
                    <div className={`flex items-center justify-between py-1 ${isPlayed && isWinnerA ? 'text-accent font-semibold' : ''}`}>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <span className="text-sm truncate">{teamA.name}</span>
                      </div>
                      {isPlayed && result && (
                        <span className="text-xs font-mono text-muted-foreground">
                          {result.set1_a} | {result.set2_a}{result.set3_a !== null ? ` | ${result.set3_a}` : ''}
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] text-muted-foreground text-center my-0.5">vs</p>

                    {/* Team B */}
                    <div className={`flex items-center justify-between py-1 ${isPlayed && !isWinnerA ? 'text-accent font-semibold' : ''}`}>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <span className="text-sm truncate">{teamB.name}</span>
                      </div>
                      {isPlayed && result && (
                        <span className="text-xs font-mono text-muted-foreground">
                          {result.set1_b} | {result.set2_b}{result.set3_b !== null ? ` | ${result.set3_b}` : ''}
                        </span>
                      )}
                    </div>

                    {/* Set scores text */}
                    {isPlayed && result && (
                      <p className="text-[11px] text-muted-foreground mt-2 pt-2 border-t">
                        {formatSetResult(result)}
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
