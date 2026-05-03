import { useEffect, useState } from 'react';
import { MatchWithTeams, MatchResult, Team } from '@/types/database';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUpsertResult, useDeleteResult, useUpdateMatch } from '@/hooks/useMatches';
import { toast } from '@/hooks/use-toast';

interface EditMatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match: MatchWithTeams;
  result?: MatchResult;
  teams: Team[];
}

export function EditMatchDialog({ open, onOpenChange, match, result, teams }: EditMatchDialogProps) {
  const { user } = useAuth();
  const upsert = useUpsertResult();
  const del = useDeleteResult();
  const updateMatch = useUpdateMatch();

  const [teamA, setTeamA] = useState(match.team_a_id);
  const [teamB, setTeamB] = useState(match.team_b_id);
  const [s1a, setS1a] = useState<number>(result?.set1_a ?? 0);
  const [s1b, setS1b] = useState<number>(result?.set1_b ?? 0);
  const [s2a, setS2a] = useState<number>(result?.set2_a ?? 0);
  const [s2b, setS2b] = useState<number>(result?.set2_b ?? 0);
  const [s3a, setS3a] = useState<number | ''>(result?.set3_a ?? '');
  const [s3b, setS3b] = useState<number | ''>(result?.set3_b ?? '');
  const [comment, setComment] = useState(result?.comment ?? '');

  useEffect(() => {
    if (open) {
      setTeamA(match.team_a_id);
      setTeamB(match.team_b_id);
      setS1a(result?.set1_a ?? 0);
      setS1b(result?.set1_b ?? 0);
      setS2a(result?.set2_a ?? 0);
      setS2b(result?.set2_b ?? 0);
      setS3a(result?.set3_a ?? '');
      setS3b(result?.set3_b ?? '');
      setComment(result?.comment ?? '');
    }
  }, [open, match, result]);

  const set1Winner = s1a > s1b ? 'a' : s1a < s1b ? 'b' : null;
  const set2Winner = s2a > s2b ? 'a' : s2a < s2b ? 'b' : null;
  const needsThirdSet = !!(set1Winner && set2Winner && set1Winner !== set2Winner);

  const handleSave = async () => {
    try {
      if (teamA === teamB) {
        toast({ title: 'Fehler', description: 'Beide Teams müssen unterschiedlich sein.', variant: 'destructive' });
        return;
      }
      // Update teams if changed
      if (teamA !== match.team_a_id || teamB !== match.team_b_id) {
        await updateMatch.mutateAsync({ id: match.id, team_a_id: teamA, team_b_id: teamB });
      }

      let setsA = 0, setsB = 0;
      if (s1a > s1b) setsA++; else if (s1b > s1a) setsB++;
      if (s2a > s2b) setsA++; else if (s2b > s2a) setsB++;
      const has3 = needsThirdSet && s3a !== '' && s3b !== '';
      if (has3) {
        if ((s3a as number) > (s3b as number)) setsA++; else setsB++;
      }

      if (setsA < 2 && setsB < 2) {
        toast({ title: 'Ungültiges Ergebnis', description: 'Ein Team muss mindestens 2 Sätze gewinnen.', variant: 'destructive' });
        return;
      }

      const winner_id = setsA > setsB ? teamA : teamB;

      await upsert.mutateAsync({
        match_id: match.id,
        set1_a: s1a, set1_b: s1b,
        set2_a: s2a, set2_b: s2b,
        set3_a: has3 ? (s3a as number) : null,
        set3_b: has3 ? (s3b as number) : null,
        winner_id,
        entered_by: user?.id ?? null,
        comment: comment || null,
      });

      toast({ title: 'Gespeichert', description: 'Das Spiel wurde aktualisiert.' });
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: 'Fehler', description: e.message, variant: 'destructive' });
    }
  };

  const handleDeleteResult = async () => {
    try {
      await del.mutateAsync(match.id);
      toast({ title: 'Ergebnis gelöscht' });
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: 'Fehler', description: e.message, variant: 'destructive' });
    }
  };

  const isPending = upsert.isPending || updateMatch.isPending || del.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Spiel bearbeiten</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Teams */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Team A</Label>
              <Select value={teamA} onValueChange={setTeamA}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {teams.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Team B</Label>
              <Select value={teamB} onValueChange={setTeamB}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {teams.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sets */}
          <div className="space-y-3">
            <SetRow label="Satz 1" a={s1a} b={s1b} setA={setS1a} setB={setS1b} />
            <SetRow label="Satz 2" a={s2a} b={s2b} setA={setS2a} setB={setS2b} />
            {needsThirdSet && (
              <SetRow
                label="Satz 3"
                a={s3a === '' ? 0 : s3a}
                b={s3b === '' ? 0 : s3b}
                setA={(v) => setS3a(v)}
                setB={(v) => setS3b(v)}
              />
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Kommentar (optional)</Label>
            <Input value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {result && (
            <Button
              type="button"
              variant="outline"
              onClick={handleDeleteResult}
              disabled={isPending}
              className="sm:mr-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Ergebnis löschen
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>
            Abbrechen
          </Button>
          <Button type="button" onClick={handleSave} disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SetRow({
  label,
  a,
  b,
  setA,
  setB,
}: {
  label: string;
  a: number;
  b: number;
  setA: (v: number) => void;
  setB: (v: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2 items-center">
      <Label className="col-span-1 text-right">{label}</Label>
      <div className="col-span-4 flex items-center gap-2">
        <Input
          type="number"
          min={0}
          max={7}
          value={a}
          onChange={(e) => setA(Number(e.target.value))}
          className="text-center"
        />
        <span className="text-muted-foreground">:</span>
        <Input
          type="number"
          min={0}
          max={7}
          value={b}
          onChange={(e) => setB(Number(e.target.value))}
          className="text-center"
        />
      </div>
    </div>
  );
}