import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.BUCKETLIST_SUPABASE_URL as string;
const supabaseServiceRoleKey = process.env.BUCKETLIST_SUPABASE_SERVICE_ROLE_KEY as string;

// Separate Supabase project from the one used for booking.requests (src/lib/supabase.ts).
// Server-only client (service role key) — never import this from a "use client" component.
export const supabaseBucketList = createClient(supabaseUrl, supabaseServiceRoleKey);
