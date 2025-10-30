import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// Client-side Supabase client (for browser/React components)
export function createSupabaseClient() {
  // Fallback to hardcoded values for deployment
  const SupabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://tjobvluajdnyfmwntxmz.supabase.co";
  const SupabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqb2J2bHVhamRueWZtd250eG16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3ODA1MzMsImV4cCI6MjA3NzM1NjUzM30.001r-u6qs_mSwrwLS7ufGWsC8bLkUNBcFQlUt1JqyiI";

  return createClient<Database>(SupabaseUrl, SupabaseAnonKey);
}

export const supabase = createSupabaseClient();
