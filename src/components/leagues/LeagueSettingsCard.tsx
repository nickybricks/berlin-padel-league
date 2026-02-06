import { useState, useRef } from 'react';
import { Pencil, Upload, Loader2, Save, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import type { League } from '@/types/leagues';

interface LeagueSettingsCardProps {
  league: League;
}

export function LeagueSettingsCard({ league }: LeagueSettingsCardProps) {
  const [name, setName] = useState(league.name);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const logoUrl = league.logo_url
    ? `https://hoinybrkpfhedbltdbxq.supabase.co/storage/v1/object/public/${league.logo_url}`
    : null;

  const hasChanges = name !== league.name;

  const handleSaveName = async () => {
    if (!name.trim()) {
      toast.error('Der Liga-Name darf nicht leer sein');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('leagues')
        .update({ name: name.trim() })
        .eq('id', league.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['league', league.id] });
      toast.success('Liga-Name aktualisiert');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Fehler beim Aktualisieren des Namens');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Bitte wähle eine Bilddatei aus.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Das Bild darf maximal 5MB groß sein.');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `leagues/${league.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('Teams')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const filePath = `Teams/${fileName}`;

      const { error: updateError } = await supabase
        .from('leagues')
        .update({ logo_url: filePath })
        .eq('id', league.id);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ['league', league.id] });
      toast.success('Liga-Logo aktualisiert');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Logo konnte nicht hochgeladen werden.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-sm p-5 space-y-5">
      <h2 className="text-lg font-bold">Liga-Einstellungen</h2>

      <div className="flex items-start gap-5">
        {/* Logo Upload */}
        <div className="relative group">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="h-20 w-20 shrink-0 rounded-xl bg-muted overflow-hidden flex items-center justify-center cursor-pointer transition-all hover:ring-2 hover:ring-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
            ) : logoUrl ? (
              <img src={logoUrl} alt={`${league.name} Logo`} className="h-full w-full object-cover" />
            ) : (
              <Image className="h-8 w-8 text-muted-foreground" />
            )}
          </button>
          {!isUploading && (
            <div
              className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center shadow-md cursor-pointer transition-transform group-hover:scale-110"
              onClick={() => fileInputRef.current?.click()}
            >
              <Pencil className="h-3 w-3 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Name Input */}
        <div className="flex-1 space-y-2">
          <Label htmlFor="league-name">Liga-Name</Label>
          <div className="flex gap-2">
            <Input
              id="league-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name der Liga"
              className="flex-1"
            />
            <Button
              onClick={handleSaveName}
              disabled={!hasChanges || isSaving}
              size="sm"
              className="shrink-0"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Code: {league.code}
          </p>
        </div>
      </div>
    </div>
  );
}
