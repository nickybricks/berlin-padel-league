import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Team } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface TeamEditDialogProps {
  team: Team;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeamEditDialog({ team, open, onOpenChange }: TeamEditDialogProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: team.name,
    player1_name: team.player1_name || '',
    player1_email: team.player1_email || '',
    player1_phone: team.player1_phone || '',
    player2_name: team.player2_name || '',
    player2_email: team.player2_email || '',
    player2_phone: team.player2_phone || '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({ title: 'Teamname ist erforderlich', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('teams')
        .update({
          name: formData.name.trim(),
          player1_name: formData.player1_name.trim() || null,
          player1_email: formData.player1_email.trim() || null,
          player1_phone: formData.player1_phone.trim() || null,
          player2_name: formData.player2_name.trim() || null,
          player2_email: formData.player2_email.trim() || null,
          player2_phone: formData.player2_phone.trim() || null,
        })
        .eq('id', team.id);

      if (error) throw error;

      toast({ title: 'Team aktualisiert' });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      onOpenChange(false);
    } catch (error: any) {
      toast({ 
        title: 'Fehler beim Speichern', 
        description: error.message,
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Team bearbeiten</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Team Name */}
          <div className="space-y-2">
            <Label htmlFor="team-name">Teamname *</Label>
            <Input
              id="team-name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          {/* Player 1 Section */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground">Spieler 1</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="player1-name">Name</Label>
                <Input
                  id="player1-name"
                  value={formData.player1_name}
                  onChange={(e) => handleChange('player1_name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="player1-phone">Telefon</Label>
                <Input
                  id="player1-phone"
                  type="tel"
                  value={formData.player1_phone}
                  onChange={(e) => handleChange('player1_phone', e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="player1-email">E-Mail</Label>
                <Input
                  id="player1-email"
                  type="email"
                  value={formData.player1_email}
                  onChange={(e) => handleChange('player1_email', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Player 2 Section */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground">Spieler 2</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="player2-name">Name</Label>
                <Input
                  id="player2-name"
                  value={formData.player2_name}
                  onChange={(e) => handleChange('player2_name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="player2-phone">Telefon</Label>
                <Input
                  id="player2-phone"
                  type="tel"
                  value={formData.player2_phone}
                  onChange={(e) => handleChange('player2_phone', e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="player2-email">E-Mail</Label>
                <Input
                  id="player2-email"
                  type="email"
                  value={formData.player2_email}
                  onChange={(e) => handleChange('player2_email', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
