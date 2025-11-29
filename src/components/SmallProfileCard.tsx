/*
  SmallProfileCard.tsx

  Compact profile tile used in the people feed. Displays avatar, name, and bio,
  then renders any tag chips passed in alongside the user data.
*/

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import type { SmallProfileCardProps } from "@/types/app.types";
import UserAvatar from "./UserAvatar";

export default function SmallProfileCard({ user }: SmallProfileCardProps) {
  const { id, first_name, last_name, nick_name, bio_text, tags } = user;

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: 360 },
        borderRadius: 3,
        boxShadow: 2,
      }}
    >
      <CardActionArea
        component={Link}
        href={`/profile/${id}`}
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          p: { xs: 1.5, sm: 2 },
          gap: { xs: 1.5, sm: 0 },
        }}
      >
        <UserAvatar
          user={user}
          shouldLink={false}
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

          {nick_name && (
            <Typography variant="subtitle2" color="text.secondary">
              @{nick_name}
            </Typography>
          )}

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
      </CardActionArea>
    </Card>
  );
}
