import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Team } from '@/types/database';

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: async (): Promise<Team[]> => {
      // Use teams_authenticated view which automatically hides contact info
      // for users who aren't authorized to see it
      const { data, error } = await supabase
        .from('teams_authenticated')
        .select('*')
        .order('name');

      if (error) {
        // Fallback to teams table if view doesn't exist yet
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('teams')
          .select('*')
          .order('name');
        
        if (fallbackError) throw fallbackError;
        return fallbackData as Team[];
      }
      return data as Team[];
    },
  });
}
