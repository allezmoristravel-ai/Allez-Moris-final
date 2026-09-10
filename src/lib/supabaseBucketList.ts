import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Separate Supabase project from the one used for booking.requests (src/lib/supabase.ts).
// Server-only client (service role key) — never import this from a "use client" component.
let client: SupabaseClient | null = null;

export function getSupabaseBucketList(): SupabaseClient {
  if (client) return client;

  const supabaseUrl = process.env.BUCKETLIST_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.BUCKETLIST_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Bucket list Supabase config missing: set BUCKETLIST_SUPABASE_URL and BUCKETLIST_SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  client = createClient(supabaseUrl, supabaseServiceRoleKey);
  return client;
}
