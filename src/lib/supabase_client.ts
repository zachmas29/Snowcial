import { createClient } from "@supabase/supabase-js";

// Client-side Supabase client (for browser/React components)
export function createSupabaseClient() {
  const SupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SupabaseUrl || !SupabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables",
    );
  }
  return createClient(SupabaseUrl, SupabaseAnonKey);
}

export const supabase = createSupabaseClient();
