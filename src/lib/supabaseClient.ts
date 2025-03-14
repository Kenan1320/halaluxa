
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://iafmcjyqqgmtreeogwqo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhZm1janlxcWdtdHJlZW9nd3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzk1MzMsImV4cCI6MjA1NjgxNTUzM30.Sy9NbXDbOhnFalHDdEQf7XKHUo17QdDf_Oz2Y7bnJXY";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);
