import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, MapPin, Loader2, LayoutGrid } from 'lucide-react';
import { useVenues, useCreateVenue, useUpdateVenue, useDeleteVenue, useVenueCourts } from '@/hooks/useVenues';
import { Venue } from '@/types/bookings';
import { toast } from '@/hooks/use-toast';
import { VenueCourtManager } from './VenueCourtManager';

function VenueCourtsBadge({ venueId }: { venueId: string }) {
  const { data: courts } = useVenueCourts(venueId);
  const count = courts?.length || 0;
  
  return (
    <Badge variant="secondary" className="ml-2 text-xs">
      {count} {count === 1 ? 'Platz' : 'Plätze'}
    </Badge>
  );
}

export function AdminVenueManager({ leagueId }: { leagueId?: string }) {
  const { data: venues, isLoading } = useVenues(leagueId);
  const createVenue = useCreateVenue();
  const updateVenue = useUpdateVenue();
  const deleteVenue = useDeleteVenue();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  
  // Court management
  const [courtsDialogVenue, setCourtsDialogVenue] = useState<Venue | null>(null);

  const openCreateDialog = () => {
    setEditingVenue(null);
    setName('');
    setAddress('');
    setDialogOpen(true);
  };

  const openEditDialog = (venue: Venue) => {
    setEditingVenue(venue);
    setName(venue.name);
    setAddress(venue.address || '');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({ title: 'Name ist erforderlich', variant: 'destructive' });
      return;
    }

    try {
      if (editingVenue) {
        await updateVenue.mutateAsync({ 
          id: editingVenue.id, 
          name: name.trim(), 
          address: address.trim() || undefined 
        });
        toast({ title: 'Verein aktualisiert' });
      } else {
        if (!leagueId) {
          toast({ title: 'Keine Liga ausgewählt', variant: 'destructive' });
          return;
        }
        await createVenue.mutateAsync({ 
          name: name.trim(), 
          address: address.trim() || undefined,
          league_id: leagueId,
        });
        toast({ title: 'Verein erstellt' });
      }
      setDialogOpen(false);
    } catch (error: any) {
      toast({ 
        title: 'Fehler', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  };

  const handleDelete = async (venue: Venue) => {
    if (!confirm(`"${venue.name}" wirklich löschen? Alle zugehörigen Plätze werden ebenfalls gelöscht.`)) {
      return;
    }

    try {
      await deleteVenue.mutateAsync(venue.id);
      toast({ title: 'Verein gelöscht' });
    } catch (error: any) {
      toast({ 
        title: 'Fehler beim Löschen', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  };

  const isPending = createVenue.isPending || updateVenue.isPending;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Padelvereine
        </h2>
        <Button size="sm" onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-1" />
          Verein
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : venues && venues.length > 0 ? (
        <div className="space-y-2">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div>
                <div className="flex items-center">
                  <span className="font-medium">{venue.name}</span>
                  <VenueCourtsBadge venueId={venue.id} />
                </div>
                {venue.address && (
                  <div className="text-sm text-muted-foreground">{venue.address}</div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => setCourtsDialogVenue(venue)}
                  title="Plätze verwalten"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => openEditDialog(venue)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(venue)}
                  disabled={deleteVenue.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-4">
          Noch keine Vereine angelegt
        </p>
      )}

      {/* Create/Edit Venue Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingVenue ? 'Verein bearbeiten' : 'Neuer Verein'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="venue-name">Name *</Label>
              <Input
                id="venue-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Padel Berlin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue-address">Adresse</Label>
              <Input
                id="venue-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="z.B. Musterstraße 123, 12345 Berlin"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingVenue ? 'Speichern' : 'Erstellen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Court Management Dialog */}
      {courtsDialogVenue && (
        <VenueCourtManager
          venue={courtsDialogVenue}
          open={!!courtsDialogVenue}
          onOpenChange={(open) => !open && setCourtsDialogVenue(null)}
        />
      )}
    </Card>
  );
}
