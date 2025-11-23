/*
 * Renders a large event component
 */

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useAuthContext } from "@/hooks/useAuth";
import { formatEventDate } from "@/lib/date_formatters";
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
  const router = useRouter();
  const { user } = useAuthContext();

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 3,
        boxShadow: 2,
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
                <Link
                  href={`/profile/${userData.id}`}
                  underline="none"
                  sx={{ cursor: "pointer" }}
                >
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
                </Link>
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
              {formatEventDate(event_time)}
            </Typography>
          )}

          {tags && tags.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.75,
                mb: 2,
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

          {/* Edit button - only show if current user is the event creator */}
          {user && userData && user.id === userData.id && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={() => router.push(`/events/${router.query.id}/edit`)}
              >
                Edit Event
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
  );
}
