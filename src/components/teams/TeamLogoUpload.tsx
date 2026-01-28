import { useState, useRef } from 'react';
import { Pencil, Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface TeamLogoUploadProps {
  teamId: string;
  currentLogoUrl: string | null;
  teamName: string;
  size?: 'sm' | 'lg';
}

export function TeamLogoUpload({ teamId, currentLogoUrl, teamName, size = 'lg' }: TeamLogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const logoUrl = currentLogoUrl 
    ? `https://hoinybrkpfhedbltdbxq.supabase.co/storage/v1/object/public/${currentLogoUrl}`
    : null;

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Fehler',
        description: 'Bitte wähle eine Bilddatei aus.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Fehler',
        description: 'Das Bild darf maximal 5MB groß sein.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${teamId}-${Date.now()}.${fileExt}`;
      const filePath = `Teams/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('Teams')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Update team record
      const { error: updateError } = await supabase
        .from('teams')
        .update({ logo_url: filePath })
        .eq('id', teamId);

      if (updateError) throw updateError;

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['team', teamId] });

      toast({
        title: 'Erfolg',
        description: 'Team-Logo wurde erfolgreich aktualisiert.',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Fehler',
        description: 'Logo konnte nicht hochgeladen werden.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const sizeClasses = size === 'lg' 
    ? 'h-24 w-24' 
    : 'h-16 w-16';

  const iconSize = size === 'lg' ? 'h-10 w-10' : 'h-8 w-8';
  const pencilSize = size === 'lg' ? 'h-4 w-4' : 'h-3 w-3';
  const badgeSize = size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';

  return (
    <div className="relative group">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <button
        onClick={handleClick}
        disabled={isUploading}
        className={`${sizeClasses} shrink-0 rounded-lg bg-muted overflow-hidden flex items-center justify-center cursor-pointer transition-all hover:ring-2 hover:ring-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {isUploading ? (
          <Loader2 className={`${iconSize} text-muted-foreground animate-spin`} />
        ) : logoUrl ? (
          <img
            src={logoUrl}
            alt={`${teamName} Logo`}
            className="h-full w-full object-cover"
          />
        ) : (
          <Upload className={`${iconSize} text-muted-foreground`} />
        )}
      </button>

      {/* Pencil Badge */}
      {!isUploading && (
        <div 
          className={`absolute -bottom-1 -right-1 ${badgeSize} rounded-full bg-primary flex items-center justify-center shadow-md cursor-pointer transition-transform group-hover:scale-110`}
          onClick={handleClick}
        >
          <Pencil className={`${pencilSize} text-primary-foreground`} />
        </div>
      )}
    </div>
  );
}
