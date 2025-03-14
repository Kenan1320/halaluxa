
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Get environment variables (make sure these are set in your .env file)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://iafmcjyqqgmtreeogwqo.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhZm1janlxcWdtdHJlZW9nd3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzk1MzMsImV4cCI6MjA1NjgxNTUzM30.Sy9NbXDbOhnFalHDdEQf7XKHUo17QdDf_Oz2Y7bnJXY";

// Create a single supabase client for the entire application
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Export types for convenience
export type SupabaseClient = typeof supabase;
