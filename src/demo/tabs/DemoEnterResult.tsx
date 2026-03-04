import { useState, useEffect, useMemo } from 'react';
import { useDemoLeague } from '../DemoLeagueContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function DemoEnterResult({ compact = false }: { compact?: boolean }) {
  const { matches, results, getTeam, submitResult, selectedMatchId, setSelectedMatchId } = useDemoLeague();
  const { toast } = useToast();

  const pendingMatches = useMemo(
    () => matches.filter(m => !results[m.id]),
    [matches, results]
  );

  const [matchId, setMatchId] = useState<string>(selectedMatchId || '');
  const [sets, setSets] = useState<{ a: number; b: number }[]>([{ a: 0, b: 0 }, { a: 0, b: 0 }]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (selectedMatchId) {
      setMatchId(selectedMatchId);
      setSelectedMatchId(null);
    }
  }, [selectedMatchId, setSelectedMatchId]);

  const selectedMatch = matches.find(m => m.id === matchId);
  const teamA = selectedMatch ? getTeam(selectedMatch.team_a_id) : null;
  const teamB = selectedMatch ? getTeam(selectedMatch.team_b_id) : null;

  // Determine if set 3 is needed
  const set1Winner = sets[0].a > sets[0].b ? 'a' : sets[0].b > sets[0].a ? 'b' : null;
  const set2Winner = sets[1].a > sets[1].b ? 'a' : sets[1].b > sets[1].a ? 'b' : null;
  const needsSet3 = set1Winner && set2Winner && set1Winner !== set2Winner;

  useEffect(() => {
    if (needsSet3 && sets.length < 3) {
      setSets(prev => [...prev, { a: 0, b: 0 }]);
    } else if (!needsSet3 && sets.length > 2) {
      setSets(prev => prev.slice(0, 2));
    }
  }, [needsSet3, sets.length]);

  const handleSubmit = () => {
    if (!matchId) return;
    const validSets = sets.filter(s => s.a > 0 || s.b > 0);
    if (validSets.length < 2) {
      toast({ title: 'Fehler', description: 'Bitte trage mindestens 2 Sätze ein.', variant: 'destructive' });
      return;
    }
    submitResult(matchId, validSets, comment);
    toast({ title: '✅ Ergebnis eingetragen!', description: 'Tabelle wurde aktualisiert.' });
    setMatchId('');
    setSets([{ a: 0, b: 0 }, { a: 0, b: 0 }]);
    setComment('');
  };

  const updateSet = (idx: number, side: 'a' | 'b', value: string) => {
    const num = Math.max(0, parseInt(value) || 0);
    setSets(prev => prev.map((s, i) => (i === idx ? { ...s, [side]: num } : s)));
  };

  return (
    <div className="space-y-4 max-w-xl">
      <Badge className="bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/30">
        Demo-Modus
      </Badge>

      {/* Match select */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className={compact ? 'text-sm' : 'text-base'}>Spiel auswählen</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={matchId} onValueChange={setMatchId}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Wähle ein Spiel..." />
            </SelectTrigger>
            <SelectContent>
              {pendingMatches.map(m => {
                const a = getTeam(m.team_a_id);
                const b = getTeam(m.team_b_id);
                return (
                  <SelectItem key={m.id} value={m.id}>
                    {a?.name} vs {b?.name} – Spielwoche {m.week}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Score entry */}
      {selectedMatch && teamA && teamB && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className={compact ? 'text-sm' : 'text-base'}>
              {teamA.name} vs {teamB.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sets.map((s, idx) => (
              <div key={idx}>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Satz {idx + 1}</p>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    value={s.a || ''}
                    onChange={e => updateSet(idx, 'a', e.target.value)}
                    className="h-9 w-20 text-center"
                    placeholder="0"
                  />
                  <span className="text-sm text-muted-foreground">:</span>
                  <Input
                    type="number"
                    min={0}
                    value={s.b || ''}
                    onChange={e => updateSet(idx, 'b', e.target.value)}
                    className="h-9 w-20 text-center"
                    placeholder="0"
                  />
                </div>
              </div>
            ))}

            {!compact && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Kommentar (optional)</p>
                <Textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="z.B. Spannendes Spiel!"
                  className="resize-none h-16 text-sm"
                />
              </div>
            )}

            <Button onClick={handleSubmit} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Ergebnis eintragen
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {!compact && (
        <Card className="bg-muted/50 border-0">
          <CardContent className="pt-5">
            <p className="text-xs font-medium mb-2">Anleitung</p>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Wähle das Spiel aus der Liste</li>
              <li>Trage die Spielstände für jeden Satz ein</li>
              <li>Bei 1:1 Sätzen wird automatisch Satz 3 angezeigt</li>
              <li>Optional: Füge einen Kommentar hinzu</li>
              <li>Klicke auf „Ergebnis eintragen"</li>
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
