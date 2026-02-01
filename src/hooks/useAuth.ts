import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AppRole, UserRole } from '@/types/database';

interface AuthState {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  teamId: string | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    role: null,
    teamId: null,
    loading: true,
  });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState(prev => ({ ...prev, session, user: session?.user ?? null }));

        if (session?.user) {
          // Fetch user role
          setTimeout(async () => {
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role, team_id')
              .eq('user_id', session.user.id)
              .single();

            if (roleData) {
              setAuthState(prev => ({
                ...prev,
                role: roleData.role as AppRole,
                teamId: roleData.team_id,
                loading: false,
              }));
            } else {
              setAuthState(prev => ({ ...prev, loading: false }));
            }
          }, 0);
        } else {
          setAuthState(prev => ({
            ...prev,
            role: null,
            teamId: null,
            loading: false,
          }));
        }
      }
    );

    // THEN get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const isAdmin = authState.role === 'admin';
  const isPlayer = authState.role === 'player';
  const canEnterResults = isAdmin || isPlayer;

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isPlayer,
    canEnterResults,
  };
}
