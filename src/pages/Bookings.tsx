import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useVenues } from '@/hooks/useVenues';
import { useCourtSlots, useDeleteCourtSlot, useDeleteBooking } from '@/hooks/useBookings';
import { BookingSlotCard } from '@/components/bookings/BookingSlotCard';
import { BookingDialog } from '@/components/bookings/BookingDialog';
import { AdminVenueManager } from '@/components/bookings/AdminVenueManager';
import { AdminSlotCreator } from '@/components/bookings/AdminSlotCreator';
import { AdminBookingExport } from '@/components/bookings/AdminBookingExport';
import { CourtSlotWithDetails } from '@/types/bookings';
import { format, addDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

export default function Bookings() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const { isAdmin, user } = useAuth();
  const { data: venues } = useVenues(leagueId);

  const [selectedVenueId, setSelectedVenueId] = useState<string>('all');
  const [bookingSlot, setBookingSlot] = useState<CourtSlotWithDetails | null>(null);

  // Fetch slots for the next 60 days
  const startDate = format(new Date(), 'yyyy-MM-dd');
  const endDate = format(addDays(new Date(), 60), 'yyyy-MM-dd');

  const { data: slots, isLoading } = useCourtSlots(
    selectedVenueId !== 'all' ? selectedVenueId : undefined,
    startDate,
    endDate,
    leagueId
  );

  const deleteSlot = useDeleteCourtSlot();
  const deleteBooking = useDeleteBooking();

  // Group slots by date
  const slotsByDate = useMemo(() => {
    if (!slots) return {};

    return slots.reduce((acc, slot) => {
      const date = slot.slot_date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(slot);
      return acc;
    }, {} as Record<string, CourtSlotWithDetails[]>);
  }, [slots]);

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm('Platz wirklich löschen?')) return;

    try {
      await deleteSlot.mutateAsync(slotId);
      toast({ title: 'Platz gelöscht' });
    } catch (error: any) {
      toast({ title: 'Fehler', description: error.message, variant: 'destructive' });
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Buchung wirklich stornieren?')) return;

    try {
      await deleteBooking.mutateAsync(bookingId);
      toast({ title: 'Buchung storniert' });
    } catch (error: any) {
      toast({ title: 'Fehler', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">

      {isAdmin ? (
        <Tabs defaultValue="bookings">
          <TabsList>
            <TabsTrigger value="bookings">Buchungen</TabsTrigger>
            <TabsTrigger value="admin">
              <Settings className="h-4 w-4 mr-1" />
              Verwaltung
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-4">
            <BookingsView
              venues={venues}
              selectedVenueId={selectedVenueId}
              setSelectedVenueId={setSelectedVenueId}
              slotsByDate={slotsByDate}
              isLoading={isLoading}
              onBook={setBookingSlot}
              onCancelBooking={handleCancelBooking}
              onDeleteSlot={handleDeleteSlot}
              isLoggedIn={!!user}
            />
          </TabsContent>

          <TabsContent value="admin" className="mt-4">
            <div className="grid gap-6 lg:grid-cols-2">
              <AdminVenueManager leagueId={leagueId} />
              <AdminSlotCreator leagueId={leagueId} />
              <div className="lg:col-span-2">
                <AdminBookingExport />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <BookingsView
          venues={venues}
          selectedVenueId={selectedVenueId}
          setSelectedVenueId={setSelectedVenueId}
          slotsByDate={slotsByDate}
          isLoading={isLoading}
          onBook={setBookingSlot}
          onCancelBooking={handleCancelBooking}
          onDeleteSlot={handleDeleteSlot}
          isLoggedIn={!!user}
        />
      )}

      <BookingDialog
        slot={bookingSlot}
        open={!!bookingSlot}
        onOpenChange={(open) => !open && setBookingSlot(null)}
      />
    </div>
  );
}

interface BookingsViewProps {
  venues: any[] | undefined;
  selectedVenueId: string;
  setSelectedVenueId: (id: string) => void;
  slotsByDate: Record<string, CourtSlotWithDetails[]>;
  isLoading: boolean;
  onBook: (slot: CourtSlotWithDetails) => void;
  onCancelBooking: (id: string) => void;
  onDeleteSlot: (id: string) => void;
  isLoggedIn: boolean;
}

function BookingsView({
  venues,
  selectedVenueId,
  setSelectedVenueId,
  slotsByDate,
  isLoading,
  onBook,
  onCancelBooking,
  onDeleteSlot,
  isLoggedIn,
}: BookingsViewProps) {
  const dates = Object.keys(slotsByDate).sort();

  return (
    <div className="space-y-4">
      {/* Filter */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">Verein:</span>
          <Select value={selectedVenueId} onValueChange={setSelectedVenueId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Alle Vereine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Vereine</SelectItem>
              {venues?.map((venue) => (
                <SelectItem key={venue.id} value={venue.id}>
                  {venue.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Slots by Date */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : dates.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Keine Plätze verfügbar</p>
          {!isLoggedIn && (
            <p className="text-sm text-muted-foreground mt-2">
              Melde dich an, um Plätze zu buchen.
            </p>
          )}
        </Card>
      ) : (
        <div className="space-y-6">
          {dates.map((date) => (
            <div key={date}>
              <h2 className="text-lg font-semibold mb-3 sticky top-16 bg-background py-2 z-10">
                {format(new Date(date), 'EEEE, dd. MMMM yyyy', { locale: de })}
              </h2>
              <div className="space-y-2">
                {slotsByDate[date].map((slot) => (
                  <BookingSlotCard
                    key={slot.id}
                    slot={slot}
                    onBook={isLoggedIn ? onBook : undefined}
                    onCancelBooking={onCancelBooking}
                    onDeleteSlot={onDeleteSlot}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
