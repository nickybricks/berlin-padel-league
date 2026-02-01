import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { 
  useVenueCourts, 
  useCreateVenueCourt, 
  useDeleteVenueCourt 
} from '@/hooks/useVenues';
import { Venue, VenueCourt } from '@/types/bookings';
import { toast } from '@/hooks/use-toast';

interface VenueCourtManagerProps {
  venue: Venue;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VenueCourtManager({ venue, open, onOpenChange }: VenueCourtManagerProps) {
  const { data: courts, isLoading } = useVenueCourts(venue.id);
  const createCourt = useCreateVenueCourt();
  const deleteCourt = useDeleteVenueCourt();

  const [newCourtName, setNewCourtName] = useState('');

  const handleAddCourt = async () => {
    if (!newCourtName.trim()) {
      toast({ title: 'Platzname erforderlich', variant: 'destructive' });
      return;
    }

    try {
      const nextOrder = courts?.length || 0;
      await createCourt.mutateAsync({
        venue_id: venue.id,
        name: newCourtName.trim(),
        display_order: nextOrder,
      });
      setNewCourtName('');
      toast({ title: 'Platz hinzugefügt' });
    } catch (error: any) {
      if (error.message?.includes('unique')) {
        toast({ title: 'Platz existiert bereits', variant: 'destructive' });
      } else {
        toast({ title: 'Fehler', description: error.message, variant: 'destructive' });
      }
    }
  };

  const handleDeleteCourt = async (court: VenueCourt) => {
    if (!confirm(`"${court.name}" wirklich löschen?`)) return;

    try {
      await deleteCourt.mutateAsync({ id: court.id, venue_id: venue.id });
      toast({ title: 'Platz gelöscht' });
    } catch (error: any) {
      toast({ title: 'Fehler beim Löschen', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Plätze für {venue.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Existing Courts */}
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : courts && courts.length > 0 ? (
            <div className="space-y-2">
              {courts.map((court) => (
                <div
                  key={court.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{court.name}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteCourt(court)}
                    disabled={deleteCourt.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Noch keine Plätze angelegt
            </p>
          )}

          {/* Add New Court */}
          <div className="space-y-2 pt-4 border-t">
            <Label htmlFor="new-court">Neuen Platz hinzufügen</Label>
            <div className="flex gap-2">
              <Input
                id="new-court"
                value={newCourtName}
                onChange={(e) => setNewCourtName(e.target.value)}
                placeholder="z.B. Platz 1, Centre Court"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCourt()}
              />
              <Button 
                onClick={handleAddCourt} 
                disabled={createCourt.isPending}
              >
                {createCourt.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Schließen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
