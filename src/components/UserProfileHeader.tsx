/*
  UserProfileHeader.tsx

  Displays a user's avatar, name, email, and associated tags.
*/

import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import type { UserProfileHeaderProps } from "@/types/app.types";

export function UserProfileHeader({ user, tags }: UserProfileHeaderProps) {
  const fullName = `${user.first_name} ${user.last_name}`.trim();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "center", sm: "flex-start" },
        gap: { xs: 1.5, sm: 3 },
        p: { xs: 1.5, sm: 0 },
      }}
    >
      <Avatar
        src={user.profile_photo_path ?? ""}
        alt={fullName}
        sx={{
          width: { xs: 64, sm: 120 },
          height: { xs: 64, sm: 120 },
          fontSize: { xs: 24, sm: 36 },
        }}
      >
        {fullName.charAt(0).toUpperCase()}
      </Avatar>

      <Stack spacing={{ xs: 0.75, sm: 1 }} sx={{ flex: 1, width: "100%" }}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight={700}
            sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" } }}
          >
            {fullName || "Unnamed User"}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
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
            gap: { xs: 0.75, sm: 1 },
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
                sx={{
                  height: { xs: 22, sm: 24 },
                  fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                }}
              />
            ))
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              No tags yet.
            </Typography>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

export default UserProfileHeader;
