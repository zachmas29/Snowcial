/*
  PeopleFeed.tsx

  Feed that renders a list of people with SmallProfileCard.
*/

import { Box, Typography } from "@mui/material";
import SmallProfileCard from "@/components/SmallProfileCard";
import type { Tables } from "@/types/database.types";
import type { SortType } from "@/types/Sort.types";

interface PeopleFeedProps {
  users: Tables<"users">[];
  emptyMessage?: string;
  maxWidth?: number | string;
  spacing?: number;
  searchTerm: string;
  sortType: SortType;
}

export default function PeopleFeed({
  users,
  emptyMessage = "No people found.",
  maxWidth = 640,
  spacing = 2,
  searchTerm,
  sortType,
}: PeopleFeedProps) {
  let displayedUsers = [...users];

  // Filter by search term
  displayedUsers = displayedUsers.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // Sort by sort term
  displayedUsers = displayedUsers.sort((a, b) => {
    switch (sortType) {
      case "alphabetical": {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return nameA.localeCompare(nameB);
      }
      case "newest":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "oldest":
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      default:
        return 0;
    }
  });

  if (displayedUsers.length === 0) {
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
      {displayedUsers.map((user) => (
        <Box key={user.id} sx={{ width: "100%" }}>
          <SmallProfileCard user={user} />
        </Box>
      ))}
    </Box>
  );
}
