import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2, Search } from 'lucide-react';
import {
  usePlaytomicVenues, useCreatePlaytomicVenue, useUpdatePlaytomicVenue, useDeletePlaytomicVenue,
  PlaytomicVenue,
} from '@/hooks/usePlaytomicVenues';
import { toast } from '@/hooks/use-toast';

export function AdminPlaytomicVenues({ leagueId }: { leagueId?: string }) {
  const { data: venues, isLoading } = usePlaytomicVenues(leagueId);
  const createVenue = useCreatePlaytomicVenue();
  const updateVenue = useUpdatePlaytomicVenue();
  const deleteVenue = useDeletePlaytomicVenue();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PlaytomicVenue | null>(null);
  const [name, setName] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [city, setCity] = useState('Berlin');
  const [country, setCountry] = useState('Deutschland');
  const [playtomicUrl, setPlaytomicUrl] = useState('');

  const openCreate = () => {
    setEditing(null);
    setName(''); setTenantId(''); setCity('Berlin'); setCountry('Deutschland'); setPlaytomicUrl('');
    setDialogOpen(true);
  };

  const openEdit = (v: PlaytomicVenue) => {
    setEditing(v);
    setName(v.name); setTenantId(v.tenant_id); setCity(v.city || 'Berlin');
    setCountry(v.country || 'Deutschland'); setPlaytomicUrl(v.playtomic_url || '');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !tenantId.trim()) {
      toast({ title: 'Name und Tenant-ID sind erforderlich', variant: 'destructive' });
      return;
    }
    try {
      if (editing) {
        await updateVenue.mutateAsync({
          id: editing.id, name: name.trim(), tenant_id: tenantId.trim(),
          city: city.trim() || undefined, country: country.trim() || undefined,
          playtomic_url: playtomicUrl.trim() || undefined,
        });
        toast({ title: 'Playtomic-Venue aktualisiert' });
      } else {
        if (!leagueId) return;
        await createVenue.mutateAsync({
          league_id: leagueId, name: name.trim(), tenant_id: tenantId.trim(),
          city: city.trim() || undefined, country: country.trim() || undefined,
          playtomic_url: playtomicUrl.trim() || undefined,
        });
        toast({ title: 'Playtomic-Venue erstellt' });
      }
      setDialogOpen(false);
    } catch (error: any) {
      toast({ title: 'Fehler', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (v: PlaytomicVenue) => {
    if (!confirm(`"${v.name}" wirklich löschen?`)) return;
    try {
      await deleteVenue.mutateAsync(v.id);
      toast({ title: 'Venue gelöscht' });
    } catch (error: any) {
      toast({ title: 'Fehler beim Löschen', description: error.message, variant: 'destructive' });
    }
  };

  const isPending = createVenue.isPending || updateVenue.isPending;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Playtomic Venues
        </h2>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" />
          Venue
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : venues && venues.length > 0 ? (
        <div className="space-y-2">
          {venues.map((v) => (
            <div key={v.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <span className="font-medium">{v.name}</span>
                <div className="text-sm text-muted-foreground">
                  {v.city}{v.country ? `, ${v.country}` : ''} · <span className="font-mono text-xs">{v.tenant_id}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" onClick={() => openEdit(v)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(v)} disabled={deleteVenue.isPending}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-4">
          Noch keine Playtomic-Venues hinterlegt
        </p>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Venue bearbeiten' : 'Neues Playtomic-Venue'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="z.B. PadelBerlin" />
            </div>
            <div className="space-y-2">
              <Label>Playtomic Tenant-ID *</Label>
              <Input value={tenantId} onChange={(e) => setTenantId(e.target.value)} placeholder="z.B. 2ab75436-9bb0-..." className="font-mono text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stadt</Label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Land</Label>
                <Input value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Playtomic-URL</Label>
              <Input value={playtomicUrl} onChange={(e) => setPlaytomicUrl(e.target.value)} placeholder="https://playtomic.io/tenant/..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Abbrechen</Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing ? 'Speichern' : 'Erstellen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
