import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import UserAvatar from "@/components/UserAvatar";

import { formatEventDate } from "@/lib/date_formatters";
import type { AttendeeCountType } from "@/types/AttendeeCountType.type";
import type { Tables } from "@/types/database.types";

type EventCardProps = {
  event: Tables<"events">;
  eventTags: Tables<"event_tags">[];
  user: Tables<"users"> | undefined;
  attendingCount?: AttendeeCountType;
  loading?: boolean;
  handleEventClick: (eventId: number) => void;
};

export default function SmallEventCard({
  event,
  eventTags,
  user,
  attendingCount,
  loading = false,
  handleEventClick,
}: EventCardProps) {
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={200}
      >
        <CircularProgress />
      </Box>
    );
  }

  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`
    : event.title?.slice(0, 2).toUpperCase();

  const attendees =
    attendingCount &&
    attendingCount.yes > 0 &&
    attendingCount.yes !== attendingCount.total
      ? `${attendingCount.yes}-${attendingCount.total}`
      : `${attendingCount?.total ?? 0}`;

  const capacityText = attendingCount?.capacity
    ? ` / ${attendingCount.capacity}`
    : "";

  const waitlistText =
    attendingCount?.waitlistCount && attendingCount.waitlistCount > 0
      ? ` (${attendingCount.waitlistCount} waitlisted)`
      : "";

  const attendeesNotice = `${attendees}${capacityText} ${attendingCount?.total !== 1 ? "people" : "person"}${waitlistText}`;

  // Truncate description to 50 words
  const truncateDescription = (text: string, wordLimit: number = 50) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return text;
    return `${words.slice(0, wordLimit).join(" ")}...`;
  };
  return (
    <Card
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 2,
        boxShadow: 2,
        border: 1,
        borderColor: "divider",
      }}
    >
      <CardActionArea
        onClick={() => handleEventClick(event.id)}
        sx={{ height: "100%" }}
      >
        <CardHeader
          avatar={
            user ? (
              <Box
                component={NextLink}
                href={`/profile/${user.id}`}
                sx={{ textDecoration: "none" }}
              >
                <UserAvatar
                  user={user}
                  fallbackInitials={initials}
                  shouldLink={false}
                />
              </Box>
            ) : (
              <UserAvatar
                user={user}
                fallbackInitials={initials}
                shouldLink={false}
              />
            )
          }
          title={
            <Typography variant="h6" fontWeight="bold">
              {event.title}
            </Typography>
          }
          subheader={`${user ? `${user.first_name} ${user.last_name}` : "Event"} • ${formatEventDate(event.event_time)}`}
        />
        <CardContent
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {event.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                // biome-ignore lint/style/useNamingConvention: necessary for React inline styles
                WebkitLineClamp: 3,
                // biome-ignore lint/style/useNamingConvention: necessary for React inline styles
                WebkitBoxOrient: "vertical",
              }}
            >
              {truncateDescription(event.description)}
            </Typography>
          )}

          {eventTags.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.75,
              }}
            >
              {eventTags.map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          )}

          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, mt: "auto" }}
          >
            <Typography variant="body2" fontWeight={600}>
              {`${attendeesNotice} attending`}
            </Typography>
            {attendingCount?.capacity !== null &&
              attendingCount?.yes !== undefined &&
              attendingCount.yes >= attendingCount.capacity && (
                <Chip label="Full" size="small" color="warning" />
              )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
