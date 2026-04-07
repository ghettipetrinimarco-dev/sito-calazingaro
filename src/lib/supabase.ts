import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

// Client lazy — mai costante globale (causa build errors senza env vars)
export function supabaseAdmin() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
