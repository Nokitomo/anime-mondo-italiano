// src/integrations/supabase/client.ts
// Questo file è automaticamente generato. Non modificarlo direttamente.

import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

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
