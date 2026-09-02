import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if we have credentials (we might not during initial local development before Supabase is connected)
// TEMPORARILY DISABLED: Forced to false to fix infinite timeouts and restore shop mock data
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey
);

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'rassa-auth-v2', // Added to bypass any stuck navigator.locks from previous crashed sessions
    }
  }
);
