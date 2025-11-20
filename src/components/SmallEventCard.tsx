import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Link,
  Stack,
  Typography,
} from "@mui/material";
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

  const tagChips = eventTags.map((tag) => (
    <Chip
      key={tag.id}
      label={tag.name}
      size="small"
      sx={{ mr: 0.5, mb: 0.5 }}
    />
  ));

  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`
    : event.title?.slice(0, 2).toUpperCase();

  const attendees =
    attendingCount &&
    attendingCount.yes > 0 &&
    attendingCount.yes !== attendingCount.total
      ? `${attendingCount.yes}-${attendingCount.total}`
      : `${attendingCount?.total ?? 0}`;
  const attendeesNotice = `${attendees} ${attendingCount?.total !== 1 ? "people" : "person"}`;

  const ClickableAvatar = user ? (
    <Link
      href={`/profile/${user.id}`}
      underline="none"
      onClick={(e) => e.stopPropagation()}
    >
      <Avatar>{initials}</Avatar>
    </Link>
  ) : (
    <Box>
      <Avatar>{initials}</Avatar>
    </Box>
  );

  return (
    <CardActionArea onClick={() => handleEventClick(event.id)}>
      <Card sx={{ justifyContent: "space-between" }}>
        <CardHeader
          avatar={ClickableAvatar}
          title={event.title}
          subheader={`${user ? `${user.first_name} ${user.last_name}` : ""} • ${formatEventDate(event.event_time)}`}
        />

        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {event.description}
          </Typography>

          <Box mt={2}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {tagChips}
            </Stack>
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            {`${attendeesNotice} attending`}
          </Typography>
        </CardActions>
      </Card>
    </CardActionArea>
  );
}
