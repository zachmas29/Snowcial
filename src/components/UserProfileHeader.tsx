/*
  UserProfileHeader.tsx

  Displays a user's avatar, name, email, and associated tags.
*/

import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import type { Tables } from "@/types/database.types";

export interface UserProfileHeaderProps {
  user: Tables<"users">;
  tags: Tables<"user_tags">[];
}

export function UserProfileHeader({ user, tags }: UserProfileHeaderProps) {
  const fullName = `${user.first_name} ${user.last_name}`.trim();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "center", sm: "flex-start" },
        gap: { xs: 2, sm: 3 },
      }}
    >
      <Avatar
        src={user.profile_photo_path ?? ""}
        alt={fullName}
        sx={{
          width: { xs: 96, sm: 120 },
          height: { xs: 96, sm: 120 },
          fontSize: 36,
        }}
      >
        {fullName.charAt(0).toUpperCase()}
      </Avatar>

      <Stack spacing={1} sx={{ flex: 1, width: "100%" }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            {fullName || "Unnamed User"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user.email}
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          sx={{
            width: "100%",
          }}
        >
          {tags.length > 0 ? (
            tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No tags yet.
            </Typography>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

export default UserProfileHeader;
