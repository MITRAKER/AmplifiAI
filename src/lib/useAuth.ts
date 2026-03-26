'use client';

import { useEffect, useState } from 'react';
import { supabase, getUser, validateSupabaseConfig } from './supabase';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        validateSupabaseConfig();
        const currentUser = await getUser();
        setUser(currentUser);
      } catch (err) {
        // Supabase not configured yet, that's ok
        console.warn('Supabase not configured');
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Subscribe to auth changes
    const subscription = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.data?.subscription?.unsubscribe();
    };
  }, []);

  return { user, loading, error };
}
