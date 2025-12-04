/*
 * Renders a large event component
 */

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { AddToCalendarButton } from "add-to-calendar-button-react";
import { useRouter } from "next/router";
import { useAuthContext } from "@/hooks/useAuth";
import { formatEventDate } from "@/lib/date_formatters";
import type { Tables } from "@/types/database.types";
import type { EventFormData } from "@/types/EventCreator.types";
import UserAvatar from "./UserAvatar";

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
  const { mode } = useColorScheme();

  const calendarProps = (() => {
    if (!event_time) return null;

    const start = event_time;
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour length

    const pad = (value: number) => value.toString().padStart(2, "0");
    const formatDate = (date: Date) =>
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const formatTime = (date: Date) =>
      `${pad(date.getHours())}:${pad(date.getMinutes())}`;

    return {
      startDate: formatDate(start),
      startTime: formatTime(start),
      endDate: formatDate(end),
      endTime: formatTime(end),
    };
  })();

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 3,
        boxShadow: 3,
        border: 1,
        borderColor: "divider",
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
              <UserAvatar
                user={userData}
                sx={{
                  width: 48,
                  height: 48,
                  fontSize: 18,
                }}
              />
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

        {/* Bottom action buttons: Add to Calendar + Edit Event */}
        {(calendarProps || (user && userData && user.id === userData.id)) && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              {user && userData && user.id === userData.id && (
                <Button
                  variant="outlined"
                  onClick={() => router.push(`/events/${router.query.id}/edit`)}
                >
                  Edit Event
                </Button>
              )}
              {!user || !userData || (user.id !== userData.id && <Box />)}
              {calendarProps && (
                <AddToCalendarButton
                  name={title}
                  description={description}
                  options={["Google", "Apple", "Microsoft365", "iCal"]}
                  timeZone="America/New_York"
                  forceOverlay
                  listStyle="dropdown"
                  hideBranding
                  hideCheckmark
                  lightMode={mode === "dark" ? "dark" : "light"}
                  {...calendarProps}
                ></AddToCalendarButton>
              )}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
