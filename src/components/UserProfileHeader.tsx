import { Avatar, Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import type { UserProfileHeaderProps } from "@/types/app.types";

export function UserProfileHeader({ user, tags }: UserProfileHeaderProps) {
  const fullName = `${user.first_name} ${user.last_name}`.trim();
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        backgroundColor: "background.paper",
        boxShadow: 3,
        border: 1,
        borderColor: "divider",
      }}
    >
      {/* Banner */}
      <Box
        sx={{
          height: { xs: 120, sm: 180 },
          backgroundImage: user.banner_photo_path
            ? `url(${user.banner_photo_path})`
            : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          alt: `${fullName}'s banner photo`,
        }}
      />

      {/* Profile Picture */}
      <Avatar
        src={user.profile_photo_path ?? ""}
        alt={fullName}
        sx={{
          width: { xs: 80, sm: 100 },
          height: { xs: 80, sm: 100 },
          fontSize: { xs: "2rem", sm: "2.5rem" },
          position: "absolute",
          top: { xs: 80, sm: 130 },
          left: 20,
          border: "3px solid",
          borderColor: "background.paper",
          boxShadow: 2,
        }}
      >
        {fullName.charAt(0).toUpperCase()}
      </Avatar>

      {/* Content */}
      <Box sx={{ pt: { xs: 6, sm: 7 }, pb: 3, px: 2 }}>
        <Stack spacing={1.5}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              {fullName || "Unnamed User"}
            </Typography>
            <Typography color="text.secondary">{user.email}</Typography>
          </Box>

          <Stack direction="row" flexWrap="wrap" gap={1}>
            {tags.length > 0 ? (
              tags.map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  size="small"
                  color="primary"
                />
              ))
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                fontStyle="italic"
              >
                No tags yet.
              </Typography>
            )}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

export default UserProfileHeader;
