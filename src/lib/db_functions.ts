/** biome-ignore-all lint/style/useNamingConvention: <Using snake_case to make Supabase happy> */

import { getPublicUrl } from "@/lib/getPublicURL";
import { supabase } from "@/lib/supabase_client";
import type { AttendeeCountType } from "@/types/AttendeeCountType.type";
import type { UserProfileData } from "@/types/app.types";
import type { EventCommentWithAuthor } from "@/types/Comment.types";
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

  return rows.map(({ userTagAssignments, ...user }) => {
    let profile_photo_path = user.profile_photo_path;
    let banner_photo_path = user.banner_photo_path;

    if (profile_photo_path && !profile_photo_path.startsWith("http")) {
      profile_photo_path = getPublicUrl("profile-photos", profile_photo_path);
    }

    if (banner_photo_path && !banner_photo_path.startsWith("http")) {
      banner_photo_path = getPublicUrl("banner-photos", banner_photo_path);
    }

    return {
      ...user,
      profile_photo_path,
      banner_photo_path,
      tags:
        userTagAssignments
          ?.map((assignment) => assignment.userTags)
          .filter((tag): tag is Tables<"user_tags"> => tag !== null) ?? [],
    };
  });
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
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("event_time", oneDayAgo.toISOString());

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

/* deleteEvent
 * params: id - the event id to delete
 * returns: void - throws error if deletion fails
 */
export async function deleteEvent(id: number): Promise<void> {
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

/* getAttendeeCount
 * params: id - the event id to search for
 * returns: an object of type AttendeeCountType
 */
export async function getAttendeeCount(eventId: number) {
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("capacity")
    .eq("id", eventId)
    .single();

  if (eventError) {
    throw eventError;
  }

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
  const capacity = event?.capacity ?? null;

  let waitlistCount = 0;
  if (capacity !== null) {
    waitlistCount = Math.max(0, yesCount - capacity);
  }

  return {
    yes: yesCount,
    maybe: maybeCount,
    total: totalCount,
    capacity,
    waitlistCount,
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
): Promise<EventCommentWithAuthor[]> {
  const { data, error } = await supabase
    .from("event_comments")
    .select(
      `
        id,
        event_id,
        parent_comment_id,
        created_at,
        creator_id,
        comment_text,
        is_deleted,
        author:users (
          id,
          first_name,
          last_name,
          profile_photo_path
        )
      `,
    )
    .eq("event_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as EventCommentWithAuthor[];
}

interface CreateEventCommentInput {
  eventId: number;
  commentText: string;
  parentCommentId?: number | null;
}

export async function createEventComment(
  input: CreateEventCommentInput,
): Promise<EventCommentWithAuthor> {
  const { eventId, commentText, parentCommentId = null } = input;
  const trimmed = commentText.trim();

  if (!trimmed) {
    throw new Error("Comment cannot be empty");
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw authError || new Error("No authenticated user");
  }

  const { data, error } = await supabase
    .from("event_comments")
    .insert({
      comment_text: trimmed,
      event_id: eventId,
      creator_id: user.id,
      parent_comment_id: parentCommentId,
    })
    .select(
      `
        id,
        event_id,
        parent_comment_id,
        created_at,
        creator_id,
        comment_text,
        is_deleted,
        author:users (
          id,
          first_name,
          last_name,
          profile_photo_path
        )
      `,
    )
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Failed to create comment");
  }

  return data as EventCommentWithAuthor;
}

export async function deleteEventComment(
  commentId: number,
): Promise<EventCommentWithAuthor> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw authError || new Error("No authenticated user");
  }

  const { data, error } = await supabase
    .from("event_comments")
    .update({
      comment_text: "[deleted]",
      is_deleted: true,
    })
    .eq("id", commentId)
    .eq("creator_id", user.id)
    .select(
      `
        id,
        event_id,
        parent_comment_id,
        created_at,
        creator_id,
        comment_text,
        is_deleted,
        author:users (
          id,
          first_name,
          last_name,
          profile_photo_path
        )
      `,
    )
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Failed to delete comment");
  }

  return data as EventCommentWithAuthor;
}

/* fetchEventTagOptions
 * returns: A list of all possible event tags
 */
export async function fetchEventTagOptions(): Promise<Tables<"event_tags">[]> {
  const { data, error } = await supabase.from("event_tags").select("*");

  if (error) {
    throw error;
  }

  return data ?? [];
}

/* fetchUserTagOptions
 * returns: A list of all possible user tags
 */
export async function fetchUserTagOptions(): Promise<Tables<"user_tags">[]> {
  const { data, error } = await supabase.from("user_tags").select("*");

  if (error) {
    throw error;
  }

  return data ?? [];
}

/* insertEventWithTags
 * Inserts a new event and its tag assignments
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
      capacity: eventFormData.capacity ?? null,
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

/* updateEventWithTags
 * Updates an existing event and its tag assignments
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
      capacity: eventData.capacity,
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

/* fetchEventRSVPs
 * params: eventId - an event id to search for
 * returns: array of RSVPs with user information, ordered by created_at
 */
export async function fetchEventRSVPs(eventId: number) {
  const { data, error } = await supabase
    .from("event_rsvps")
    .select(
      `
      user_id,
      status,
      created_at,
      users:user_id (first_name, last_name, profile_photo_path)
    `,
    )
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/* upsertRSVP
 * params: eventId, userId, status - "yes" or "maybe"
 * returns: void - throws error if fails
 */
export async function upsertRSVP(
  eventId: number,
  userId: string,
  status: "yes" | "maybe",
) {
  const { data: existing } = await supabase
    .from("event_rsvps")
    .select("created_at, status")
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    const updatePayload =
      existing.status === status
        ? { status }
        : { status, created_at: new Date().toISOString() };

    const { error } = await supabase
      .from("event_rsvps")
      .update(updatePayload)
      .eq("event_id", eventId)
      .eq("user_id", userId);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("event_rsvps")
      .insert({ event_id: eventId, user_id: userId, status });

    if (error) throw error;
  }
}

/* deleteRSVP
 * params: eventId, userId
 * returns: void - throws error if fails
 */
export async function deleteRSVP(eventId: number, userId: string) {
  const { error } = await supabase
    .from("event_rsvps")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}

/* getCurrentUserRSVP
 * params: eventId - the event id
 * returns: the current user's RSVP status or null
 */
export async function getCurrentUserRSVP(eventId: number) {
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return null;
  }

  const { data, error } = await supabase
    .from("event_rsvps")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", authUser.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

/* clearUserTagAssignments
 * params: user id to clear tag assignments
 */
export async function clearUserTagAssignments(user_id: string) {
  const { error } = await supabase
    .from("user_tag_assignments")
    .delete()
    .eq("user_id", user_id);

  if (error) {
    throw error;
  }
}

/* updateUserTagAssignments
 * params: user id to assign tags to
 */
export async function updateUserTagAssignments(
  user_id: string,
  tagIds: number[],
) {
  await clearUserTagAssignments(user_id);

  if (tagIds.length > 0) {
    const rows = tagIds.map((tag_id) => ({ user_id, tag_id }));

    const { error } = await supabase.from("user_tag_assignments").insert(rows);

    if (error) {
      throw error;
    }
  }
}

/*
 * Updates the database row for the currently authenticated user.
 */
export async function updateCurrentUserProfile(
  updates: Partial<Tables<"users">> & { id: string },
) {
  const { id: userId, ...updateData } = updates;

  if (!userId) {
    throw new Error("Missing user id");
  }

  const result = await supabase
    .from("users")
    .update(updateData)
    .eq("id", userId)
    .select()
    .maybeSingle();

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

/**
 * Deletes a gallery photo database record.
 * Note: gallery_photos has composite primary key (user_id, photo_path).
 * This does not delete the underlying storage object; we keep
 * storage insert-only and accept possible orphaned files.
 */
export async function deleteGalleryPhoto(userId: string, photoPath: string) {
  const { error: dbError } = await supabase
    .from("gallery_photos")
    .delete()
    .eq("user_id", userId)
    .eq("photo_path", photoPath);

  if (dbError) {
    throw dbError;
  }
}
