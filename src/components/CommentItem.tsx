import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import type { CommentNode } from "@/types/Comment.types";
import CommentForm from "./CommentForm";

type CommentItemProps = {
  comment: CommentNode;
  depth?: number;
  currentUserId?: string | null;
  onReply: (parentId: number, text: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
};

export default function CommentItem({
  comment,
  depth = 0,
  currentUserId,
  onReply,
  onDelete,
}: CommentItemProps) {
  const isDeleted = comment.is_deleted;
  const [showReply, setShowReply] = useState(false);
  const [replying, setReplying] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const authorName = useMemo(() => {
    if (isDeleted) return "Deleted user";
    if (!comment.author) return "Unknown user";
    return `${comment.author.first_name} ${comment.author.last_name}`.trim();
  }, [comment.author, isDeleted]);

  const createdAtLabel = useMemo(
    () =>
      formatDistanceToNow(new Date(comment.created_at), {
        addSuffix: true,
      }),
    [comment.created_at],
  );

  useEffect(() => {
    if (isDeleted) {
      setShowReply(false);
    }
  }, [isDeleted]);

  const handleReplySubmit = async (text: string) => {
    setReplyError(null);
    setReplying(true);
    try {
      await onReply(comment.id, text);
      setShowReply(false);
    } catch (err) {
      setReplyError(
        err instanceof Error ? err.message : "Failed to post reply",
      );
    } finally {
      setReplying(false);
    }
  };

  const handleDelete = async () => {
    setDeleteError(null);
    setDeleting(true);
    try {
      await onDelete(comment.id);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete comment",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box
      sx={{
        mt: 2,
        pl: depth === 0 ? 0 : 2,
        borderLeft:
          depth === 0
            ? "none"
            : (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Avatar
          src={
            isDeleted
              ? undefined
              : (comment.author?.profile_photo_path ?? undefined)
          }
          alt={authorName}
          sx={{ width: 36, height: 36, mt: 0.5 }}
        >
          {isDeleted
            ? authorName[0]
            : comment.author?.first_name?.[0]?.toUpperCase()}
        </Avatar>
        <Box flex={1}>
          <Stack direction="row" spacing={1} alignItems="baseline">
            <Typography variant="subtitle2">{authorName}</Typography>
            <Typography variant="caption" color="text.secondary">
              {createdAtLabel}
            </Typography>
          </Stack>
          {isDeleted ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, fontStyle: "italic" }}
            >
              This comment was deleted.
            </Typography>
          ) : (
            <Typography
              variant="body2"
              sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", mt: 0.5 }}
            >
              {comment.comment_text}
            </Typography>
          )}
          {!isDeleted && (
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button
                size="small"
                startIcon={<ChatBubbleOutlineIcon fontSize="small" />}
                onClick={() => setShowReply((prev) => !prev)}
              >
                Reply
              </Button>
              {currentUserId === comment.creator_id && (
                <Button
                  size="small"
                  color="error"
                  disabled={deleting}
                  onClick={handleDelete}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              )}
            </Stack>
          )}
          {replyError && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
              {replyError}
            </Typography>
          )}
          {deleteError && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
              {deleteError}
            </Typography>
          )}
          {showReply && !isDeleted && (
            <Box sx={{ mt: 1.5 }}>
              <CommentForm
                onSubmit={handleReplySubmit}
                submitting={replying}
                autoFocus
                placeholder="Write a reply..."
              />
            </Box>
          )}
          {comment.children.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              depth={depth + 1}
              currentUserId={currentUserId}
              onReply={onReply}
              onDelete={onDelete}
            />
          ))}
        </Box>
      </Stack>
    </Box>
  );
}
