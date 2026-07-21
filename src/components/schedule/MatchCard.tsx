import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MatchWithTeams, MatchResult, Team } from '@/types/database';
import { formatSetResult, getSetScore } from '@/lib/standings';
import { CheckCircle2, Clock, Users, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { EditMatchDialog } from './EditMatchDialog';

interface MatchCardProps {
  match: MatchWithTeams;
  result?: MatchResult;
  teams?: Team[];
}

function TeamLogo({ logoUrl, name }: { logoUrl: string | null; name: string }) {
  const fullUrl = logoUrl 
    ? `https://hoinybrkpfhedbltdbxq.supabase.co/storage/v1/object/public/${logoUrl}`
    : null;

  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted overflow-hidden">
      {fullUrl ? (
        <img
          src={fullUrl}
          alt={`${name} Logo`}
          className="h-full w-full object-cover"
        />
      ) : (
        <Users className="h-4 w-4 text-muted-foreground" />
      )}
    </div>
  );
}

export function MatchCard({ match, result, teams }: MatchCardProps) {
  const { isAdmin } = useAuth();
  const { leagueId } = useParams<{ leagueId: string }>();
  const [editOpen, setEditOpen] = useState(false);
  const isPlayed = !!result;
  const teamAWon = result?.winner_id === match.team_a_id;
  const teamBWon = result?.winner_id === match.team_b_id;

  return (
    <div className="match-card p-4">
      {/* Match Status Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`sport-badge ${
          isPlayed 
            ? 'bg-success/10 text-success' 
            : 'bg-muted text-muted-foreground'
        }`}>
          {isPlayed ? (
            <>
              <CheckCircle2 className="h-3 w-3" />
              Gespielt
            </>
          ) : (
            <>
              <Clock className="h-3 w-3" />
              Ausstehend
            </>
          )}
        </span>
        <div className="flex items-center gap-2">
          {result && (
            <span className="text-sm font-bold text-accent">
              {getSetScore(result)}
            </span>
          )}
          {isAdmin && teams && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => setEditOpen(true)}
              aria-label="Spiel bearbeiten"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Teams */}
      <div className="space-y-2">
        <div className={`flex items-center justify-between p-2 rounded-lg ${
          teamAWon ? 'bg-success/10' : ''
        }`}>
          <Link
            to={`/league/${leagueId}/teams/${match.team_a_id}`}
            className="flex items-center gap-2 min-w-0 hover:opacity-80 transition-opacity"
          >
            <TeamLogo logoUrl={match.team_a.logo_url} name={match.team_a.name} />
            <span className={`font-medium truncate ${teamAWon ? 'text-success' : ''}`}>
              {match.team_a.name}
            </span>
          </Link>
          {result && (
            <span className="text-sm text-muted-foreground">
              {result.set1_a} | {result.set2_a}
              {result.set3_a !== null && ` | ${result.set3_a}`}
            </span>
          )}
        </div>
        
        <div className="text-center text-xs text-muted-foreground font-medium">
          vs
        </div>
        
        <div className={`flex items-center justify-between p-2 rounded-lg ${
          teamBWon ? 'bg-success/10' : ''
        }`}>
          <Link
            to={`/league/${leagueId}/teams/${match.team_b_id}`}
            className="flex items-center gap-2 min-w-0 hover:opacity-80 transition-opacity"
          >
            <TeamLogo logoUrl={match.team_b.logo_url} name={match.team_b.name} />
            <span className={`font-medium truncate ${teamBWon ? 'text-success' : ''}`}>
              {match.team_b.name}
            </span>
          </Link>
          {result && (
            <span className="text-sm text-muted-foreground">
              {result.set1_b} | {result.set2_b}
              {result.set3_b !== null && ` | ${result.set3_b}`}
            </span>
          )}
        </div>
      </div>

      {/* Full Result */}
      {result && (
        <div className="mt-3 pt-3 border-t text-center text-sm text-muted-foreground">
          {formatSetResult(result)}
        </div>
      )}

      {isAdmin && teams && (
        <EditMatchDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          match={match}
          result={result}
          teams={teams}
        />
      )}
    </div>
  );
}
