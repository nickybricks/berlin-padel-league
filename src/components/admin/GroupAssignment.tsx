import { useState } from 'react';
import { Team } from '@/types/database';
import { useUpdateTeamGroup } from '@/hooks/useTeams';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Users } from 'lucide-react';

interface GroupAssignmentProps {
  teams: Team[];
}

export function GroupAssignment({ teams }: GroupAssignmentProps) {
  const updateGroup = useUpdateTeamGroup();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const groupA = teams.filter(t => t.group_name === 'A');
  const groupB = teams.filter(t => t.group_name === 'B');
  const ungrouped = teams.filter(t => !t.group_name);

  const handleGroupChange = async (teamId: string, group: string) => {
    setProcessingId(teamId);
    try {
      await updateGroup.mutateAsync({
        teamId,
        groupName: group === 'none' ? null : group,
      });
      toast.success('Gruppenzuordnung aktualisiert');
    } catch (error) {
      toast.error('Fehler beim Aktualisieren');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Gruppeneinteilung
        </h2>
        <div className="flex gap-2 text-sm">
          <Badge variant="outline">A: {groupA.length} Teams</Badge>
          <Badge variant="outline">B: {groupB.length} Teams</Badge>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y">
          {teams.map((team) => (
            <div key={team.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="font-medium">{team.name}</span>
                {team.group_name && (
                  <Badge variant={team.group_name === 'A' ? 'default' : 'secondary'}>
                    Gruppe {team.group_name}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {processingId === team.id && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                <Select
                  value={team.group_name ?? 'none'}
                  onValueChange={(value) => handleGroupChange(team.id, value)}
                  disabled={processingId === team.id}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Keine Gruppe</SelectItem>
                    <SelectItem value="A">Gruppe A</SelectItem>
                    <SelectItem value="B">Gruppe B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {ungrouped.length > 0 && (
        <p className="text-sm text-muted-foreground">
          ⚠️ {ungrouped.length} Team(s) noch keiner Gruppe zugeordnet.
        </p>
      )}
    </div>
  );
}
