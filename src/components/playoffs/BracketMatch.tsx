import { MatchWithTeams, MatchResult } from '@/types/database';
import { getSetScore } from '@/lib/standings';

interface BracketMatchProps {
  match?: MatchWithTeams;
  result?: MatchResult;
  placeholder?: { teamA: string; teamB: string };
  round: string;
}

export function BracketMatch({ match, result, placeholder, round }: BracketMatchProps) {
  const teamAName = match?.team_a?.name ?? placeholder?.teamA ?? 'TBD';
  const teamBName = match?.team_b?.name ?? placeholder?.teamB ?? 'TBD';
  const teamAWon = result?.winner_id === match?.team_a_id;
  const teamBWon = result?.winner_id === match?.team_b_id;
  const isPlayed = !!result;

  return (
    <div className="w-full max-w-[200px]">
      <div className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wide">
        {round}
      </div>
      <div className={`rounded-lg overflow-hidden shadow-sm ${
        isPlayed ? 'ring-1 ring-accent/50' : ''
      }`}>
        <div className={`flex items-center justify-between px-3 py-2 text-sm ${
          teamAWon ? 'bg-success/10 font-semibold' : 'bg-card'
        }`}>
          <span className="truncate">{teamAName}</span>
          {result && (
            <span className={teamAWon ? 'text-success font-bold' : 'text-muted-foreground'}>
              {teamAWon ? '✓' : ''}
            </span>
          )}
        </div>
        <div className="h-px bg-border" />
        <div className={`flex items-center justify-between px-3 py-2 text-sm ${
          teamBWon ? 'bg-success/10 font-semibold' : 'bg-card'
        }`}>
          <span className="truncate">{teamBName}</span>
          {result && (
            <span className={teamBWon ? 'text-success font-bold' : 'text-muted-foreground'}>
              {teamBWon ? '✓' : ''}
            </span>
          )}
        </div>
      </div>
      {result && (
        <div className="text-xs text-center text-muted-foreground mt-1">
          {getSetScore(result)}
        </div>
      )}
    </div>
  );
}
