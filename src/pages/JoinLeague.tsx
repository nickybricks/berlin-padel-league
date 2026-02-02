import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Trophy, ArrowLeft, Loader2, CheckCircle2, UserPlus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/hooks/useAuth';
import { useLeagueByCode, useLeagueTeams, useCheckEmailInLeagueTeam, useUserLeagues, getAvailablePlayerSlot } from '@/hooks/useLeagues';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type Step = 'loading' | 'auth' | 'team-select' | 'player-details' | 'joining' | 'success' | 'already-member' | 'not-found' | 'team-full';

interface PlayerSlotInfo {
  teamId: string;
  teamName: string;
  slot: 'player1' | 'player2';
}

export default function JoinLeague() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user, signIn, signUp, loading: authLoading } = useAuth();
  
  const [step, setStep] = useState<Step>('loading');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [playerSlotInfo, setPlayerSlotInfo] = useState<PlayerSlotInfo | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [playerPhone, setPlayerPhone] = useState('');
  const [savingDetails, setSavingDetails] = useState(false);
  
  const { data: league, isLoading: leagueLoading, error: leagueError } = useLeagueByCode(code);
  const { data: leagueTeams, isLoading: teamsLoading } = useLeagueTeams(league?.id);
  const { data: matchedTeam, isLoading: matchLoading } = useCheckEmailInLeagueTeam(league?.id, user?.email || undefined);
  const { data: userLeagues } = useUserLeagues(user?.id);

  // Determine current step based on state
  useEffect(() => {
    if (leagueLoading || authLoading) {
      setStep('loading');
      return;
    }

    if (leagueError || !league) {
      setStep('not-found');
      return;
    }

    if (!user) {
      setStep('auth');
      return;
    }

    // Check if already a member of this league
    const isAlreadyMember = userLeagues?.some(m => m.league_id === league.id);
    if (isAlreadyMember) {
      setStep('already-member');
      return;
    }

    if (matchLoading || teamsLoading) {
      setStep('loading');
      return;
    }

    // If email matches a team, go to details step (auto-select team + slot)
    if (matchedTeam) {
      if (playerSlotInfo?.teamId !== matchedTeam.id) {
        handleAutoJoin(matchedTeam);
      }
      return;
    }

    // Otherwise, show team selection
    if (step !== 'player-details' && step !== 'joining' && step !== 'success') {
      setStep('team-select');
    }
  }, [league, leagueLoading, leagueError, user, authLoading, matchedTeam, matchLoading, teamsLoading, userLeagues, playerSlotInfo, step]);

  const handleAutoJoin = (team: any) => {
    if (!league || !user) return;
    const email = user.email || '';

    const slotFromEmail = team.player1_email === email
      ? 'player1'
      : team.player2_email === email
        ? 'player2'
        : null;

    const slot = slotFromEmail || getAvailablePlayerSlot(team);

    if (!slot) {
      setStep('team-full');
      return;
    }

    setPlayerSlotInfo({
      teamId: team.id,
      teamName: team.name,
      slot,
    });
    setStep('player-details');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSubmitting(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast({ 
          title: 'Konto erstellt!',
          description: 'Bitte bestätige deine E-Mail-Adresse.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleTeamSelect = () => {
    if (!selectedTeamId || !leagueTeams) return;
    
    const selectedTeam = leagueTeams.find(t => t.id === selectedTeamId);
    if (!selectedTeam) return;
    
    const availableSlot = getAvailablePlayerSlot(selectedTeam);
    
    if (!availableSlot) {
      setStep('team-full');
      return;
    }
    
    setPlayerSlotInfo({
      teamId: selectedTeam.id,
      teamName: selectedTeam.name,
      slot: availableSlot,
    });
    setStep('player-details');
  };

  const handleSavePlayerDetails = async () => {
    if (!league || !user || !playerSlotInfo) return;
    
    if (!playerName.trim()) {
      toast({ title: 'Bitte gib deinen Namen ein', variant: 'destructive' });
      return;
    }
    
    setSavingDetails(true);
    setStep('joining');

    try {
      const { error } = await supabase.rpc('join_league_team', {
        _league_id: league.id,
        _team_id: playerSlotInfo.teamId,
        _player_name: playerName.trim(),
        _player_phone: playerPhone.trim() || null,
      });

      if (error) throw error;

      setStep('success');
      toast({ title: `Willkommen bei ${league.name}!` });
    } catch (error: any) {
      toast({
        title: 'Fehler beim Beitreten',
        description: error.message,
        variant: 'destructive',
      });
      setStep('player-details');
    } finally {
      setSavingDetails(false);
    }
  };

  const goToLeague = () => {
    if (league) {
      navigate(`/league/${league.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-md">
                <Trophy className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Liga beitreten
            </h1>
            {league && (
              <p className="text-muted-foreground">
                {league.name}
              </p>
            )}
          </div>

          {/* Content based on step */}
          {step === 'loading' && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {step === 'not-found' && (
            <div className="bg-card rounded-xl border p-6 text-center space-y-4">
              <p className="text-muted-foreground">
                Liga mit Code <strong>{code}</strong> nicht gefunden.
              </p>
              <Link to="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück zur Startseite
                </Button>
              </Link>
            </div>
          )}

          {step === 'auth' && (
            <div className="bg-card rounded-xl border p-6 space-y-4">
              <div className="text-center">
                <h2 className="font-semibold">
                  {isLogin ? 'Anmelden' : 'Registrieren'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {isLogin 
                    ? 'Melde dich an, um der Liga beizutreten.'
                    : 'Erstelle ein Konto, um der Liga beizutreten.'}
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="deine@email.de"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Passwort</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={authSubmitting}>
                  {authSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : isLogin ? (
                    <LogIn className="mr-2 h-4 w-4" />
                  ) : (
                    <UserPlus className="mr-2 h-4 w-4" />
                  )}
                  {isLogin ? 'Anmelden' : 'Registrieren'}
                </Button>
              </form>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  {isLogin ? 'Noch kein Konto?' : 'Bereits registriert?'}
                </span>{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline font-medium"
                >
                  {isLogin ? 'Registrieren' : 'Anmelden'}
                </button>
              </div>
            </div>
          )}

          {step === 'team-select' && leagueTeams && (
            <div className="bg-card rounded-xl border p-6 space-y-4">
              <div className="text-center">
                <h2 className="font-semibold">Team auswählen</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Welchem Team gehörst du an?
                </p>
              </div>

              <RadioGroup 
                value={selectedTeamId} 
                onValueChange={setSelectedTeamId}
                className="space-y-2"
              >
                {leagueTeams.map((team) => {
                  const availableSlot = getAvailablePlayerSlot(team);
                  const isFull = !availableSlot;
                  
                  return (
                    <div 
                      key={team.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer ${
                        isFull 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <RadioGroupItem 
                        value={team.id} 
                        id={team.id} 
                        disabled={isFull}
                      />
                      <Label 
                        htmlFor={team.id} 
                        className={`flex-1 ${isFull ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div>{team.name}</div>
                        {isFull && (
                          <span className="text-xs text-muted-foreground">Team ist voll</span>
                        )}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>

              <Button 
                onClick={handleTeamSelect} 
                className="w-full"
                disabled={!selectedTeamId}
              >
                Weiter
              </Button>
            </div>
          )}

          {step === 'player-details' && playerSlotInfo && (
            <div className="bg-card rounded-xl border p-6 space-y-4">
              <div className="text-center">
                <h2 className="font-semibold">Deine Daten</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Tritt <strong>{playerSlotInfo.teamName}</strong> bei
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="player-name">Voller Name *</Label>
                  <Input
                    id="player-name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Max Mustermann"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="player-phone">Telefonnummer</Label>
                  <Input
                    id="player-phone"
                    type="tel"
                    value={playerPhone}
                    onChange={(e) => setPlayerPhone(e.target.value)}
                    placeholder="+49 123 456789"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setPlayerSlotInfo(null);
                    setStep('team-select');
                  }}
                  className="flex-1"
                >
                  Zurück
                </Button>
                <Button 
                  onClick={handleSavePlayerDetails} 
                  className="flex-1"
                  disabled={savingDetails || !playerName.trim()}
                >
                  {savingDetails && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Beitreten
                </Button>
              </div>
            </div>
          )}

          {step === 'team-full' && (
            <div className="bg-card rounded-xl border p-6 text-center space-y-4">
              <p className="text-muted-foreground">
                Dieses Team hat bereits zwei Spieler. Bitte wähle ein anderes Team.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedTeamId('');
                  setStep('team-select');
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Anderes Team wählen
              </Button>
            </div>
          )}

          {step === 'joining' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Du wirst hinzugefügt...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="bg-card rounded-xl border p-6 text-center space-y-4">
              <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div>
                <h2 className="font-semibold">Willkommen!</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Du bist jetzt Mitglied der Liga.
                </p>
              </div>
              <Button onClick={goToLeague} className="w-full">
                Zur Liga
              </Button>
            </div>
          )}

          {step === 'already-member' && (
            <div className="bg-card rounded-xl border p-6 text-center space-y-4">
              <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="font-semibold">Bereits Mitglied</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Du bist bereits Mitglied dieser Liga.
                </p>
              </div>
              <Button onClick={goToLeague} className="w-full">
                Zur Liga
              </Button>
            </div>
          )}

          {/* Back link */}
          {(step === 'auth' || step === 'team-select') && (
            <div className="text-center">
              <Link 
                to="/" 
                className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Zurück zur Startseite
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
