import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MatchWithTeams } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSubmitResult } from '@/hooks/useMatches';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const resultSchema = z.object({
  set1_a: z.number().min(0).max(7),
  set1_b: z.number().min(0).max(7),
  set2_a: z.number().min(0).max(7),
  set2_b: z.number().min(0).max(7),
  set3_a: z.number().min(0).max(7).optional(),
  set3_b: z.number().min(0).max(7).optional(),
  comment: z.string().optional(),
});

type ResultFormData = z.infer<typeof resultSchema>;

interface ResultFormProps {
  matches: MatchWithTeams[];
  playedMatchIds: Set<string>;
}

export function ResultForm({ matches, playedMatchIds }: ResultFormProps) {
  const [selectedMatchId, setSelectedMatchId] = useState<string>('');
  const [needsThirdSet, setNeedsThirdSet] = useState(false);
  const { user, teamId, isAdmin, isCaptain } = useAuth();
  const submitResult = useSubmitResult();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ResultFormData>({
    defaultValues: {
      set1_a: 0,
      set1_b: 0,
      set2_a: 0,
      set2_b: 0,
    },
  });

  const set1_a = watch('set1_a');
  const set1_b = watch('set1_b');
  const set2_a = watch('set2_a');
  const set2_b = watch('set2_b');

  // Check if third set is needed
  const checkThirdSet = () => {
    const set1Winner = set1_a > set1_b ? 'a' : 'b';
    const set2Winner = set2_a > set2_b ? 'a' : 'b';
    setNeedsThirdSet(set1Winner !== set2Winner);
  };

  // Filter matches based on user role
  const availableMatches = matches.filter(match => {
    // Skip already played matches
    if (playedMatchIds.has(match.id)) return false;
    
    // Admins can enter any result
    if (isAdmin) return true;
    
    // Captains can only enter their team's matches
    if (isCaptain && teamId) {
      return match.team_a_id === teamId || match.team_b_id === teamId;
    }
    
    return false;
  });

  const selectedMatch = matches.find(m => m.id === selectedMatchId);

  const onSubmit = async (data: ResultFormData) => {
    if (!selectedMatch || !user) return;

    // Calculate sets won
    let setsA = 0;
    let setsB = 0;
    
    if (data.set1_a > data.set1_b) setsA++;
    else setsB++;
    
    if (data.set2_a > data.set2_b) setsA++;
    else setsB++;
    
    if (needsThirdSet && data.set3_a !== undefined && data.set3_b !== undefined) {
      if (data.set3_a > data.set3_b) setsA++;
      else setsB++;
    }

    // Validate winner
    if (setsA < 2 && setsB < 2) {
      toast({
        title: 'Ungültiges Ergebnis',
        description: 'Ein Team muss mindestens 2 Sätze gewinnen.',
        variant: 'destructive',
      });
      return;
    }

    const winnerId = setsA > setsB ? selectedMatch.team_a_id : selectedMatch.team_b_id;

    try {
      await submitResult.mutateAsync({
        match_id: selectedMatch.id,
        set1_a: data.set1_a,
        set1_b: data.set1_b,
        set2_a: data.set2_a,
        set2_b: data.set2_b,
        set3_a: needsThirdSet ? (data.set3_a ?? null) : null,
        set3_b: needsThirdSet ? (data.set3_b ?? null) : null,
        winner_id: winnerId,
        entered_by: user.id,
        comment: data.comment || null,
      });

      toast({
        title: 'Ergebnis eingetragen',
        description: `${selectedMatch.team_a.name} vs ${selectedMatch.team_b.name}`,
      });

      reset();
      setSelectedMatchId('');
      setNeedsThirdSet(false);
    } catch (error: any) {
      console.error('Result submission error:', error);
      toast({
        title: 'Fehler',
        description: 'Das Ergebnis konnte nicht gespeichert werden. Bitte versuche es erneut.',
        variant: 'destructive',
      });
    }
  };

  if (availableMatches.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Keine offenen Spiele verfügbar.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Match Selection */}
      <div className="space-y-2">
        <Label>Spiel auswählen</Label>
        <Select value={selectedMatchId} onValueChange={setSelectedMatchId}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Wähle ein Spiel..." />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            {availableMatches.map(match => (
              <SelectItem key={match.id} value={match.id}>
                Woche {match.week}: {match.team_a.name} vs {match.team_b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedMatch && (
        <>
          {/* Set Scores */}
          <div className="space-y-4">
            {/* Set 1 */}
            <div className="grid grid-cols-5 gap-2 items-center">
              <Label className="col-span-1 text-right">Satz 1</Label>
              <div className="col-span-2 flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={7}
                  {...register('set1_a', { valueAsNumber: true })}
                  onBlur={checkThirdSet}
                  className="text-center"
                />
                <span className="text-muted-foreground">:</span>
                <Input
                  type="number"
                  min={0}
                  max={7}
                  {...register('set1_b', { valueAsNumber: true })}
                  onBlur={checkThirdSet}
                  className="text-center"
                />
              </div>
              <div className="col-span-2 text-sm text-muted-foreground">
                {selectedMatch.team_a.name} : {selectedMatch.team_b.name}
              </div>
            </div>

            {/* Set 2 */}
            <div className="grid grid-cols-5 gap-2 items-center">
              <Label className="col-span-1 text-right">Satz 2</Label>
              <div className="col-span-2 flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={7}
                  {...register('set2_a', { valueAsNumber: true })}
                  onBlur={checkThirdSet}
                  className="text-center"
                />
                <span className="text-muted-foreground">:</span>
                <Input
                  type="number"
                  min={0}
                  max={7}
                  {...register('set2_b', { valueAsNumber: true })}
                  onBlur={checkThirdSet}
                  className="text-center"
                />
              </div>
            </div>

            {/* Set 3 (conditional) */}
            {needsThirdSet && (
              <div className="grid grid-cols-5 gap-2 items-center animate-fade-in">
                <Label className="col-span-1 text-right">Satz 3</Label>
                <div className="col-span-2 flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={7}
                    {...register('set3_a', { valueAsNumber: true })}
                    className="text-center"
                  />
                  <span className="text-muted-foreground">:</span>
                  <Input
                    type="number"
                    min={0}
                    max={7}
                    {...register('set3_b', { valueAsNumber: true })}
                    className="text-center"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label>Kommentar (optional)</Label>
            <Textarea
              {...register('comment')}
              placeholder="z.B. Besondere Vorkommnisse..."
              rows={2}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={submitResult.isPending}
          >
            {submitResult.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Speichern...
              </>
            ) : (
              'Ergebnis eintragen'
            )}
          </Button>
        </>
      )}
    </form>
  );
}
