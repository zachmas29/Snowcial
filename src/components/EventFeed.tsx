import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  fetchEvents,
  fetchEventsByUser,
  fetchEventTags,
  fetchUser,
  getAttendeeCount,
} from "@/lib/db_functions";
import type { AttendeeCountType } from "@/types/AttendeeCountType.type";
import type { Tables } from "@/types/database.types";
import SmallEventCard from "./SmallEventCard";

type EnrichedEvent = {
  event: Tables<"events">;
  user: Tables<"users"> | null;
  eventTags: Tables<"event_tags">[];
  attendingCount?: AttendeeCountType;
};

interface EventFeedProps {
  includeUserId?: string;
}

export default function EventFeed({ includeUserId }: EventFeedProps) {
  const [enrichedEvents, setEnrichedEvents] = useState<EnrichedEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    async function prepareEvents() {
      try {
        const data = includeUserId
          ? await fetchEventsByUser(includeUserId)
          : await fetchEvents();

        // Fetch per-event auxiliary data in parallel (one Promise per event)
        const enrichedPromises = data.map(async (event) => {
          try {
            const [user, attendingCount, tags] = await Promise.all([
              fetchUser(event.creator_id),
              getAttendeeCount(event.id),
              fetchEventTags(event.id),
            ]);
            return {
              event,
              user,
              eventTags: tags,
              attendingCount,
            } as EnrichedEvent;
          } catch (err) {
            // If a particular event's extra data fails, return defaults so feed still renders
            // biome-ignore lint/suspicious/noConsole: intended logging
            console.error(
              `Failed to fetch extra data for event ${event.id}:`,
              err,
            );
            return {
              event,
              user: null,
              eventTags: [],
              attendingCount: undefined,
            } as EnrichedEvent;
          }
        });

        const enriched = await Promise.all(enrichedPromises);
        setEnrichedEvents(enriched);
      } catch (err) {
        // biome-ignore lint/suspicious/noConsole: just for testing
        console.error("Failed to load events:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    prepareEvents();
  }, [includeUserId]);

  const handleEventClick = (eventId: number) => {
    router.push(`/events/${eventId}`);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={200} // gives some space
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Alert severity="error" sx={{ width: "100%" }}>
        Unable to fetch event feed right now.
      </Alert>
    );
  }

  if (enrichedEvents.length === 0) {
    return includeUserId ? (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          textAlign: "center",
          backgroundColor: "background.paper",
          border: "1px dashed",
          borderColor: "divider",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No events yet. Create your first event!
        </Typography>
      </Paper>
    ) : (
      <Alert
        key={`empty-feed-index-`}
        severity="warning"
        sx={{ width: "100%" }}
      >
        There are no events to display
      </Alert>
    );
  }
  const eventCards = enrichedEvents?.map((ee) => {
    return (
      <SmallEventCard
        key={ee.event.id}
        event={ee.event}
        user={ee.user}
        eventTags={ee.eventTags}
        attendingCount={ee.attendingCount}
        handleEventClick={handleEventClick}
      />
    );
  });

  return <Stack spacing={4}>{eventCards}</Stack>;
}
