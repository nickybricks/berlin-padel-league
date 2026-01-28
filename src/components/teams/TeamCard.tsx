import { Team } from '@/types/database';
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { TeamLogoUpload } from './TeamLogoUpload';

interface TeamCardProps {
  team: Team;
  onClick: () => void;
}

export function TeamCard({ team, onClick }: TeamCardProps) {
  const { isAdmin } = useAuth();
  
  const logoUrl = team.logo_url 
    ? `https://hoinybrkpfhedbltdbxq.supabase.co/storage/v1/object/public/${team.logo_url}`
    : null;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking the upload area
    if ((e.target as HTMLElement).closest('.logo-upload-area')) {
      e.stopPropagation();
      return;
    }
    onClick();
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:border-primary/50"
      onClick={handleCardClick}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Team Logo - Editable for Admins */}
        {isAdmin ? (
          <div className="logo-upload-area" onClick={(e) => e.stopPropagation()}>
            <TeamLogoUpload
              teamId={team.id}
              currentLogoUrl={team.logo_url}
              teamName={team.name}
              size="sm"
            />
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-muted overflow-hidden">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${team.name} Logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <Users className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
        )}

        {/* Team Info */}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
            {team.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {team.captain_name && team.player2_name 
              ? `${team.captain_name} & ${team.player2_name}`
              : 'Team'}
          </p>
        </div>

        {/* Arrow */}
        <div className="text-muted-foreground group-hover:text-primary transition-colors">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Card>
  );
}
