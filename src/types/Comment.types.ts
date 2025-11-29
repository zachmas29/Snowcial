import type { Tables } from "./database.types";

export type EventCommentWithAuthor = Tables<"event_comments"> & {
  author: Tables<"users"> | undefined;
};

export type CommentNode = EventCommentWithAuthor & {
  children: CommentNode[];
};
