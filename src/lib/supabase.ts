import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy initialization to avoid build-time errors when env vars aren't set
let _supabase: SupabaseClient | null = null;
let _serviceSupabase: SupabaseClient | null = null;

/**
 * Get public Supabase client (uses anon key)
 * Safe for client-side use with RLS enabled
 */
export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  _supabase = createClient(url, anonKey);
  return _supabase;
}

// Alias for backward compatibility
export const supabase = {
  from: (...args: Parameters<SupabaseClient["from"]>) => getSupabase().from(...args),
};

/**
 * Admin Supabase client (uses service role key)
 * SERVER ONLY - bypasses RLS, use for create/update operations
 */
export function getServiceSupabase(): SupabaseClient {
  if (_serviceSupabase) return _serviceSupabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  _serviceSupabase = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return _serviceSupabase;
}

/**
 * Health check - verify DB connection
 */
export async function checkSupabaseHealth(): Promise<boolean> {
  try {
    const client = getSupabase();
    const { error } = await client.from("_health_check_dummy").select("*").limit(1);
    // Table doesn't exist but connection works if we get a specific error
    return !error || error.code === "42P01"; // 42P01 = table doesn't exist (expected)
  } catch {
    return false;
  }
}
