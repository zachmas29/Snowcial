/*
  SmallProfileCard.tsx

  This component displays a user profile as a small card
  for the profiles feed
*/

import { Avatar, Card, CardContent, Typography } from "@mui/material";
import type { Props } from "@/types/SmallProfileCard";

export default function SmallProfileCard({ user }: Props) {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        width: 280,
        borderRadius: 3,
        boxShadow: 2,
      }}
    >
      <Avatar
        src={user.profile_photo_path ?? ""}
        alt={`${user.first_name} ${user.last_name}`}
        sx={{ width: 64, height: 64, mr: 2 }}
      />
      <CardContent sx={{ flex: 1, p: 0 }}>
        <Typography variant="h6" fontWeight="bold">
          {user.first_name} {user.last_name}
        </Typography>

        {user.nick_name && (
          <Typography variant="subtitle2" color="text.secondary">
            @{user.nick_name}
          </Typography>
        )}

        {user.bio_text && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user.bio_text}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
