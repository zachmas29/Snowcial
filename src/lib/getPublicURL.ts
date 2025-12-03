import { supabase } from "@/lib/supabase_client";

export function getPublicUrl(bucket: string, path: string | null) {
  if (!path) return null;

  // If it's already a full URL (e.g., Google OAuth photo), return as-is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Otherwise, convert storage path to public URL
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data.publicUrl || null;
}
