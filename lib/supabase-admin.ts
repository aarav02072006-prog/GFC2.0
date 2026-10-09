import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase";

let client: ReturnType<typeof createClient<Database>> | undefined;

export function getSupabaseAdmin() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Server-side Supabase authentication is not configured. Set SUPABASE_SECRET_KEY.",
    );
  }

  client = createClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
  return client;
}
