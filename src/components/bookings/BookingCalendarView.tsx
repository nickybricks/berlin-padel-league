import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List } from 'lucide-react';
import { CourtSlotWithDetails } from '@/types/bookings';
import { formatTimeRange } from '@/lib/bookingUtils';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  addWeeks,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';

type ViewMode = 'month' | 'week';

interface BookingCalendarViewProps {
  slots: CourtSlotWithDetails[];
  onSlotClick: (slot: CourtSlotWithDetails) => void;
  isLoggedIn: boolean;
}

export function BookingCalendarView({ slots, onSlotClick, isLoggedIn }: BookingCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  // Get all days to display based on view mode
  const days = useMemo(() => {
    if (viewMode === 'month') {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
      const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

      const daysArray = [];
      let day = calendarStart;
      while (day <= calendarEnd) {
        daysArray.push(day);
        day = addDays(day, 1);
      }
      return daysArray;
    } else {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const daysArray = [];
      for (let i = 0; i < 7; i++) {
        daysArray.push(addDays(weekStart, i));
      }
      return daysArray;
    }
  }, [currentDate, viewMode]);

  // Group slots by date
  const slotsByDate = useMemo(() => {
    return slots.reduce((acc, slot) => {
      const date = slot.slot_date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(slot);
      return acc;
    }, {} as Record<string, CourtSlotWithDetails[]>);
  }, [slots]);

  const navigate = (direction: 'prev' | 'next') => {
    if (viewMode === 'month') {
      setCurrentDate(prev => addMonths(prev, direction === 'next' ? 1 : -1));
    } else {
      setCurrentDate(prev => addWeeks(prev, direction === 'next' ? 1 : -1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigate('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold ml-2">
            {viewMode === 'month'
              ? format(currentDate, 'MMMM yyyy', { locale: de })
              : `KW ${format(currentDate, 'w', { locale: de })} - ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'dd.MM.', { locale: de })} bis ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'dd.MM.yyyy', { locale: de })}`
            }
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={goToToday}>
            Heute
          </Button>
          <div className="flex rounded-lg border overflow-hidden">
            <Button
              variant={viewMode === 'month' ? 'secondary' : 'ghost'}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode('month')}
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              Monat
            </Button>
            <Button
              variant={viewMode === 'week' ? 'secondary' : 'ghost'}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode('week')}
            >
              <List className="h-4 w-4 mr-1" />
              Woche
            </Button>
          </div>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className={cn(
        'grid grid-cols-7 gap-1',
        viewMode === 'week' ? 'min-h-[400px]' : ''
      )}>
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const daySlots = slotsByDate[dateKey] || [];
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          const bookedCount = daySlots.filter(s => s.booking).length;
          const freeCount = daySlots.length - bookedCount;

          return (
            <div
              key={dateKey}
              className={cn(
                'border rounded-lg p-1 min-h-[80px] transition-colors',
                viewMode === 'week' ? 'min-h-[400px]' : '',
                !isCurrentMonth && viewMode === 'month' && 'bg-muted/30 opacity-50',
                isCurrentDay && 'ring-2 ring-primary',
              )}
            >
              {/* Day Number */}
              <div className={cn(
                'text-right text-sm font-medium mb-1 px-1',
                isCurrentDay && 'text-primary'
              )}>
                {format(day, 'd')}
              </div>

              {/* Slots Summary (Month View) */}
              {viewMode === 'month' && daySlots.length > 0 && (
                <div className="space-y-0.5">
                  {freeCount > 0 && (
                    <Badge variant="default" className="w-full justify-center text-xs py-0">
                      {freeCount} frei
                    </Badge>
                  )}
                  {bookedCount > 0 && (
                    <Badge variant="secondary" className="w-full justify-center text-xs py-0">
                      {bookedCount} gebucht
                    </Badge>
                  )}
                </div>
              )}

              {/* Slots Detail (Week View) */}
              {viewMode === 'week' && (
                <div className="space-y-1 overflow-y-auto max-h-[350px]">
                  {daySlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => isLoggedIn && !slot.booking && onSlotClick(slot)}
                      disabled={!isLoggedIn || !!slot.booking}
                      className={cn(
                        'w-full text-left p-2 rounded text-xs transition-colors',
                        slot.booking
                          ? 'bg-muted/50 text-muted-foreground cursor-default'
                          : 'bg-primary/10 hover:bg-primary/20 cursor-pointer',
                        !isLoggedIn && 'cursor-default'
                      )}
                    >
                      <div className="font-medium truncate">
                        {formatTimeRange(slot.start_time, slot.end_time).replace(' Uhr', '')}
                      </div>
                      <div className="truncate text-muted-foreground">
                        {slot.court_name}
                      </div>
                      {slot.booking?.match && (
                        <div className="truncate mt-1 text-accent font-medium">
                          {slot.booking.match.team_a.name} vs {slot.booking.match.team_b.name}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-primary/20" />
          <span>Frei</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-muted" />
          <span>Gebucht</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded ring-2 ring-primary" />
          <span>Heute</span>
        </div>
      </div>
    </Card>
  );
}
