import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLeagueById, useLeagueTeams } from '@/hooks/useLeagues';
import { useMatches, useMatchResults } from '@/hooks/useMatches';
import {
  useLeagueMembers,
  useUpdateMemberRole,
  useUpdateMemberTeam,
  useRemoveMember,
  LeagueMemberWithDetails
} from '@/hooks/useLeagueMembers';
import { LeagueSettingsCard } from '@/components/leagues/LeagueSettingsCard';
import { TournamentFormatCard } from '@/components/leagues/TournamentFormatCard';
import { GroupAssignment } from '@/components/leagues/GroupAssignment';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Loader2, Shield, Users, Trash2, UserCog } from 'lucide-react';
import { LeagueRole } from '@/types/leagues';

export default function LeagueAdmin() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const { user, isAdmin, loading: authLoading } = useAuth();

  const { data: league, isLoading: leagueLoading } = useLeagueById(leagueId);
  const { data: teams } = useLeagueTeams(leagueId);
  const { data: members, isLoading: membersLoading } = useLeagueMembers(leagueId);
  const { data: matches } = useMatches('group');
  const { data: results } = useMatchResults();

  const updateRole = useUpdateMemberRole();
  const updateTeam = useUpdateMemberTeam();
  const removeMember = useRemoveMember();

  const [processingId, setProcessingId] = useState<string | null>(null);

  // Redirect non-admins
  if (!authLoading && !isAdmin) {
    return <Navigate to={`/league/${leagueId}`} replace />;
  }

  const handleRoleChange = async (member: LeagueMemberWithDetails, newRole: LeagueRole) => {
    if (member.user_id === user?.id && newRole !== 'admin') {
      toast.error('Du kannst deine eigene Admin-Rolle nicht entfernen');
      return;
    }

    setProcessingId(member.id);
    try {
      await updateRole.mutateAsync({ memberId: member.id, newRole });
      toast.success(`Rolle aktualisiert`);
    } catch (error) {
      toast.error('Fehler beim Aktualisieren der Rolle');
    } finally {
      setProcessingId(null);
    }
  };

  const handleTeamChange = async (member: LeagueMemberWithDetails, newTeamId: string) => {
    setProcessingId(member.id);
    try {
      await updateTeam.mutateAsync({
        memberId: member.id,
        newTeamId: newTeamId === 'none' ? null : newTeamId
      });
      toast.success(`Team-Zuordnung aktualisiert`);
    } catch (error) {
      toast.error('Fehler beim Aktualisieren des Teams');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemoveMember = async (member: LeagueMemberWithDetails) => {
    if (member.user_id === user?.id) {
      toast.error('Du kannst dich nicht selbst entfernen');
      return;
    }

    setProcessingId(member.id);
    try {
      await removeMember.mutateAsync(member.id);
      toast.success(`Mitglied entfernt`);
    } catch (error) {
      toast.error('Fehler beim Entfernen des Mitglieds');
    } finally {
      setProcessingId(null);
    }
  };

  const isLoading = leagueLoading || membersLoading || authLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* League Settings */}
      {league && <LeagueSettingsCard league={league} />}

      {/* Tournament Format */}
      {league && <TournamentFormatCard league={league} />}

      {/* Group Assignment (only when format is groups) */}
      {league && league.format_type === 'groups' && teams && matches && results && (
        <GroupAssignment
          league={league}
          teams={teams}
          matches={matches}
          results={results}
        />
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <UserCog className="h-5 w-5 text-primary" />
          Mitgliederverwaltung
        </h2>
        <p className="text-muted-foreground mt-1">
          {members?.length ?? 0} Mitglieder
        </p>
      </div>

      {/* Members Table */}
      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Mitglied</TableHead>
              <TableHead>Rolle</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Beigetreten</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members?.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {member.profile?.display_name || member.profile?.email || 'Unbekannt'}
                    </div>
                    {member.profile?.email && member.profile?.display_name && (
                      <div className="text-sm text-muted-foreground">
                        {member.profile.email}
                      </div>
                    )}
                    {member.user_id === user?.id && (
                      <Badge variant="outline" className="mt-1 text-xs">Du</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={member.role}
                    onValueChange={(value) => handleRoleChange(member, value as LeagueRole)}
                    disabled={processingId === member.id || member.user_id === user?.id}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3" />
                          Admin
                        </div>
                      </SelectItem>
                      <SelectItem value="player">
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          Spieler
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={member.team_id || 'none'}
                    onValueChange={(value) => handleTeamChange(member, value)}
                    disabled={processingId === member.id}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Kein Team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Kein Team</SelectItem>
                      {teams?.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(member.created_at).toLocaleDateString('de-DE')}
                </TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={processingId === member.id || member.user_id === user?.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Mitglied entfernen?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Möchtest du {member.profile?.email || 'dieses Mitglied'} wirklich aus der Liga entfernen?
                          Diese Aktion kann nicht rückgängig gemacht werden.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemoveMember(member)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Entfernen
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
            {(!members || members.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Keine Mitglieder gefunden
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

