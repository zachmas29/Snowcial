import type { Tables } from "./database.types";

export type CommentAuthor = Pick<
  Tables<"users">,
  "id" | "first_name" | "last_name" | "profile_photo_path"
>;

export type EventCommentWithAuthor = Tables<"event_comments"> & {
  author: CommentAuthor | null;
};

export type CommentNode = EventCommentWithAuthor & {
  children: CommentNode[];
};
