/*
  PeopleFeed.tsx

  Feed that renders a list of people with SmallProfileCard.
*/

import { Box, Typography } from "@mui/material";
import SmallProfileCard from "@/components/SmallProfileCard";
import type { Tables } from "@/types/database.types";

interface PeopleFeedProps {
  users: Tables<"users">[];
  emptyMessage?: string;
  maxWidth?: number | string;
  spacing?: number;
}

export default function PeopleFeed({
  users,
  emptyMessage = "No people found yet.",
  maxWidth = 640,
  spacing = 2,
}: PeopleFeedProps) {
  if (users.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth,
          mx: "auto",
          display: "flex",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth,
        mx: "auto",
        display: "grid",
        gridTemplateColumns: {
          xs: "minmax(0, 1fr)",
          sm: "repeat(2, minmax(0, 1fr))",
        },
        gap: spacing,
      }}
    >
      {users.map((user) => (
        <Box key={user.id} sx={{ width: "100%" }}>
          <SmallProfileCard user={user} />
        </Box>
      ))}
    </Box>
  );
}
