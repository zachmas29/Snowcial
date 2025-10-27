import { supabase } from "@/lib/supabase_client";
import type {
  Event,
  EventComment,
  EventTag,
  User,
  UserTag,
} from "@/types/db_types";

/*

Test function to see if your supabase is working:

useEffect(() => {
  const fetchData = async () => {
    console.log("Users:", await fetchUsers());
    console.log("User #3:", await fetchUser(3));
    console.log("User #3 Tags:", await fetchUserTags(3));
    console.log("Events:", await fetchEvents());
    console.log("Event #1:", await fetchEvent(1));
    console.log("Event #1 Tags:", await fetchEventTags(1));
    console.log("Event #1 Comments:", await fetchEventComments(1));
  };

  fetchData();
}, []);

Put this before the return statement in any page index.tsx .

Add these import statements:

import {
  fetchUsers,
  fetchUser,
  fetchUserTags,
  fetchEvents,
  fetchEvent,
  fetchEventTags,
  fetchEventComments,
} from "@/lib/db_functions";

and refresh the page to see if it works.

*/

/* fetchUsers
 * returns: array of all Users in the DB
 */
export async function fetchUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, created_at, last_updated, last_active, first_name, last_name, email, nick_name, bio_text, profile_photo_path, banner_photo_path",
    );

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  return data.map((d) => ({
    id: d.id,
    lastUpdated: d.last_updated,
    lastActive: d.last_active,
    firstName: d.first_name,
    lastName: d.last_name,
    email: d.email,
    nickname: d.nick_name,
    bioText: d.bio_text,
    profilePhotoPath: d.profile_photo_path,
    bannerPhotoPath: d.banner_photo_path,
  }));
}

/* fetchUser
 * params: id - a user id to search for
 * returns: the User object associated with the given id
 */
export async function fetchUser(id: number): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, created_at, last_updated, last_active, first_name, last_name, email, nick_name, bio_text, profile_photo_path, banner_photo_path",
    )
    .eq("id", id)
    .limit(1);

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return null;
  }

  const d = data[0];
  return {
    id: d.id,
    lastUpdated: d.last_updated,
    lastActive: d.last_active,
    firstName: d.first_name,
    lastName: d.last_name,
    email: d.email,
    nickname: d.nick_name,
    bioText: d.bio_text,
    profilePhotoPath: d.profile_photo_path,
    bannerPhotoPath: d.banner_photo_path,
  };
}

/* fetchUserTags
 * params: id - a user id to search for
 * returns: the UserTags object associated with the given id
 */
export async function fetchUserTags(id: number): Promise<UserTag[]> {
  const { data, error } = await supabase
    .from("user_tag_assignments")
    .select("user_tags(id, name)")
    .eq("user_id", id);

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  /* this typing is not amazing in the sense it's not directly mapping
     the db column to a new typed column, typescript won't let me do that
     because it thinks user_tags is an array even though its a json object
     please let me know if y'all come up with any for this -- same thing in
     fetchEventTags as well 
  */
  const userTags: UserTag[] = data
    // biome-ignore lint/style/useNamingConvention: <DB column uses snake_case>
    .flatMap((item: { user_tags: UserTag[] }) => item.user_tags || []);

  return userTags;
}

/* fetchEvents
 * returns: array of all Events in the DB
 */
export async function fetchEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, creator_id, created_at, last_updated, event_time, title, description",
    );

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  return data.map((d) => ({
    id: d.id,
    creatorId: d.creator_id,
    createdAt: d.created_at,
    lastUpdated: d.last_updated,
    eventTime: d.event_time,
    title: d.title,
    description: d.description,
  }));
}

/* fetchEvent
 * params: id - an event id to search for
 * returns: the Event object associated with the given id
 */
export async function fetchEvent(id: number): Promise<Event | null> {
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, creator_id, created_at, last_updated, event_time, title, description",
    )
    .eq("id", id)
    .limit(1);

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return null;
  }

  const d = data[0];
  return {
    id: d.id,
    creatorId: d.creator_id,
    createdAt: d.created_at,
    lastUpdated: d.last_updated,
    eventTime: d.event_time,
    title: d.title,
    description: d.description,
  };
}

/* fetchEventTags
 * params: id - an event id to search for
 * returns: an array of EventTags associated with the given id
 */
export async function fetchEventTags(id: number): Promise<EventTag[]> {
  const { data, error } = await supabase
    .from("event_tag_assignments")
    .select("event_tags(id, name)")
    .eq("event_id", id);

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  const eventTags: EventTag[] = data
    // biome-ignore lint/style/useNamingConvention: <DB column uses snake_case>
    .flatMap((item: { event_tags: EventTag[] }) => item.event_tags || []);

  return eventTags;
}

/* fetchEventComments
 * params: id - an event id to search for
 * returns: the EventComments object associated with the given id
 */
export async function fetchEventComments(id: number): Promise<EventComment[]> {
  const { data, error } = await supabase
    .from("event_comments")
    .select("id, creator_id, event_id, created_at, comment_text")
    .eq("event_id", id);

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  return data.map((d) => ({
    id: d.id,
    creatorId: d.creator_id,
    eventId: d.event_id,
    createdAt: d.created_at,
    commentText: d.comment_text,
  }));
}
