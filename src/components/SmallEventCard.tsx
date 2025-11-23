import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { formatEventDate } from "@/lib/date_formatters";
import type { AttendeeCountType } from "@/types/AttendeeCountType.type";
import type { Tables } from "@/types/database.types";

type EventCardProps = {
  event: Tables<"events">;
  eventTags: Tables<"event_tags">[];
  user: Tables<"users"> | null;
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
  const avatarSrc = user?.profile_photo_path ?? "";

  const attendees =
    attendingCount &&
    attendingCount.yes > 0 &&
    attendingCount.yes !== attendingCount.total
      ? `${attendingCount.yes}-${attendingCount.total}`
      : `${attendingCount?.total ?? 0}`;
  const attendeesNotice = `${attendees} ${attendingCount?.total !== 1 ? "people" : "person"}`;

  // Truncate description to 100 words
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
        <CardContent
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            {user ? (
              <Link
                href={`/profile/${user.id}`}
                onClick={(e) => e.stopPropagation()}
                style={{ textDecoration: "none" }}
              >
                <Avatar
                  src={avatarSrc}
                  sx={{
                    width: 48,
                    height: 48,
                    fontSize: 16,
                  }}
                >
                  {initials}
                </Avatar>
              </Link>
            ) : (
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  fontSize: 16,
                }}
              >
                {initials}
              </Avatar>
            )}

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {event.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {user ? `${user.first_name} ${user.last_name}` : "Event"} •{" "}
                {formatEventDate(event.event_time)}
              </Typography>
            </Box>
          </Stack>

          {event.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                webkitLineClamp: 3,
                webkitBoxOrient: "vertical",
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

          <Typography variant="body2" fontWeight={600} sx={{ mt: "auto" }}>
            {`${attendeesNotice} attending`}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
