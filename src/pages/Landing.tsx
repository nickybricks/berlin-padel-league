import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trophy, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useUserLeagues } from '@/hooks/useLeagues';
import { toast } from '@/hooks/use-toast';

export default function Landing() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: userLeagues, isLoading: leaguesLoading } = useUserLeagues(user?.id);

  // Redirect logged-in users to their first league
  useEffect(() => {
    if (!authLoading && !leaguesLoading && user && userLeagues && userLeagues.length > 0) {
      navigate(`/league/${userLeagues[0].league_id}`, { replace: true });
    }
  }, [user, userLeagues, authLoading, leaguesLoading, navigate]);

  const handleJoinLeague = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast({ 
        title: 'Bitte Code eingeben',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    navigate(`/join/${code.toUpperCase().trim()}`);
  };

  // Show loading state while checking auth
  if (authLoading || leaguesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Logo & Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-md">
                <Trophy className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Padel Liga
              </h1>
              <p className="mt-2 text-muted-foreground">
                Organisiere deine Freizeit-Liga einfach und übersichtlich.
              </p>
            </div>
          </div>

          {/* Join League Card */}
          <div className="bg-card rounded-2xl border shadow-sm p-6 space-y-4">
            <div className="text-center">
              <h2 className="font-semibold text-foreground">Liga beitreten</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Gib deinen Beitrittscode ein
              </p>
            </div>
            
            <form onSubmit={handleJoinLeague} className="space-y-4">
              <Input
                type="text"
                placeholder="ABC123"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="text-center text-lg font-mono tracking-widest uppercase"
                maxLength={6}
                autoComplete="off"
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !code.trim()}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="mr-2 h-4 w-4" />
                )}
                Liga beitreten
              </Button>
            </form>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">oder</span>
            </div>
          </div>

          {/* Create League Button (Disabled) */}
          <Button 
            variant="outline" 
            className="w-full" 
            disabled
          >
            Liga erstellen
            <span className="ml-2 text-xs text-muted-foreground">(folgt)</span>
          </Button>

          {/* Login Link */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Bereits Mitglied? </span>
            <Link to="/login" className="text-primary hover:underline font-medium">
              Anmelden
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Padel Liga
      </footer>
    </div>
  );
}
