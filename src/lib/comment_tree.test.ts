/** biome-ignore-all lint/style/useNamingConvention: <supabase format> */
import { describe, expect, it } from "vitest";
import type { EventCommentWithAuthor } from "@/types/Comment.types";
import { buildCommentTree } from "./comment_tree";

describe("buildCommentTree", () => {
  const baseComment = (
    overrides: Partial<EventCommentWithAuthor>,
  ): EventCommentWithAuthor => ({
    id: 0,
    event_id: 1,
    parent_comment_id: null,
    creator_id: "user-1",
    created_at: "2025-01-01T00:00:00.000Z",
    comment_text: "comment",
    is_deleted: false,
    author: null,
    ...overrides,
  });

  it("nests replies under their parents and keeps chronological order", () => {
    const comments: EventCommentWithAuthor[] = [
      baseComment({
        id: 1,
        comment_text: "Root A",
        created_at: "2025-01-01T10:00:00.000Z",
      }),
      baseComment({
        id: 2,
        comment_text: "Reply to Root A",
        parent_comment_id: 1,
        created_at: "2025-01-01T10:05:00.000Z",
      }),
      baseComment({
        id: 3,
        comment_text: "Second reply to Root A",
        parent_comment_id: 1,
        created_at: "2025-01-01T10:07:00.000Z",
      }),
      baseComment({
        id: 4,
        comment_text: "Nested reply",
        parent_comment_id: 2,
        created_at: "2025-01-01T10:06:00.000Z",
      }),
      baseComment({
        id: 5,
        comment_text: "Root B",
        created_at: "2025-01-01T11:00:00.000Z",
      }),
      baseComment({
        id: 6,
        comment_text: "Orphaned reply becomes root",
        parent_comment_id: 999,
        created_at: "2025-01-01T12:00:00.000Z",
      }),
    ];

    const tree = buildCommentTree(comments);

    expect(tree.map((node) => node.id)).toEqual([1, 5, 6]);
    expect(tree[0].children.map((node) => node.id)).toEqual([2, 3]);
    expect(tree[0].children[0].children.map((node) => node.id)).toEqual([4]);
  });
});
