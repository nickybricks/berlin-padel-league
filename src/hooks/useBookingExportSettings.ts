import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BookingExportSettings } from '@/types/bookings';

export function useBookingExportSettings() {
  return useQuery({
    queryKey: ['booking-export-settings'],
    queryFn: async (): Promise<BookingExportSettings | null> => {
      const { data, error } = await supabase
        .from('booking_export_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        throw error;
      }
      return data as BookingExportSettings;
    },
  });
}

export function useUpdateBookingExportSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: { recipient_emails: string[]; is_active: boolean }) => {
      // First try to update existing row
      const { data: existing } = await supabase
        .from('booking_export_settings')
        .select('id')
        .limit(1)
        .single();
      
      if (existing) {
        const { data, error } = await supabase
          .from('booking_export_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Insert if no row exists
        const { data, error } = await supabase
          .from('booking_export_settings')
          .insert(settings)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-export-settings'] });
    },
  });
}
