import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "@/hooks/useAuth";
import { buildCommentTree } from "@/lib/comment_tree";
import {
  createEventComment,
  deleteEventComment,
  fetchEventComments,
} from "@/lib/db_functions";
import type {
  CommentNode,
  EventCommentWithAuthor,
} from "@/types/Comment.types";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

type CommentThreadProps = {
  eventId: number;
};

export default function CommentThread({ eventId }: CommentThreadProps) {
  const { user } = useAuthContext();
  const [comments, setComments] = useState<EventCommentWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (Number.isNaN(eventId)) {
      return;
    }
    setLoading(true);
    setError(null);
    fetchEventComments(eventId)
      .then((data) => setComments(data))
      .catch(() => setError("Unable to load comments"))
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleAddComment = async (
    text: string,
    parentCommentId: number | null = null,
  ) => {
    setSubmitting(true);
    setError(null);
    try {
      const created = await createEventComment({
        eventId,
        commentText: text,
        parentCommentId,
      });
      setComments((prev) => [...prev, created]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    setError(null);
    try {
      await deleteEventComment(commentId);
      setComments((prev) => {
        const toRemove = new Set<number>([commentId]);
        let expanded = true;

        while (expanded) {
          expanded = false;
          prev.forEach((comment) => {
            if (
              comment.parent_comment_id &&
              toRemove.has(comment.parent_comment_id) &&
              !toRemove.has(comment.id)
            ) {
              toRemove.add(comment.id);
              expanded = true;
            }
          });
        }

        return prev.filter((comment) => !toRemove.has(comment.id));
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete comment");
    }
  };

  const tree: CommentNode[] = useMemo(
    () => buildCommentTree(comments),
    [comments],
  );

  return (
    <Paper
      elevation={1}
      sx={{
        width: "100%",
        maxWidth: 640,
        mx: "auto",
        mt: 4,
        p: 3,
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6">Comments</Typography>
        <Divider />
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {loading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {tree.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Be the first to comment.
              </Typography>
            ) : (
              tree.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUserId={user?.id ?? null}
                  onReply={(parentId, text) => handleAddComment(text, parentId)}
                  onDelete={handleDelete}
                />
              ))
            )}
            <Box sx={{ mt: 2 }}>
              <CommentForm
                onSubmit={(text) => handleAddComment(text, null)}
                submitting={submitting}
                placeholder="Add a comment..."
              />
            </Box>
          </>
        )}
      </Stack>
    </Paper>
  );
}
