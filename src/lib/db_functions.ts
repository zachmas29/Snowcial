import { supabase } from "@/lib/supabase_client";
import type { User } from "@/types/db_types";

export async function fetchUsers(): Promise<User[]> {
  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    return [];
  }

  return data as User[];
}
