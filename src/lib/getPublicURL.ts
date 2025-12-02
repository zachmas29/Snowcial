import { supabase } from "@/lib/supabase_client";

export function getPublicUrl(bucket: string, path: string | null) {
  if (!path) return null;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data.publicUrl || null;
}
