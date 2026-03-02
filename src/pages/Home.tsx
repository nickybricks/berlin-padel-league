import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Redirect logged-in users to leagues overview
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/leagues', { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Floating Header Island */}
      <header className="w-full flex justify-center pt-4 px-4 z-50">
        <div className="w-full max-w-2xl flex items-center justify-between px-5 sm:px-6 h-14 rounded-full bg-white/70 backdrop-blur-xl border border-border/40 shadow-sm shadow-black/5">
          {/* Logo */}
          <span className="text-lg font-bold text-primary tracking-tight whitespace-nowrap">
            Padel Leagues
          </span>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="rounded-full text-sm px-3 sm:px-4">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="rounded-full text-sm px-3 sm:px-4">
                Registrieren
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Empty main content area */}
      <main className="flex-1" />
    </div>
  );
}
