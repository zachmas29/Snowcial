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

  // Auto-refresh comments every 5 seconds
  useEffect(() => {
    if (Number.isNaN(eventId) || loading) {
      return;
    }

    const interval = setInterval(async () => {
      const freshComments = await fetchEventComments(eventId);
      setComments(freshComments);
    }, 5000);

    return () => clearInterval(interval);
  }, [eventId, loading]);

  const handleAddComment = async (
    text: string,
    parentCommentId: number | null = null,
  ) => {
    setSubmitting(true);
    if (parentCommentId === null) {
      setError(null);
    }
    try {
      const created = await createEventComment({
        eventId,
        commentText: text,
        parentCommentId,
      });
      setComments((prev) => [...prev, created]);
      return created;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to post comment";
      // Only set the global error for top-level comment submissions
      if (parentCommentId === null) {
        setError(message);
      }
      throw err instanceof Error ? err : new Error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    setError(null);
    try {
      const updated = await deleteEventComment(commentId);
      setComments((prev) =>
        prev.map((comment) => (comment.id === commentId ? updated : comment)),
      );
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
                  onReply={async (parentId, text) => {
                    await handleAddComment(text, parentId);
                  }}
                  onDelete={handleDelete}
                />
              ))
            )}
            <Box sx={{ mt: 2 }}>
              <CommentForm
                onSubmit={async (text) => {
                  try {
                    await handleAddComment(text, null);
                  } catch {
                    // Error is handled in handleAddComment
                  }
                }}
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
