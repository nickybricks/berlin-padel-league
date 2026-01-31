import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CourtSlotWithDetails } from '@/types/bookings';
import { useTeamUnbookedMatches, useCreateBooking } from '@/hooks/useBookings';
import { useAuth } from '@/hooks/useAuth';
import { formatTimeRange, formatDateDE } from '@/lib/bookingUtils';
import { Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BookingDialogProps {
  slot: CourtSlotWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingDialog({ slot, open, onOpenChange }: BookingDialogProps) {
  const { teamId } = useAuth();
  const [selectedMatchId, setSelectedMatchId] = useState<string>('');
  
  const { data: unbookedMatches, isLoading: matchesLoading } = useTeamUnbookedMatches(teamId);
  const createBooking = useCreateBooking();

  const handleBook = async () => {
    if (!slot || !selectedMatchId || !teamId) return;

    try {
      await createBooking.mutateAsync({
        court_slot_id: slot.id,
        match_id: selectedMatchId,
        booked_by_team_id: teamId,
      });
      
      toast({
        title: 'Buchung erfolgreich',
        description: 'Der Platz wurde erfolgreich gebucht.',
      });
      
      onOpenChange(false);
      setSelectedMatchId('');
    } catch (error: any) {
      toast({
        title: 'Fehler bei der Buchung',
        description: error.message || 'Bitte versuche es erneut.',
        variant: 'destructive',
      });
    }
  };

  if (!slot) return null;

  const slotDate = new Date(slot.slot_date);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Platz buchen</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Slot Details */}
          <div className="p-3 rounded-lg bg-muted/50 space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <MapPin className="h-4 w-4 text-primary" />
              {slot.venue.name} - {slot.court_name}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDateDE(slotDate)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatTimeRange(slot.start_time, slot.end_time)}
              </span>
            </div>
          </div>

          {/* Match Selection */}
          <div className="space-y-2">
            <Label>Spiel auswählen</Label>
            {matchesLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Lade Spiele...
              </div>
            ) : unbookedMatches && unbookedMatches.length > 0 ? (
              <Select value={selectedMatchId} onValueChange={setSelectedMatchId}>
                <SelectTrigger>
                  <SelectValue placeholder="Wähle ein Spiel..." />
                </SelectTrigger>
                <SelectContent>
                  {unbookedMatches.map((match) => (
                    <SelectItem key={match.id} value={match.id}>
                      Woche {match.week}: {match.team_a.name} vs {match.team_b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground">
                Keine offenen Spiele verfügbar. Alle deine Spiele sind bereits gebucht.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button 
            onClick={handleBook} 
            disabled={!selectedMatchId || createBooking.isPending}
          >
            {createBooking.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Buchen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
