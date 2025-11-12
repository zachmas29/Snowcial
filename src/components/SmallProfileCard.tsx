/*
  SmallProfileCard.tsx

  Compact profile tile used in the people feed. Displays avatar, name, and bio,
  then renders any tag chips passed in alongside the user data.
*/

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import type { UserWithTags } from "@/types/User";

interface SmallProfileCardProps {
  user: UserWithTags;
}

export default function SmallProfileCard({ user }: SmallProfileCardProps) {
  const { tags, profile_photo_path, first_name, last_name, bio_text } = user;
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
        flexDirection: { xs: "column", sm: "row" },
        p: { xs: 1.5, sm: 2 },
        width: "100%",
        maxWidth: { xs: "100%", sm: 360 },
        borderRadius: 3,
        boxShadow: 2,
        gap: { xs: 1.5, sm: 0 },
      }}
    >
      <Avatar
        src={profile_photo_path ?? ""}
        alt={`${first_name} ${last_name}`}
        sx={{
          width: { xs: 56, sm: 64 },
          height: { xs: 56, sm: 64 },
          mr: { sm: 2 },
        }}
      />
      <CardContent
        sx={{
          flex: 1,
          p: 0,
          minWidth: 0,
          width: "100%",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {first_name} {last_name}
        </Typography>

        {bio_text && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {bio_text}
          </Typography>
        )}

        {tags && tags.length > 0 && (
          <Box
            sx={{
              mt: 1,
              display: "flex",
              flexWrap: "wrap",
              gap: 0.75,
            }}
          >
            {tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                variant="outlined"
                sx={{
                  height: 22,
                  fontSize: "0.75rem",
                  px: 0.75,
                }}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
