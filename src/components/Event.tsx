/*
 * Renders a large event component
 */

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import type { Tables } from "@/types/database.types";
import type { EventFormData } from "@/types/EventCreator.types";

/*

export interface EventFormData {
  title: string;
  description: string;
  // biome-ignore lint/style/useNamingConvention: <Supabase wants snake_case>
  event_time: Date | null;
  tags: GenericTagType[];
}

*/

// will need to ensure all event data uses same type eventually
interface EventProps {
  eventData: EventFormData;
  userData: Tables<"users"> | null;
}

export default function Event({ eventData, userData }: EventProps) {
  const { title, description, event_time, tags } = eventData;

  return (
    <Box
      sx={{
        width: "100%",
        mt: "10%", // 10% margin from top
        px: 2,
      }}
    >
      {/* Event Card */}
      <Card
        sx={{
          width: "100%",
          maxWidth: 640,
          borderRadius: 3,
          boxShadow: 2,
          mx: "auto",
        }}
      >
        <CardContent
          sx={{
            p: 3,
          }}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
            {title}
          </Typography>

          {/* User Display */}
          {userData && (
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={userData.profile_photo_path ?? ""}
                  alt={`${userData.first_name} ${userData.last_name}`}
                  sx={{
                    width: 48,
                    height: 48,
                    fontSize: 18,
                  }}
                >
                  {userData.first_name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {userData.first_name} {userData.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Event Creator
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}

          {description && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 2,
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              {description}
            </Typography>
          )}

          {event_time && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {new Date(event_time).toLocaleString()}
            </Typography>
          )}

          {tags && tags.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.75,
              }}
            >
              {tags.map((tag, index) => (
                <Chip
                  key={tag.id || index}
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
    </Box>
  );
}
