import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trophy, Users, Plus, ArrowRight, Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useUserLeagues } from '@/hooks/useLeagues';
import { toast } from '@/hooks/use-toast';

type Step = 'choose' | 'enter-code';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { data: userLeagues, isLoading: leaguesLoading } = useUserLeagues(user?.id);
  
  const [step, setStep] = useState<Step>('choose');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/', { replace: true });
    }
  }, [user, authLoading, navigate]);


  const handleJoinLeague = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast({ 
        title: 'Bitte Code eingeben',
        variant: 'destructive',
      });
      return;
    }
    setSubmitting(true);
    navigate(`/join/${code.toUpperCase().trim()}`);
  };

  // Show loading state
  if (authLoading || leaguesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Logout */}
      <header className="border-b bg-card/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Trophy className="h-4 w-4 text-primary-foreground" />
            </div>
            <span>Padel Liga</span>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Abmelden
          </Button>
        </div>
      </header>

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
              Willkommen!
            </h1>
            <p className="text-muted-foreground">
              Was möchtest du tun?
            </p>
          </div>

          {step === 'choose' && (
            <div className="space-y-4">
              {/* Create League - Disabled */}
              <div className="bg-card rounded-xl border p-5 opacity-60">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Plus className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Liga erstellen</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Erstelle eine eigene Liga und lade Teams ein.
                    </p>
                    <Button variant="outline" className="mt-3" disabled>
                      Folgt
                    </Button>
                  </div>
                </div>
              </div>

              {/* Join League */}
              <div 
                className="bg-card rounded-xl border p-5 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setStep('enter-code')}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Liga beitreten</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Tritt einer bestehenden Liga mit einem Beitrittscode bei.
                    </p>
                    <Button className="mt-3">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Weiter
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'enter-code' && (
            <div className="bg-card rounded-xl border p-6 space-y-4">
              <div className="text-center">
                <h2 className="font-semibold text-foreground">Beitrittscode eingeben</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Gib den Code ein, den du von deinem Liga-Admin erhalten hast.
                </p>
              </div>
              
              <form onSubmit={handleJoinLeague} className="space-y-4">
                <Input
                  type="text"
                  placeholder="z.B. ABC123"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="text-center text-lg font-mono tracking-widest uppercase"
                  maxLength={10}
                  autoComplete="off"
                  autoFocus
                />
                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep('choose')}
                  >
                    Zurück
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={submitting || !code.trim()}
                  >
                    {submitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="mr-2 h-4 w-4" />
                    )}
                    Beitreten
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Padel Liga
      </footer>
    </div>
  );
}
