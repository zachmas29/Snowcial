import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

interface CommentFormProps {
  onSubmit: (text: string) => Promise<void> | void;
  submitting?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}

const MAX_LENGTH = 500;

export default function CommentForm({
  onSubmit,
  submitting = false,
  autoFocus = false,
  placeholder = "Add a comment...",
}: CommentFormProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Comment cannot be empty");
      return;
    }
    setError(null);
    await onSubmit(trimmed);
    setText("");
  };

  const remaining = MAX_LENGTH - text.length;

  return (
    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <Stack spacing={1}>
        <TextField
          value={text}
          onChange={(event) => {
            if (event.target.value.length <= MAX_LENGTH) {
              setText(event.target.value);
            }
          }}
          autoFocus={autoFocus}
          placeholder={placeholder}
          multiline
          minRows={2}
          maxRows={4}
          error={Boolean(error)}
          helperText={error}
          disabled={submitting}
        />
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          <Typography
            variant="caption"
            color={remaining < 20 ? "error.main" : "text.secondary"}
            sx={{ mr: 1 }}
          >
            {text.length}/{MAX_LENGTH}
          </Typography>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            size="small"
          >
            {submitting ? "Posting..." : "Post"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
