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
        src={user.profilePhotoPath}
        alt={`${user.firstName} ${user.lastName}`}
        sx={{ width: 64, height: 64, mr: 2 }}
      />
      <CardContent sx={{ flex: 1, p: 0 }}>
        <Typography variant="h6" fontWeight="bold">
          {user.firstName} {user.lastName}
        </Typography>

        {user.nickname && (
          <Typography variant="subtitle2" color="text.secondary">
            @{user.nickname}
          </Typography>
        )}

        {user.bioText && (
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
            {user.bioText}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
