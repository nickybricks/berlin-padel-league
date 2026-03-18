import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTeams } from '@/hooks/useTeams';
import { useMatches, useMatchResults } from '@/hooks/useMatches';
import { useAuth } from '@/hooks/useAuth';
import { calculateStandings } from '@/lib/standings';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Users, Crown, Calendar, Trophy, ArrowLeft, Mail, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MatchResult } from '@/types/database';
import { TeamLogoUpload } from '@/components/teams/TeamLogoUpload';
import { TeamEditDialog } from '@/components/teams/TeamEditDialog';
import { TeamLogoLightbox } from '@/components/teams/TeamLogoLightbox';

export default function TeamPage() {
  const { leagueId, teamId } = useParams<{ leagueId: string; teamId: string }>();
  const { isAdmin, teamId: userTeamId } = useAuth();
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { data: matches, isLoading: matchesLoading } = useMatches('group');
  const { data: results, isLoading: resultsLoading } = useMatchResults();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const team = teams?.find(t => t.id === teamId);

  // User can edit if they are admin or if this is their team
  const canEdit = isAdmin || userTeamId === teamId;

  const teamMatches = useMemo(() => {
    if (!matches || !teamId) return [];
    return matches.filter(m => m.team_a_id === teamId || m.team_b_id === teamId);
  }, [matches, teamId]);

  const standings = useMemo(() => {
    if (!teams || !matches || !results) return [];
    return calculateStandings(teams, matches, results);
  }, [teams, matches, results]);

  const teamStanding = standings.find(s => s.team.id === teamId);

  const getMatchResult = (matchId: string): MatchResult | undefined => {
    return results?.find(r => r.match_id === matchId);
  };

  const logoUrl = team?.logo_url
    ? `https://hoinybrkpfhedbltdbxq.supabase.co/storage/v1/object/public/${team.logo_url}`
    : null;

  const formatPhone = (phone: string | null) => {
    if (!phone) return null;
    return phone.replace(/(\+49|0)(\d{3})(\d+)/, '$1 $2 $3');
  };

  const isLoading = teamsLoading || matchesLoading || resultsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-muted-foreground">Team nicht gefunden</h1>
        <Link to={`/league/${leagueId}/teams`}>
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zu Teams
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to={`/league/${leagueId}/teams`}>
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Alle Teams
        </Button>
      </Link>

      {/* Team Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Team Logo - Editable for Admins */}
          {isAdmin ? (
            <TeamLogoUpload
              teamId={team.id}
              currentLogoUrl={team.logo_url}
              teamName={team.name}
              size="lg"
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-muted overflow-hidden">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${team.name} Logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Users className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
          )}

          {/* Team Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{team.name}</h1>
              {canEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditDialogOpen(true)}
                  className="h-8 w-8"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Saison 2025</p>

            {/* Players */}
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Player 1 */}
              {team.player1_name && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Crown className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{team.player1_name}</span>
                      <Badge variant="secondary" className="text-xs">Spieler 1</Badge>
                    </div>
                    {team.player1_email && (
                      <a
                        href={`mailto:${team.player1_email}`}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mt-1"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {team.player1_email}
                      </a>
                    )}
                    {team.player1_phone && (
                      <a
                        href={`tel:${team.player1_phone}`}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mt-1"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {formatPhone(team.player1_phone)}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Player 2 */}
              {team.player2_name && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/50">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium">{team.player2_name}</span>
                    {team.player2_email && (
                      <a
                        href={`mailto:${team.player2_email}`}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mt-1"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {team.player2_email}
                      </a>
                    )}
                    {team.player2_phone && (
                      <a
                        href={`tel:${team.player2_phone}`}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mt-1"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {formatPhone(team.player2_phone)}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          {teamStanding && (
            <div className="flex flex-row sm:flex-col gap-4 text-center">
              <div className="bg-primary text-primary-foreground rounded-xl px-4 py-2">
                <div className="text-2xl font-bold">{teamStanding.rank}</div>
                <div className="text-xs opacity-80">Platz</div>
              </div>
              <div className="bg-muted rounded-xl px-4 py-2">
                <div className="text-2xl font-bold">{teamStanding.points}</div>
                <div className="text-xs text-muted-foreground">Punkte</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Matches Section */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-accent" />
          Spielplan
        </h2>
        <div className="space-y-3">
          {teamMatches.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Keine Spiele gefunden</p>
          ) : (
            teamMatches.map((match) => {
              const result = getMatchResult(match.id);
              const isTeamA = match.team_a_id === teamId;
              const opponent = isTeamA ? match.team_b : match.team_a;
              const isWinner = result?.winner_id === teamId;
              const isLoser = result && result.winner_id !== teamId;

              return (
                <div
                  key={match.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    result
                      ? isWinner
                        ? 'bg-success/10 border-success/30'
                        : 'bg-destructive/10 border-destructive/30'
                      : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">Woche {match.week}</Badge>
                    <span className="text-muted-foreground">vs</span>
                    <Link
                      to={`/league/${leagueId}/teams/${opponent.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {opponent.name}
                    </Link>
                  </div>
                  <div className="text-right">
                    {result ? (
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isWinner ? 'text-success' : 'text-destructive'}`}>
                          {isTeamA
                            ? `${result.set1_a}:${result.set1_b}, ${result.set2_a}:${result.set2_b}${result.set3_a !== null ? `, ${result.set3_a}:${result.set3_b}` : ''}`
                            : `${result.set1_b}:${result.set1_a}, ${result.set2_b}:${result.set2_a}${result.set3_b !== null ? `, ${result.set3_b}:${result.set3_a}` : ''}`
                          }
                        </span>
                        <Badge variant={isWinner ? 'default' : 'destructive'}>
                          {isWinner ? 'S' : 'N'}
                        </Badge>
                      </div>
                    ) : (
                      <Badge variant="secondary">Ausstehend</Badge>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Standings Section */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-accent" />
          Tabelle
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="pb-3 pl-4 w-12">#</th>
                <th className="pb-3">Team</th>
                <th className="pb-3 text-center">Sp</th>
                <th className="pb-3 text-center">S</th>
                <th className="pb-3 text-center">N</th>
                <th className="pb-3 text-center pr-4 font-semibold">Pkt</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((standing) => {
                const isCurrentTeam = standing.team.id === teamId;
                const isPlayoff = standing.rank <= 8;

                return (
                  <tr
                    key={standing.team.id}
                    className={`border-b last:border-0 ${
                      isCurrentTeam
                        ? 'bg-primary/10 font-semibold'
                        : isPlayoff
                        ? 'playoff-qualified'
                        : ''
                    }`}
                  >
                    <td className="py-3 pl-4">
                      <div className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                        isCurrentTeam
                          ? 'bg-primary text-primary-foreground'
                          : isPlayoff
                          ? 'bg-accent/20 text-accent-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {standing.rank}
                      </div>
                    </td>
                    <td className="py-3">
                      {isCurrentTeam ? (
                        <span>{standing.team.name}</span>
                      ) : (
                        <Link
                          to={`/league/${leagueId}/teams/${standing.team.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {standing.team.name}
                        </Link>
                      )}
                    </td>
                    <td className="py-3 text-center text-muted-foreground">{standing.played}</td>
                    <td className="py-3 text-center text-success">{standing.wins}</td>
                    <td className="py-3 text-center text-destructive">{standing.losses}</td>
                    <td className="py-3 text-center pr-4">
                      <span className={`inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full text-sm font-bold ${
                        isCurrentTeam
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        {standing.points}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Dialog */}
      {team && (
        <TeamEditDialog
          team={team}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
    </div>
  );
}

