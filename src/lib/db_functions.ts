/** biome-ignore-all lint/style/useNamingConvention: <Using snake_case to make Supabase happy> */
import { supabase } from "@/lib/supabase_client";
import type { UserProfileData } from "@/types/app.types";
import type { Tables } from "@/types/database.types";
import type { EventFormData } from "@/types/EventCreator.types";
import type { UserWithTags } from "@/types/User";

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

/* fetchUsersWithTags
 * returns: array of all Users in the DB with their associated tags
 */
export async function fetchUsersWithTags(): Promise<UserWithTags[]> {
  type UserRowWithAssignments = Tables<"users"> & {
    userTagAssignments?: {
      userTags: Tables<"user_tags"> | null;
    }[];
  };

  const { data, error } = await supabase.from("users").select(
    `
        *,
        userTagAssignments:user_tag_assignments (
          userTags:user_tags ( id, name )
        )
      `,
  );

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as UserRowWithAssignments[];

  return rows.map(({ userTagAssignments, ...user }) => ({
    ...user,
    tags:
      userTagAssignments
        ?.map((assignment) => assignment.userTags)
        .filter((tag): tag is Tables<"user_tags"> => tag !== null) ?? [],
  }));
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
    .select("userTags:user_tags(id, name)")
    .eq("user_id", id);

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as { userTags: Tables<"user_tags"> | null }[];

  return (
    rows
      ?.map((item) => item.userTags)
      .filter((tag): tag is Tables<"user_tags"> => tag !== null) ?? []
  );
}

/* fetchUserGalleryPhotos
 * params: id - a user id to search for
 * returns: the gallery photos associated with the given user id
 */
export async function fetchUserGalleryPhotos(
  id: string,
): Promise<Tables<"gallery_photos">[]> {
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/* fetchUserProfile
 * params: id - a user id to search for
 * returns: the user, along with tags and gallery photos, or null if not found
 */
export async function fetchUserProfile(
  id: string,
): Promise<UserProfileData | null> {
  const user = await fetchUser(id);

  if (!user) {
    return null;
  }

  const [tags, galleryPhotos] = await Promise.all([
    fetchUserTags(id),
    fetchUserGalleryPhotos(id),
  ]);

  return { user, tags, galleryPhotos };
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
    .select("event_tags:event_tags(id, name)")
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

/** fetchEventTagOptions
 * @returns A list of all possible event tags
 */

export async function fetchEventTagOptions(): Promise<Tables<"event_tags">[]> {
  const { data, error } = await supabase.from("event_tags").select("*");

  if (error) {
    throw error;
  }

  return data ?? [];
}

/**
 * Inserts a new event and its tag assignments
 * @param eventFormData - The event data including tags
 * @returns The inserted event or null if failed
 */
export async function insertEventWithTags(
  eventFormData: EventFormData,
  user_id: string,
): Promise<Tables<"events"> | null> {
  if (!eventFormData.event_time) {
    throw Error("Invalid event date provided.");
  }

  const { data: event, error: eventError } = await supabase
    .from("events")
    .insert({
      title: eventFormData.title,
      description: eventFormData.description,
      event_time: eventFormData.event_time?.toISOString(),
      creator_id: user_id,
    })
    .select()
    .single();

  if (eventError) {
    throw eventError;
  }

  if (!event) {
    throw Error("No event found");
  }

  if (eventFormData.tags.length > 0) {
    const tagAssignments = eventFormData.tags.map((tag) => ({
      event_id: event.id,
      tag_id: tag.id,
    }));

    const { error: tagError } = await supabase
      .from("event_tag_assignments")
      .insert(tagAssignments);

    if (tagError) {
      throw tagError;
    }
  }

  return event;
}
