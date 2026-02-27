import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { NotchHeader } from '@/components/layout/NotchHeader';

type Step = 'choose' | 'enter-code';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
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

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Liga beitreten</h1>
            <p className="text-muted-foreground mt-1">
              Was möchtest du tun?
            </p>
          </div>

          {step === 'choose' && (
            <div className="space-y-4">
              {/* Create League */}
              <div 
                className="bg-card rounded-xl border p-5 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => navigate('/create-league')}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Liga erstellen</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Erstelle eine eigene Liga und lade Teams ein.
                    </p>
                    <Button className="mt-3">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Erstellen
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
