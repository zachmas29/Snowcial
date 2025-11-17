/** biome-ignore-all lint/style/useNamingConvention: <Using snake_case to make Supabase happy> */
import { supabase } from "@/lib/supabase_client";
import type { AttendeeCountType } from "@/types/AttendeeCountType.type";
import type { UserProfileData } from "@/types/app.types";
import type { Tables } from "@/types/database.types";
import type { EventFormData, GenericTagType } from "@/types/EventCreator.types";
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

/* fetchEventsByUser
 * params: userId - a user id to search for events created by them
 * returns: array of Events created by the specified user
 */
export async function fetchEventsByUser(
  userId: string,
): Promise<Tables<"events">[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("creator_id", userId)
    .order("event_time", { ascending: false });

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
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * deleteEvent
 * @params id - the event id to delete
 * @returns void - throws error if deletion fails
 */
export async function deleteEvent(id: number): Promise<void> {
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

/* getAttendeeCount
 * params: id - the event id to search for
 * returns: an object of type AttendeeCountType containing
 *    yes - the number of people who answered 'yes'
 *    maybe - the number of people who answered 'maybe'
 *    total - yes + maybe
 */
export async function getAttendeeCount(eventId: number) {
  const yesPromise = supabase
    .from("event_rsvps")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId)
    .eq("status", "yes");

  const maybePromise = supabase
    .from("event_rsvps")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId)
    .eq("status", "maybe");

  const [yesResult, maybeResult] = await Promise.all([
    yesPromise,
    maybePromise,
  ]);
  if (yesResult.error) {
    throw yesResult.error;
  }
  if (maybeResult.error) {
    throw maybeResult.error;
  }

  const yesCount = yesResult.count ?? 0;
  const maybeCount = maybeResult.count ?? 0;
  const totalCount = yesCount + maybeCount;

  return {
    yes: yesCount,
    maybe: maybeCount,
    total: totalCount,
  } as AttendeeCountType;
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

/**
 * Updates an existing event and its tag assignments
 * @param eventData - The complete event data including id
 * @param tags - Optional array of tags to assign to the event
 * @returns The updated event or null if failed
 */
export async function updateEventWithTags(
  eventData: Tables<"events">,
  tags?: GenericTagType[],
): Promise<Tables<"events"> | null> {
  const { data: event, error: eventError } = await supabase
    .from("events")
    .update({
      title: eventData.title,
      description: eventData.description,
      event_time: eventData.event_time,
    })
    .eq("id", eventData.id)
    .select()
    .single();

  if (eventError) {
    throw eventError;
  }

  if (!event) {
    throw Error("No event found");
  }

  if (tags !== undefined) {
    const { error: deleteError } = await supabase
      .from("event_tag_assignments")
      .delete()
      .eq("event_id", eventData.id);

    if (deleteError) {
      throw deleteError;
    }

    if (tags.length > 0) {
      const tagAssignments = tags.map((tag) => ({
        event_id: eventData.id,
        tag_id: tag.id,
      }));

      const { error: tagError } = await supabase
        .from("event_tag_assignments")
        .insert(tagAssignments);

      if (tagError) {
        throw tagError;
      }
    }
  }

  return event;
}

/* getUserFromEventId
 * params: eventId - an event id to search for
 * returns: the user who created the event, or null if not found
 */
export async function fetchUserFromEventId(
  eventId: number,
): Promise<Tables<"users"> | null> {
  const { data, error } = await supabase
    .from("events")
    .select("creator_id, users:creator_id(*)")
    .eq("id", eventId)
    .single();

  if (error) {
    throw error;
  }

  if (!data?.users) {
    return null;
  }

  return data.users;
}
