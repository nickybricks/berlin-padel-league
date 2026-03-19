import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { CalendarIcon, ExternalLink, Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { usePlaytomicVenues, PlaytomicVenue } from '@/hooks/usePlaytomicVenues';
import { supabase } from '@/integrations/supabase/client';

interface Slot {
  start_time: string;
  duration: number;
  price: string;
}

interface CourtAvailability {
  resource_id: string;
  start_date: string;
  slots: Slot[];
}

export default function PlaytomicSearch() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const { data: venues, isLoading: venuesLoading } = usePlaytomicVenues(leagueId);

  const [selectedVenueId, setSelectedVenueId] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [results, setResults] = useState<CourtAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const selectedVenue = venues?.find((v) => v.id === selectedVenueId);

  const maxDate = addDays(new Date(), 14);

  const fetchSlots = async () => {
    if (!selectedVenue) return;
    setLoading(true);
    setSearched(true);
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const { data, error } = await supabase.functions.invoke('fetch-playtomic-slots', {
        body: { tenant_id: selectedVenue.tenant_id, date: dateStr },
      });
      if (error) throw error;
      setResults(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error('Playtomic fetch error:', e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = useMemo(() => {
    if (!timeFrom && !timeTo) return results;
    return results.map((court) => ({
      ...court,
      slots: court.slots.filter((slot) => {
        const t = slot.start_time.slice(0, 5);
        if (timeFrom && t < timeFrom) return false;
        if (timeTo && t > timeTo) return false;
        return true;
      }),
    })).filter((court) => court.slots.length > 0);
  }, [results, timeFrom, timeTo]);

  const totalSlots = filteredResults.reduce((sum, c) => sum + c.slots.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Plätze finden</h1>
        <p className="text-muted-foreground mt-1">Freie Padel-Plätze über Playtomic suchen</p>
      </div>

      {/* Filter bar */}
      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Club */}
          <div className="space-y-2">
            <Label>Club</Label>
            <Select value={selectedVenueId} onValueChange={setSelectedVenueId}>
              <SelectTrigger>
                <SelectValue placeholder="Club wählen" />
              </SelectTrigger>
              <SelectContent>
                {venues?.map((v) => (
                  <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Datum</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-full justify-start text-left font-normal')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, 'PPP', { locale: de })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  disabled={(d) => d < new Date(new Date().setHours(0,0,0,0)) || d > maxDate}
                  initialFocus
                  className={cn('p-3 pointer-events-auto')}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time from */}
          <div className="space-y-2">
            <Label>Von (optional)</Label>
            <Input type="time" value={timeFrom} onChange={(e) => setTimeFrom(e.target.value)} />
          </div>

          {/* Time to */}
          <div className="space-y-2">
            <Label>Bis (optional)</Label>
            <Input type="time" value={timeTo} onChange={(e) => setTimeTo(e.target.value)} />
          </div>
        </div>

        <Button onClick={fetchSlots} disabled={!selectedVenueId || loading} className="w-full sm:w-auto">
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
          Suchen
        </Button>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : searched && totalSlots === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          Keine freien Plätze gefunden
        </Card>
      ) : filteredResults.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{totalSlots} verfügbare Slots</p>
          {filteredResults.map((court) => (
            <Card key={court.resource_id} className="p-4">
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                Court {court.resource_id.slice(0, 8)}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {court.slots.map((slot, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-medium">{slot.start_time.slice(0, 5)}</div>
                      <div className="text-xs text-muted-foreground">{slot.duration} Min · {slot.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          {selectedVenue?.playtomic_url && (
            <Button variant="default" asChild className="w-full sm:w-auto">
              <a href={selectedVenue.playtomic_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Bei Playtomic buchen
              </a>
            </Button>
          )}
        </div>
      ) : null}

      {venuesLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!venuesLoading && venues?.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">
          Noch keine Playtomic-Venues konfiguriert. Ein Admin kann diese im Admin-Bereich hinzufügen.
        </Card>
      )}
    </div>
  );
}
