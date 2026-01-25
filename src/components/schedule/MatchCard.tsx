import { MatchWithTeams, MatchResult } from '@/types/database';
import { formatSetResult, getSetScore } from '@/lib/standings';
import { CheckCircle2, Clock } from 'lucide-react';

interface MatchCardProps {
  match: MatchWithTeams;
  result?: MatchResult;
}

export function MatchCard({ match, result }: MatchCardProps) {
  const isPlayed = !!result;
  const teamAWon = result?.winner_id === match.team_a_id;
  const teamBWon = result?.winner_id === match.team_b_id;

  return (
    <div className={`match-card p-4 ${isPlayed ? 'border-accent/30' : ''}`}>
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
        {result && (
          <span className="text-sm font-bold text-accent">
            {getSetScore(result)}
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="space-y-2">
        <div className={`flex items-center justify-between p-2 rounded-lg ${
          teamAWon ? 'bg-success/10' : ''
        }`}>
          <span className={`font-medium ${teamAWon ? 'text-success' : ''}`}>
            {match.team_a.name}
          </span>
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
          <span className={`font-medium ${teamBWon ? 'text-success' : ''}`}>
            {match.team_b.name}
          </span>
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
    </div>
  );
}
