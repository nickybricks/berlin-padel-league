import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { ResultForm } from '@/components/forms/ResultForm';
import { useAuth } from '@/hooks/useAuth';
import { useMatches, useMatchResults } from '@/hooks/useMatches';
import { useLeagueTeams } from '@/hooks/useLeagues';
import { ClipboardEdit, Shield } from 'lucide-react';

export default function EnterResult() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const { user, loading, canEnterResults, isAdmin, role } = useAuth();
  const { data: matches } = useMatches();
  const { data: results } = useMatchResults();
  const { data: teams } = useLeagueTeams(leagueId);

  // Filter matches to only include teams from this league
  const leagueTeamIds = useMemo(() => new Set(teams?.map(t => t.id) || []), [teams]);

  const leagueMatches = useMemo(() => {
    if (!matches) return [];
    return matches.filter(m => leagueTeamIds.has(m.team_a_id) && leagueTeamIds.has(m.team_b_id));
  }, [matches, leagueTeamIds]);

  // Create set of played match IDs
  const playedMatchIds = useMemo(() => {
    return new Set(results?.map(r => r.match_id) ?? []);
  }, [results]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Show access denied if not authorized
  if (!canEnterResults) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Zugriff verweigert</h1>
        <p className="text-muted-foreground">
          Du hast keine Berechtigung, Ergebnisse einzutragen.
          Nur Admins und registrierte Spieler können Ergebnisse erfassen.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <ClipboardEdit className="h-7 w-7 text-accent" />
          Ergebnis eintragen
        </h1>
        <p className="text-muted-foreground mt-1">
          {isAdmin
            ? 'Als Admin kannst du alle Spiele eintragen.'
            : 'Als Spieler kannst du die Spiele deines Teams eintragen.'}
        </p>
      </div>

      {/* Role Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium">
        <Shield className="h-4 w-4" />
        {role === 'admin' ? 'Administrator' : 'Spieler'}
      </div>

      {/* Result Form */}
      <div className="bg-card rounded-xl shadow-sm p-4 md:p-6">
        {leagueMatches.length > 0 && (
          <ResultForm
            matches={leagueMatches}
            playedMatchIds={playedMatchIds}
          />
        )}
      </div>

      {/* Instructions */}
      <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground">
        <h3 className="font-bold text-foreground mb-2">Anleitung</h3>
        <ul className="space-y-1.5">
          <li>1. Wähle das Spiel aus der Liste</li>
          <li>2. Trage die Spielstände für jeden Satz ein</li>
          <li>3. Bei 1:1 Sätzen wird automatisch Satz 3 angezeigt</li>
          <li>4. Optional: Füge einen Kommentar hinzu</li>
          <li>5. Klicke auf "Ergebnis eintragen"</li>
        </ul>
      </div>
    </div>
  );
}

