import { Box, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import type { EventFeedProps } from "@/types/app.types";
import SmallEventCard from "./SmallEventCard";

export default function EventFeed({
  events,
  searchTerm = "",
  sortType = "happening-soon",
  selectedTags = [],
  emptyMessage = "No events found.",
}: EventFeedProps) {
  const router = useRouter();

  let displayedEvents = [...events];

  // Filter by search term (title + description + creator name)
  if (searchTerm) {
    displayedEvents = displayedEvents.filter((enrichedEvent) => {
      const { event, user } = enrichedEvent;
      const searchText =
        `${event.title} ${event.description || ""} ${user?.first_name || ""} ${user?.last_name || ""}`.toLowerCase();
      return searchText.includes(searchTerm.toLowerCase());
    });
  }

  // Filter by tags (show events with any selected tag)
  if (selectedTags.length > 0) {
    displayedEvents = displayedEvents.filter((enrichedEvent) => {
      return enrichedEvent.eventTags.some((eventTag) =>
        selectedTags.some((selectedTag) => selectedTag.id === eventTag.id),
      );
    });
  }

  displayedEvents = displayedEvents.sort((a, b) => {
    switch (sortType) {
      case "happening-soon":
        return (
          new Date(a.event.event_time).getTime() -
          new Date(b.event.event_time).getTime()
        );
      case "recently-posted":
        return (
          new Date(b.event.created_at).getTime() -
          new Date(a.event.created_at).getTime()
        );
      default:
        return 0;
    }
  });

  const handleEventClick = (eventId: number) => {
    router.push(`/events/${eventId}`);
  };

  if (displayedEvents.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Box>
    );
  }

  const eventCards = displayedEvents.map((enrichedEvent) => {
    return (
      <SmallEventCard
        key={enrichedEvent.event.id}
        event={enrichedEvent.event}
        user={enrichedEvent.user}
        eventTags={enrichedEvent.eventTags}
        attendingCount={enrichedEvent.attendingCount}
        handleEventClick={handleEventClick}
      />
    );
  });

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={4}>{eventCards}</Stack>
    </Box>
  );
}
