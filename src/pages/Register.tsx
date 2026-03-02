import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trophy, UserPlus, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export default function Register() {
  const navigate = useNavigate();
  const { user, signUp, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/onboarding', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { error } = await signUp(email, password);
      if (error) throw error;
      setSuccess(true);
      toast({ 
        title: 'Konto erstellt!',
        description: 'Bitte bestätige deine E-Mail-Adresse.',
      });
    } catch (error: any) {
      toast({
        title: 'Fehler bei der Registrierung',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
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
              Registrieren
            </h1>
            <p className="text-muted-foreground">
              Erstelle dein Konto für die Padel Liga
            </p>
          </div>

          {success ? (
            <div className="bg-card rounded-xl border p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div>
                <h2 className="font-semibold">E-Mail gesendet!</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Wir haben dir eine E-Mail geschickt. Bitte klicke auf den Link, um dein Konto zu bestätigen.
                </p>
              </div>
              <Link to="/login">
                <Button className="w-full">
                  Zur Anmeldung
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-card rounded-xl border p-6 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="deine@email.de"
                    required
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Passwort</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mindestens 6 Zeichen"
                    required
                    minLength={6}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="mr-2 h-4 w-4" />
                  )}
                  Registrieren
                </Button>
              </form>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Bereits registriert? </span>
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Anmelden
                </Link>
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="text-center">
            <Link 
              to="/leagues" 
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Zurück zur Startseite
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
