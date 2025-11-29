/*
  PeopleFeed.tsx

  Feed that renders a list of people with SmallProfileCard.
*/

import { Box, Typography } from "@mui/material";
import SmallProfileCard from "@/components/SmallProfileCard";
import type { PeopleFeedProps } from "@/types/app.types";

export default function PeopleFeed({
  users,
  emptyMessage = "No people found.",
  spacing = 2,
  searchTerm,
  sortType,
  selectedTags,
}: PeopleFeedProps) {
  let displayedUsers = [...users];

  // Filter by search term
  displayedUsers = displayedUsers.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (selectedTags.length > 0) {
    displayedUsers = displayedUsers.filter((user) => {
      return selectedTags.every((selectedTag) =>
        user.tags.some((userTag) => userTag.id === selectedTag.id),
      );
    });
  }

  // Sort by sort term
  displayedUsers = displayedUsers.sort((a, b) => {
    switch (sortType) {
      case "alphabetical": {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return nameA.localeCompare(nameB);
      }
      case "last-active":
        return (
          new Date(b.last_active).getTime() - new Date(a.last_active).getTime()
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
          display: "flex",
          justifyContent: "center",
          py: (theme) => theme.spacing(4),
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
