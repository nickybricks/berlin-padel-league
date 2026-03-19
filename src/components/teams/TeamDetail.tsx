import { Team } from '@/types/database';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Phone, Users, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface TeamDetailProps {
  team: Team | null;
  open: boolean;
  onClose: () => void;
}

export function TeamDetail({ team, open, onClose }: TeamDetailProps) {
  const { user } = useAuth();
  if (!team) return null;

  const logoUrl = team.logo_url 
    ? `https://hoinybrkpfhedbltdbxq.supabase.co/storage/v1/object/public/${team.logo_url}`
    : null;

  const formatPhone = (phone: string | null) => {
    if (!phone) return null;
    // Add proper spacing for German numbers
    return phone.replace(/(\+49|0)(\d{3})(\d+)/, '$1 $2 $3');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-4">
            {/* Team Logo */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-muted overflow-hidden">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${team.name} Logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Users className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <div>
              <DialogTitle className="text-xl">{team.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">Saison 2026</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Team Players */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Spieler
            </h4>

            {/* Player 1 */}
            {team.player1_name && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Crown className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{team.player1_name}</span>
                    <Badge variant="secondary" className="text-xs">Spieler 1</Badge>
                  </div>
                  {team.player1_phone && (
                    <a 
                      href={`tel:${team.player1_phone}`}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mt-1"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {formatPhone(team.player1_phone)}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Player 2 */}
            {team.player2_name && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/50">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium">{team.player2_name}</span>
                  {team.player2_phone && (
                    <a 
                      href={`tel:${team.player2_phone}`}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mt-1"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {formatPhone(team.player2_phone)}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
