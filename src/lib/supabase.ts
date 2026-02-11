import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Public Supabase client (uses anon key)
 * Safe for client-side use with RLS enabled
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Admin Supabase client (uses service role key)
 * SERVER ONLY - bypasses RLS, use for create/update operations
 */
export function getServiceSupabase() {
  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Health check - verify DB connection
 */
export async function checkSupabaseHealth(): Promise<boolean> {
  try {
    const { error } = await supabase.from("_health_check_dummy").select("*").limit(1);
    // Table doesn't exist but connection works if we get a specific error
    return !error || error.code === "42P01"; // 42P01 = table doesn't exist (expected)
  } catch {
    return false;
  }
}
