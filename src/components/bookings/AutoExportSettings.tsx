import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Clock, X, Loader2, Info, Check, Send } from 'lucide-react';
import { useBookingExportSettings, useUpdateBookingExportSettings } from '@/hooks/useBookingExportSettings';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function AutoExportSettings() {
  const { data: settings, isLoading } = useBookingExportSettings();
  const updateSettings = useUpdateBookingExportSettings();

  const [isActive, setIsActive] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleManualSend = async () => {
    if (emails.length === 0) {
      toast({ title: 'Keine Empfänger konfiguriert', variant: 'destructive' });
      return;
    }

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-booking-export');
      if (error) throw error;
      
      if (data?.success) {
        toast({ 
          title: 'Export versendet', 
          description: data.message 
        });
      } else {
        toast({ 
          title: 'Export nicht gesendet', 
          description: data?.message || 'Unbekannter Fehler',
          variant: 'destructive' 
        });
      }
    } catch (error: any) {
      toast({ 
        title: 'Fehler beim Versenden', 
        description: error.message,
        variant: 'destructive' 
      });
    } finally {
      setIsSending(false);
    }
  };

  // Initialize from fetched settings
  useEffect(() => {
    if (settings) {
      setIsActive(settings.is_active);
      setEmails(settings.recipient_emails || []);
    }
  }, [settings]);

  // Track changes
  useEffect(() => {
    if (!settings) return;
    const emailsChanged = JSON.stringify(emails) !== JSON.stringify(settings.recipient_emails || []);
    const activeChanged = isActive !== settings.is_active;
    setHasChanges(emailsChanged || activeChanged);
  }, [isActive, emails, settings]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const addEmail = () => {
    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed) return;
    
    if (!isValidEmail(trimmed)) {
      toast({ title: 'Ungültige E-Mail-Adresse', variant: 'destructive' });
      return;
    }
    
    if (emails.includes(trimmed)) {
      toast({ title: 'E-Mail bereits hinzugefügt', variant: 'destructive' });
      return;
    }
    
    setEmails(prev => [...prev, trimmed]);
    setNewEmail('');
  };

  const removeEmail = (email: string) => {
    setEmails(prev => prev.filter(e => e !== email));
  };

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({
        recipient_emails: emails,
        is_active: isActive,
      });
      toast({ title: 'Einstellungen gespeichert' });
      setHasChanges(false);
    } catch (error: any) {
      toast({ 
        title: 'Fehler beim Speichern', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Separator />
      
      <h3 className="text-md font-semibold flex items-center gap-2">
        <Mail className="h-4 w-4 text-primary" />
        Automatischer Export
      </h3>

      {/* Info Box */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm">
        <Info className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
        <p className="text-muted-foreground">
          Der automatische Export sendet jeden <strong>Freitag um 00:05 Uhr</strong> eine CSV-Datei 
          mit allen Buchungen der kommenden Woche an die konfigurierten E-Mail-Adressen.
        </p>
      </div>

      {/* Enable Toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg border">
        <div className="space-y-0.5">
          <Label htmlFor="auto-export-toggle" className="font-medium">
            Auto-Export aktivieren
          </Label>
          <p className="text-sm text-muted-foreground">
            E-Mail wird wöchentlich nach Buchungsschluss gesendet
          </p>
        </div>
        <Switch
          id="auto-export-toggle"
          checked={isActive}
          onCheckedChange={setIsActive}
        />
      </div>

      {/* Email Recipients */}
      <div className="space-y-2">
        <Label>Empfänger E-Mail-Adressen</Label>
        
        {/* Email List */}
        {emails.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {emails.map((email) => (
              <Badge key={email} variant="secondary" className="gap-1">
                {email}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeEmail(email)}
                />
              </Badge>
            ))}
          </div>
        )}

        {/* Add Email */}
        <div className="flex gap-2">
          <Input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="E-Mail-Adresse hinzufügen..."
            onKeyDown={(e) => e.key === 'Enter' && addEmail()}
          />
          <Button variant="outline" onClick={addEmail}>
            Hinzufügen
          </Button>
        </div>
      </div>

      {/* Schedule Info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Nächster Export: Freitag 00:05 Uhr</span>
      </div>

      {/* Manual Send Button */}
      <Button 
        variant="outline"
        onClick={handleManualSend} 
        disabled={isSending || emails.length === 0 || !isActive}
        className="w-full"
      >
        {isSending ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Send className="h-4 w-4 mr-2" />
        )}
        Jetzt manuell versenden
      </Button>

      {/* Save Button */}
      {hasChanges && (
        <Button 
          onClick={handleSave} 
          disabled={updateSettings.isPending}
          className="w-full"
        >
          {updateSettings.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Check className="h-4 w-4 mr-2" />
          )}
          Änderungen speichern
        </Button>
      )}
    </div>
  );
}
