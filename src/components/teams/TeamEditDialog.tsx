import { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Team } from '@/types/database';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Upload, Loader2, Users } from 'lucide-react';

interface TeamEditDialogProps {
  team: Team;
}

export function TeamEditDialog({ team }: TeamEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState({
    name: team.name,
    captain_name: team.captain_name || '',
    captain_email: team.captain_email || '',
    captain_phone: team.captain_phone || '',
    player2_name: team.player2_name || '',
    player2_email: team.player2_email || '',
    player2_phone: team.player2_phone || '',
  });

  const [logoUrl, setLogoUrl] = useState(team.logo_url);

  const currentLogoPreview = logoUrl 
    ? `https://hoinybrkpfhedbltdbxq.supabase.co/storage/v1/object/public/${logoUrl}`
    : null;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Fehler',
        description: 'Bitte wähle eine Bilddatei aus.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Fehler',
        description: 'Das Bild darf maximal 5MB groß sein.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingLogo(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${team.id}-${Date.now()}.${fileExt}`;
      const filePath = `Teams/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('Teams')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      setLogoUrl(filePath);
      toast({
        title: 'Logo hochgeladen',
        description: 'Speichere die Änderungen um das Logo zu übernehmen.',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Fehler',
        description: 'Logo konnte nicht hochgeladen werden.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('teams')
        .update({
          name: formData.name,
          captain_name: formData.captain_name || null,
          captain_email: formData.captain_email || null,
          captain_phone: formData.captain_phone || null,
          player2_name: formData.player2_name || null,
          player2_email: formData.player2_email || null,
          player2_phone: formData.player2_phone || null,
          logo_url: logoUrl,
        })
        .eq('id', team.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['team', team.id] });

      toast({
        title: 'Erfolg',
        description: 'Team-Daten wurden erfolgreich aktualisiert.',
      });

      setOpen(false);
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: 'Fehler',
        description: 'Team-Daten konnten nicht gespeichert werden.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Team bearbeiten</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <div className="flex flex-col items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={handleLogoClick}
              disabled={isUploadingLogo}
              className="h-24 w-24 rounded-xl bg-muted overflow-hidden flex items-center justify-center cursor-pointer transition-all hover:ring-2 hover:ring-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploadingLogo ? (
                <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
              ) : currentLogoPreview ? (
                <img
                  src={currentLogoPreview}
                  alt={`${team.name} Logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Upload className="h-10 w-10 text-muted-foreground" />
              )}
            </button>
            <span className="text-xs text-muted-foreground">
              Klicke um Logo zu ändern
            </span>
          </div>

          {/* Team Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Teamname</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Teamname"
              required
            />
          </div>

          {/* Captain Section */}
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Captain
            </h3>
            <div className="grid gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="captain_name" className="text-xs">Name</Label>
                <Input
                  id="captain_name"
                  value={formData.captain_name}
                  onChange={(e) => handleInputChange('captain_name', e.target.value)}
                  placeholder="Name des Captains"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="captain_email" className="text-xs">E-Mail</Label>
                <Input
                  id="captain_email"
                  type="email"
                  value={formData.captain_email}
                  onChange={(e) => handleInputChange('captain_email', e.target.value)}
                  placeholder="captain@beispiel.de"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="captain_phone" className="text-xs">Telefon</Label>
                <Input
                  id="captain_phone"
                  type="tel"
                  value={formData.captain_phone}
                  onChange={(e) => handleInputChange('captain_phone', e.target.value)}
                  placeholder="+49 123 456789"
                />
              </div>
            </div>
          </div>

          {/* Player 2 Section */}
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Spieler 2
            </h3>
            <div className="grid gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="player2_name" className="text-xs">Name</Label>
                <Input
                  id="player2_name"
                  value={formData.player2_name}
                  onChange={(e) => handleInputChange('player2_name', e.target.value)}
                  placeholder="Name des Spielers"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="player2_email" className="text-xs">E-Mail</Label>
                <Input
                  id="player2_email"
                  type="email"
                  value={formData.player2_email}
                  onChange={(e) => handleInputChange('player2_email', e.target.value)}
                  placeholder="spieler@beispiel.de"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="player2_phone" className="text-xs">Telefon</Label>
                <Input
                  id="player2_phone"
                  type="tel"
                  value={formData.player2_phone}
                  onChange={(e) => handleInputChange('player2_phone', e.target.value)}
                  placeholder="+49 123 456789"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Speichern...
              </>
            ) : (
              'Änderungen speichern'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
