import { supabase } from "@/lib/supabase_client";
import type { Tables } from "@/types/database.types";

/* fetchUsers
 * returns: array of all Users in the DB
 */
export async function fetchUsers(): Promise<Tables<"users">[]> {
  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    throw error;
  }

  return data ?? [];
}

/* fetchUser
 * params: id - a user id to search for (UUID)
 * returns: the User object associated with the given id
 */
export async function fetchUser(id: string): Promise<Tables<"users"> | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

/* getCurrentUser
 * returns: the User object for the currently authenticated user
 */
export async function getCurrentUser(): Promise<Tables<"users"> | null> {
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    throw authError || new Error("No authenticated user");
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

/* fetchUserTags
 * params: id - a user id to search for (UUID)
 * returns: the UserTags associated with the given user id
 */
export async function fetchUserTags(
  id: string,
): Promise<Tables<"user_tags">[]> {
  const { data, error } = await supabase
    .from("user_tag_assignments")
    .select("user_tags(id, name)")
    .eq("user_id", id);

  if (error) {
    throw error;
  }

  return (
    data
      ?.map((item) => item.user_tags)
      .filter((tag): tag is Tables<"user_tags"> => tag !== null) ?? []
  );
}

/* fetchEvents
 * returns: array of all Events in the DB
 */
export async function fetchEvents(): Promise<Tables<"events">[]> {
  const { data, error } = await supabase.from("events").select("*");

  if (error) {
    throw error;
  }

  return data ?? [];
}

/* fetchEvent
 * params: id - an event id to search for
 * returns: the Event object associated with the given id
 */
export async function fetchEvent(id: number): Promise<Tables<"events"> | null> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

/* fetchEventTags
 * params: id - an event id to search for
 * returns: an array of EventTags associated with the given event id
 */
export async function fetchEventTags(
  id: number,
): Promise<Tables<"event_tags">[]> {
  const { data, error } = await supabase
    .from("event_tag_assignments")
    .select("event_tags(id, name)")
    .eq("event_id", id);

  if (error) {
    throw error;
  }

  return (
    data
      ?.map((item) => item.event_tags)
      .filter((tag): tag is Tables<"event_tags"> => tag !== null) ?? []
  );
}

/* fetchEventComments
 * params: id - an event id to search for
 * returns: the EventComments associated with the given event id
 */
export async function fetchEventComments(
  id: number,
): Promise<Tables<"event_comments">[]> {
  const { data, error } = await supabase
    .from("event_comments")
    .select("*")
    .eq("event_id", id);

  if (error) {
    throw error;
  }

  return data ?? [];
}
