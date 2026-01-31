import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Download, CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function AdminBookingExport() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!startDate || !endDate) {
      toast({ title: 'Bitte Datumsbereich auswählen', variant: 'destructive' });
      return;
    }

    setIsExporting(true);
    try {
      // Fetch bookings with all related data
      const { data, error } = await supabase
        .from('court_bookings')
        .select(`
          *,
          court_slot:court_slots(
            slot_date,
            start_time,
            end_time,
            court_name,
            venue:padel_venues(name)
          ),
          match:matches(
            team_a:teams!matches_team_a_id_fkey(name, captain_name, captain_email, player2_name, player2_email),
            team_b:teams!matches_team_b_id_fkey(name, captain_name, captain_email, player2_name, player2_email)
          )
        `)
        .gte('court_slot.slot_date', format(startDate, 'yyyy-MM-dd'))
        .lte('court_slot.slot_date', format(endDate, 'yyyy-MM-dd'))
        .order('booked_at', { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        toast({ title: 'Keine Buchungen im gewählten Zeitraum' });
        setIsExporting(false);
        return;
      }

      // Filter out bookings without court_slot (due to the filter above)
      const validBookings = data.filter(b => b.court_slot);

      // Create CSV content
      const headers = [
        'Datum',
        'Platz',
        'Uhrzeit',
        'Verein',
        'Team A',
        'Captain A',
        'Email Captain A',
        'Spieler 2 A',
        'Email Spieler 2 A',
        'Team B',
        'Captain B',
        'Email Captain B',
        'Spieler 2 B',
        'Email Spieler 2 B',
      ];

      const rows = validBookings.map((booking) => {
        const slot = booking.court_slot;
        const match = booking.match;
        const teamA = match?.team_a;
        const teamB = match?.team_b;

        return [
          format(new Date(slot.slot_date), 'dd.MM.yyyy'),
          slot.court_name,
          `${slot.start_time.slice(0, 5)}-${slot.end_time.slice(0, 5)}`,
          slot.venue?.name || '',
          teamA?.name || '',
          teamA?.captain_name || '',
          teamA?.captain_email || '',
          teamA?.player2_name || '',
          teamA?.player2_email || '',
          teamB?.name || '',
          teamB?.captain_name || '',
          teamB?.captain_email || '',
          teamB?.player2_name || '',
          teamB?.player2_email || '',
        ];
      });

      // Create CSV string
      const csvContent = [
        headers.join(';'),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(';')),
      ].join('\n');

      // Add BOM for Excel to recognize UTF-8
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Download file
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `platzbuchungen_${format(startDate, 'yyyy-MM-dd')}_${format(endDate, 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({ 
        title: 'Export erfolgreich', 
        description: `${validBookings.length} Buchungen exportiert.` 
      });
    } catch (error: any) {
      toast({ 
        title: 'Export fehlgeschlagen', 
        description: error.message,
        variant: 'destructive' 
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Download className="h-5 w-5 text-primary" />
        Buchungen exportieren
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Von</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {startDate ? format(startDate, 'dd.MM.yyyy', { locale: de }) : 'Auswählen...'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  locale={de}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Bis</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {endDate ? format(endDate, 'dd.MM.yyyy', { locale: de }) : 'Auswählen...'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  locale={de}
                  disabled={(date) => startDate ? date < startDate : false}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button 
          className="w-full" 
          onClick={handleExport}
          disabled={isExporting || !startDate || !endDate}
        >
          {isExporting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          <Download className="h-4 w-4 mr-2" />
          Als CSV exportieren
        </Button>
      </div>
    </Card>
  );
}
