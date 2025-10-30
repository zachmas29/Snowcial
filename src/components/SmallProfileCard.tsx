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
        src={user.profile_photo_path ?? ""}
        alt={`${user.first_name} ${user.last_name}`}
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
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {user.bio_text}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
