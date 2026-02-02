import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trophy, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';


export default function Landing() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Redirect logged-in users to leagues overview
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/leagues', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Show loading state while checking auth
  if (authLoading) {
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

          {/* Auth Buttons */}
          <div className="space-y-4">
            <Link to="/login" className="block">
              <Button className="w-full" size="lg">
                <LogIn className="mr-2 h-5 w-5" />
                Anmelden
              </Button>
            </Link>

            <Link to="/register" className="block">
              <Button variant="outline" className="w-full" size="lg">
                <UserPlus className="mr-2 h-5 w-5" />
                Registrieren
              </Button>
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
