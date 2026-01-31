import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, X } from 'lucide-react';
import { CourtSlotWithDetails } from '@/types/bookings';
import { formatTimeRange, isBookingOpen, formatDateDE } from '@/lib/bookingUtils';
import { useAuth } from '@/hooks/useAuth';

interface BookingSlotCardProps {
  slot: CourtSlotWithDetails;
  onBook?: (slot: CourtSlotWithDetails) => void;
  onCancelBooking?: (bookingId: string) => void;
  onDeleteSlot?: (slotId: string) => void;
}

export function BookingSlotCard({ 
  slot, 
  onBook, 
  onCancelBooking,
  onDeleteSlot 
}: BookingSlotCardProps) {
  const { isAdmin, teamId } = useAuth();
  const isBooked = !!slot.booking;
  const slotDate = new Date(slot.slot_date);
  const { isOpen, reason } = isBookingOpen(slotDate);
  
  const canBook = !isBooked && isOpen && (isAdmin || teamId);
  const canCancel = isBooked && (
    isAdmin || 
    (teamId && slot.booking?.booked_by_team_id === teamId && isOpen)
  );

  return (
    <Card className={`p-4 ${isBooked ? 'bg-muted/50' : 'bg-card'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={isBooked ? 'secondary' : 'default'}>
              {slot.court_name}
            </Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {slot.venue.name}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {formatDateDE(slotDate)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {formatTimeRange(slot.start_time, slot.end_time)}
            </span>
          </div>

          {isBooked && slot.booking?.match && (
            <div className="flex items-center gap-2 mt-2 p-2 rounded bg-accent/10">
              <Users className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">
                {slot.booking.match.team_a.name} vs {slot.booking.match.team_b.name}
              </span>
            </div>
          )}

          {!isBooked && !isOpen && reason && (
            <p className="text-xs text-muted-foreground">{reason}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {canBook && onBook && (
            <Button size="sm" onClick={() => onBook(slot)}>
              Buchen
            </Button>
          )}
          
          {canCancel && onCancelBooking && slot.booking && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onCancelBooking(slot.booking!.id)}
            >
              <X className="h-4 w-4 mr-1" />
              Stornieren
            </Button>
          )}

          {isAdmin && onDeleteSlot && !isBooked && (
            <Button 
              size="sm" 
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => onDeleteSlot(slot.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
