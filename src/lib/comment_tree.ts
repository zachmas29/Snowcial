import type {
  CommentNode,
  EventCommentWithAuthor,
} from "@/types/Comment.types";

export function buildCommentTree(
  comments: EventCommentWithAuthor[],
): CommentNode[] {
  const nodes = new Map<number, CommentNode>();
  const roots: CommentNode[] = [];

  comments.forEach((comment) => {
    nodes.set(comment.id, { ...comment, children: [] });
  });

  comments.forEach((comment) => {
    const node = nodes.get(comment.id);
    if (!node) {
      return;
    }
    if (comment.parent_comment_id && nodes.has(comment.parent_comment_id)) {
      const parent = nodes.get(comment.parent_comment_id);
      parent?.children.push(node);
    } else {
      roots.push(node);
    }
  });

  // Preserve chronological ordering among siblings based on created_at
  const sortChronologically = (list: CommentNode[]) => {
    list.sort((a, b) => a.created_at.localeCompare(b.created_at));
    list.forEach((child) => {
      sortChronologically(child.children);
    });
  };

  sortChronologically(roots);

  return roots;
}
