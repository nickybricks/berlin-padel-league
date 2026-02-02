import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trophy, Plus, Loader2, Users, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUserLeagues } from '@/hooks/useLeagues';

export default function MyLeagues() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: userLeagues, isLoading: leaguesLoading } = useUserLeagues(user?.id);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const isLoading = authLoading || leaguesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const hasLeagues = userLeagues && userLeagues.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">Padel Liga</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            Abmelden
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Meine Ligen</h1>
            <p className="text-muted-foreground mt-1">
              Wähle eine Liga aus oder tritt einer neuen bei.
            </p>
          </div>

          {/* League Cards */}
          {hasLeagues ? (
            <div className="space-y-3">
              {userLeagues.map((membership) => (
                <Link
                  key={membership.id}
                  to={`/league/${membership.league_id}`}
                  className="block"
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-border/50 hover:border-primary/30">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                        <Trophy className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {membership.league?.name || 'Liga'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          <span className="capitalize">{membership.role}</span>
                          {membership.team_id && (
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                              Team zugewiesen
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Trophy className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Keine Ligen</h3>
                <p className="text-muted-foreground mb-4">
                  Du bist noch keiner Liga beigetreten.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Join League Button */}
          <div className="pt-2">
            <Link to="/onboarding" className="block">
              <Button variant="outline" className="w-full" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Liga beitreten
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
