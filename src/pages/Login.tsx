import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Loader2, LogIn, UserPlus } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user, signIn, signUp, loading: authLoading } = useAuth();

  // Redirect if already logged in
  if (!authLoading && user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({ title: 'Erfolgreich angemeldet!' });
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast({ 
          title: 'Konto erstellt!',
          description: 'Du kannst dich jetzt anmelden.',
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: 'Fehler',
        description: 'Anmeldung fehlgeschlagen. Bitte überprüfe deine Zugangsdaten.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto py-8">
        <div className="bg-card rounded-xl border p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">
              {isLogin ? 'Anmelden' : 'Registrieren'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isLogin 
                ? 'Melde dich an, um Ergebnisse einzutragen.' 
                : 'Erstelle ein Konto für die Padel Liga.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isLogin ? (
                <LogIn className="mr-2 h-4 w-4" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              {isLogin ? 'Anmelden' : 'Registrieren'}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? 'Noch kein Konto?' : 'Bereits registriert?'}
            </span>{' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent hover:underline font-medium"
            >
              {isLogin ? 'Registrieren' : 'Anmelden'}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-2">Hinweis</p>
          <p>
            Nach der Registrierung erhältst du die Rolle "Viewer". 
            Ein Admin kann dir die Rolle "Captain" zuweisen, damit du 
            Ergebnisse für dein Team eintragen kannst.
          </p>
        </div>
      </div>
    </Layout>
  );
}
