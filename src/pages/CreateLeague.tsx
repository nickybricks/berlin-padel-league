import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Copy, Loader2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { NotchHeader } from '@/components/layout/NotchHeader';
import { useAuth } from '@/hooks/useAuth';
import { useCreateLeague } from '@/hooks/useCreateLeague';
import { toast } from 'sonner';
import type { FormatType, PlayoffFormat } from '@/types/leagues';

type Step = 1 | 2 | 3 | 'done';

export default function CreateLeague() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const createLeague = useCreateLeague();

  // Step 1
  const [name, setName] = useState('');

  // Step 2
  const [formatType, setFormatType] = useState<FormatType>('round_robin');
  const [groupCount, setGroupCount] = useState(2);
  const [homeAndAway, setHomeAndAway] = useState(false);
  const [limitTeams, setLimitTeams] = useState(false);
  const [maxTeams, setMaxTeams] = useState(16);

  // Step 3
  const [playoffFormat, setPlayoffFormat] = useState<PlayoffFormat>('top4_bracket');
  const [qualifiers, setQualifiers] = useState(4);

  // Result
  const [createdLeague, setCreatedLeague] = useState<{ id: string; code: string; name: string } | null>(null);

  const [step, setStep] = useState<Step>(1);

  useEffect(() => {
    if (!authLoading && !user) navigate('/', { replace: true });
  }, [user, authLoading, navigate]);

  const handleCreate = async () => {
    try {
      const league = await createLeague.mutateAsync({
        name: name.trim(),
        format_type: formatType,
        group_count: formatType === 'round_robin' ? 1 : groupCount,
        home_and_away: homeAndAway,
        max_teams: limitTeams ? maxTeams : null,
        playoff_format: playoffFormat,
        playoff_qualifiers_per_group: qualifiers,
      });
      setCreatedLeague({ id: league.id, code: league.code, name: league.name });
      setStep('done');
    } catch {
      toast.error('Fehler beim Erstellen der Liga');
    }
  };

  const copyLink = () => {
    if (!createdLeague) return;
    const link = `${window.location.origin}/join/${createdLeague.code}`;
    navigator.clipboard.writeText(link);
    toast.success('Link kopiert!');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NotchHeader />

      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Progress */}
          {step !== 'done' && (
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    s <= (step as number) ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Step 1: Basics */}
          {step === 1 && (
            <div className="bg-card rounded-xl border p-6 space-y-5">
              <div>
                <h1 className="text-xl font-bold tracking-tight">Liga erstellen</h1>
                <p className="text-sm text-muted-foreground mt-1">Schritt 1: Grundlagen</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="league-name">Liga-Name</Label>
                <Input
                  id="league-name"
                  placeholder="z.B. Berliner Padel Liga"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!name.trim()}>
                  Weiter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Format */}
          {step === 2 && (
            <div className="bg-card rounded-xl border p-6 space-y-5">
              <div>
                <h1 className="text-xl font-bold tracking-tight">Turnierformat</h1>
                <p className="text-sm text-muted-foreground mt-1">Schritt 2: Spielmodus</p>
              </div>

              <div className="space-y-2">
                <Label>Modus</Label>
                <RadioGroup value={formatType} onValueChange={(v) => setFormatType(v as FormatType)}>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="round_robin" id="rr" />
                    <Label htmlFor="rr" className="font-normal cursor-pointer">
                      Liga (Jeder gegen Jeden)
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="groups" id="groups" />
                    <Label htmlFor="groups" className="font-normal cursor-pointer">
                      Gruppenphase
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formatType === 'groups' && (
                <div className="space-y-2">
                  <Label>Anzahl Gruppen</Label>
                  <Select value={String(groupCount)} onValueChange={(v) => setGroupCount(Number(v))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Gruppen</SelectItem>
                      <SelectItem value="3">3 Gruppen</SelectItem>
                      <SelectItem value="4">4 Gruppen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label htmlFor="home-away">Hin- und Rückrunde</Label>
                <Switch id="home-away" checked={homeAndAway} onCheckedChange={setHomeAndAway} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="limit-teams">Teamanzahl begrenzen</Label>
                  <Switch id="limit-teams" checked={limitTeams} onCheckedChange={setLimitTeams} />
                </div>
                {limitTeams && (
                  <Input
                    type="number"
                    min={2}
                    max={64}
                    value={maxTeams}
                    onChange={(e) => setMaxTeams(Number(e.target.value))}
                    className="w-24"
                  />
                )}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück
                </Button>
                <Button onClick={() => setStep(3)}>
                  Weiter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Playoffs */}
          {step === 3 && (
            <div className="bg-card rounded-xl border p-6 space-y-5">
              <div>
                <h1 className="text-xl font-bold tracking-tight">Playoffs</h1>
                <p className="text-sm text-muted-foreground mt-1">Schritt 3: Playoff-Einstellungen</p>
              </div>

              <div className="space-y-2">
                <Label>Playoff-Format</Label>
                <Select value={playoffFormat} onValueChange={(v) => setPlayoffFormat(v as PlayoffFormat)}>
                  <SelectTrigger className="w-56">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top8_bracket">Top 8 Bracket</SelectItem>
                    <SelectItem value="top4_bracket">Top 4 Bracket</SelectItem>
                    {formatType === 'groups' && (
                      <SelectItem value="cross_group">Kreuzspiel</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {formatType === 'groups' && (
                <div className="space-y-2">
                  <Label>Qualifikanten pro Gruppe</Label>
                  <Input
                    type="number"
                    min={1}
                    max={8}
                    value={qualifiers}
                    onChange={(e) => setQualifiers(Number(e.target.value))}
                    className="w-24"
                  />
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück
                </Button>
                <Button onClick={handleCreate} disabled={createLeague.isPending}>
                  {createLeague.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Liga erstellen
                </Button>
              </div>
            </div>
          )}

          {/* Done */}
          {step === 'done' && createdLeague && (
            <div className="bg-card rounded-xl border p-6 space-y-5 text-center">
              <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Trophy className="h-7 w-7 text-primary" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Liga erstellt!</h1>
                <p className="text-muted-foreground mt-1">„{createdLeague.name}"</p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Beitrittscode</p>
                <p className="text-2xl font-mono font-bold tracking-widest">{createdLeague.code}</p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={copyLink}>
                  <Copy className="mr-2 h-4 w-4" />
                  Link kopieren
                </Button>
                <Button className="flex-1" onClick={() => navigate(`/league/${createdLeague.id}`)}>
                  Zur Liga
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
