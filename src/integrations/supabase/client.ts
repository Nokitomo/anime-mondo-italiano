
// src/integrations/supabase/client.ts
// Questo file è automaticamente generato. Non modificarlo direttamente.

import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

// Hardcoded values instead of env variables for reliability
const SUPABASE_URL = "https://buzymhfvxyescbrqguga.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1enltaGZ2eHllc2NicnFndWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTE5ODIsImV4cCI6MjA2MTA4Nzk4Mn0.obDrwD4s1is-gphqdv2Vra66md3eXjmJtE4cHUHr-QA"

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: localStorage,
    },
  }
)
