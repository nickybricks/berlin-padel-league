import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Plus, CalendarIcon, Clock, X, Loader2, AlertCircle } from 'lucide-react';
import { useVenues, useVenueCourts } from '@/hooks/useVenues';
import { useCreateCourtSlots, useCourtSlots } from '@/hooks/useBookings';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

const TIME_SLOTS = [
  { start: '18:00', end: '19:30' },
  { start: '19:30', end: '21:00' },
  { start: '20:00', end: '21:30' },
  { start: '21:00', end: '22:30' },
];

export function AdminSlotCreator({ leagueId }: { leagueId?: string }) {
  const { data: venues } = useVenues(leagueId);
  const createSlots = useCreateCourtSlots();

  const [venueId, setVenueId] = useState<string>('');
  const [selectedCourts, setSelectedCourts] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<{ start: string; end: string }[]>([]);
  const [customStartTime, setCustomStartTime] = useState('');
  const [customEndTime, setCustomEndTime] = useState('');

  // Fetch courts for selected venue
  const { data: venueCourts, isLoading: courtsLoading } = useVenueCourts(venueId);
  
  // Fetch existing slots to check for duplicates
  const { data: existingSlots } = useCourtSlots();

  // Reset court selection when venue changes
  const handleVenueChange = (newVenueId: string) => {
    setVenueId(newVenueId);
    setSelectedCourts([]);
  };

  const toggleCourt = (court: string) => {
    setSelectedCourts(prev =>
      prev.includes(court) ? prev.filter(c => c !== court) : [...prev, court]
    );
  };

  const toggleDate = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDates(prev => {
      const existing = prev.find(d => d.toDateString() === date.toDateString());
      if (existing) {
        return prev.filter(d => d.toDateString() !== date.toDateString());
      }
      return [...prev, date].sort((a, b) => a.getTime() - b.getTime());
    });
  };

  const toggleTime = (time: { start: string; end: string }) => {
    setSelectedTimes(prev => {
      const existing = prev.find(t => t.start === time.start && t.end === time.end);
      if (existing) {
        return prev.filter(t => !(t.start === time.start && t.end === time.end));
      }
      return [...prev, time];
    });
  };

  const addCustomTime = () => {
    if (!customStartTime || !customEndTime) {
      toast({ title: 'Start- und Endzeit erforderlich', variant: 'destructive' });
      return;
    }
    if (customStartTime >= customEndTime) {
      toast({ title: 'Startzeit muss vor Endzeit liegen', variant: 'destructive' });
      return;
    }
    const newTime = { start: customStartTime, end: customEndTime };
    if (!selectedTimes.find(t => t.start === newTime.start && t.end === newTime.end)) {
      setSelectedTimes(prev => [...prev, newTime]);
    }
    setCustomStartTime('');
    setCustomEndTime('');
  };

  // Calculate slots and check for duplicates
  const { newSlots, duplicateCount } = useMemo(() => {
    if (!venueId || selectedCourts.length === 0 || selectedDates.length === 0 || selectedTimes.length === 0) {
      return { newSlots: [], duplicateCount: 0 };
    }

    const allSlots = [];
    let duplicates = 0;

    for (const court of selectedCourts) {
      for (const date of selectedDates) {
        for (const time of selectedTimes) {
          const dateStr = format(date, 'yyyy-MM-dd');
          const startTimeStr = time.start + ':00';
          
          // Check if this slot already exists
          const isDuplicate = existingSlots?.some(
            slot => 
              slot.venue_id === venueId &&
              slot.court_name === court &&
              slot.slot_date === dateStr &&
              slot.start_time === startTimeStr
          );

          if (isDuplicate) {
            duplicates++;
          } else {
            allSlots.push({
              venue_id: venueId,
              court_name: court,
              slot_date: dateStr,
              start_time: startTimeStr,
              end_time: time.end + ':00',
            });
          }
        }
      }
    }

    return { newSlots: allSlots, duplicateCount: duplicates };
  }, [venueId, selectedCourts, selectedDates, selectedTimes, existingSlots]);

  const totalSlots = selectedCourts.length * selectedDates.length * selectedTimes.length;

  const handleCreate = async () => {
    if (newSlots.length === 0) {
      toast({ 
        title: duplicateCount > 0 
          ? 'Alle Plätze existieren bereits' 
          : 'Bitte alle Felder ausfüllen',
        variant: 'destructive' 
      });
      return;
    }

    try {
      await createSlots.mutateAsync(newSlots);
      
      let message = `${newSlots.length} Plätze erstellt`;
      if (duplicateCount > 0) {
        message += `, ${duplicateCount} Duplikate übersprungen`;
      }
      
      toast({ 
        title: message,
        description: 'Die Plätze können jetzt gebucht werden.',
      });
      
      // Reset form
      setSelectedCourts([]);
      setSelectedDates([]);
      setSelectedTimes([]);
    } catch (error: any) {
      if (error.message?.includes('unique_court_slot')) {
        toast({ 
          title: 'Einige Plätze existieren bereits', 
          description: 'Bitte prüfen Sie die Auswahl.',
          variant: 'destructive' 
        });
      } else {
        toast({ 
          title: 'Fehler beim Erstellen', 
          description: error.message,
          variant: 'destructive' 
        });
      }
    }
  };

  const courtNames = venueCourts?.map(c => c.name) || [];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Plus className="h-5 w-5 text-primary" />
        Plätze erstellen
      </h2>

      <div className="space-y-6">
        {/* Venue Selection */}
        <div className="space-y-2">
          <Label>Verein *</Label>
          <Select value={venueId} onValueChange={handleVenueChange}>
            <SelectTrigger>
              <SelectValue placeholder="Verein auswählen..." />
            </SelectTrigger>
            <SelectContent>
              {venues?.map((venue) => (
                <SelectItem key={venue.id} value={venue.id}>
                  {venue.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Court Selection - Dynamic based on venue */}
        <div className="space-y-2">
          <Label>Plätze *</Label>
          {!venueId ? (
            <p className="text-sm text-muted-foreground">
              Bitte zuerst einen Verein auswählen
            </p>
          ) : courtsLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Lade Plätze...
            </div>
          ) : courtNames.length === 0 ? (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Keine Plätze für diesen Verein konfiguriert. 
              Bitte zuerst Plätze in der Vereinsverwaltung anlegen.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {courtNames.map((court) => (
                <Badge
                  key={court}
                  variant={selectedCourts.includes(court) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleCourt(court)}
                >
                  {court}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Date Selection */}
        <div className="space-y-2">
          <Label>Daten * ({selectedDates.length} ausgewählt)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {selectedDates.length > 0
                  ? `${selectedDates.length} Datum(e) ausgewählt`
                  : 'Daten auswählen...'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={undefined}
                onSelect={toggleDate}
                locale={de}
                modifiers={{
                  selected: selectedDates,
                }}
                modifiersStyles={{
                  selected: {
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                  },
                }}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
          {selectedDates.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedDates.map((date) => (
                <Badge key={date.toISOString()} variant="secondary" className="gap-1">
                  {format(date, 'EEE dd.MM.', { locale: de })}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleDate(date)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Time Selection */}
        <div className="space-y-2">
          <Label>Uhrzeiten *</Label>
          <div className="flex flex-wrap gap-2">
            {TIME_SLOTS.map((time) => {
              const isSelected = selectedTimes.find(
                t => t.start === time.start && t.end === time.end
              );
              return (
                <Badge
                  key={`${time.start}-${time.end}`}
                  variant={isSelected ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleTime(time)}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {time.start} - {time.end}
                </Badge>
              );
            })}
          </div>
          
          {/* Custom Time */}
          <div className="flex items-end gap-2 mt-2">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Von</Label>
              <Input
                type="time"
                value={customStartTime}
                onChange={(e) => setCustomStartTime(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Bis</Label>
              <Input
                type="time"
                value={customEndTime}
                onChange={(e) => setCustomEndTime(e.target.value)}
              />
            </div>
            <Button size="icon" variant="outline" onClick={addCustomTime}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {selectedTimes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedTimes.map((time) => (
                <Badge key={`${time.start}-${time.end}`} variant="secondary" className="gap-1">
                  {time.start} - {time.end}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleTime(time)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Summary & Create Button */}
        <div className="pt-4 border-t">
          {totalSlots > 0 && (
            <div className="space-y-1 mb-3">
              <p className="text-sm text-muted-foreground">
                Es werden <strong>{newSlots.length}</strong> Plätze erstellt
                ({selectedCourts.length} Plätze × {selectedDates.length} Tage × {selectedTimes.length} Zeiten)
              </p>
              {duplicateCount > 0 && (
                <p className="text-sm text-warning flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {duplicateCount} Duplikate werden übersprungen
                </p>
              )}
            </div>
          )}
          <Button 
            className="w-full" 
            onClick={handleCreate}
            disabled={newSlots.length === 0 || createSlots.isPending}
          >
            {createSlots.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {newSlots.length > 0 ? `${newSlots.length} Plätze erstellen` : 'Plätze erstellen'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
