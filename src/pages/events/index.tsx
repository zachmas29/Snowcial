import { Alert, CircularProgress, Typography } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import EventFeed from "@/components/EventFeed";
import PageLayout from "@/components/PageLayout";
import SearchFilterBar from "@/components/SearchFilterBar";
import {
  fetchEvents,
  fetchEventTagOptions,
  fetchEventTags,
  fetchUser,
  getAttendeeCount,
} from "@/lib/db_functions";
import type { EnrichedEvent } from "@/types/app.types";
import type { GenericTagType } from "@/types/EventCreator.types";

export default function Events() {
  const [events, setEvents] = useState<EnrichedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortType, setSortType] = useState<string>("happening-soon");
  const [selectedTags, setSelectedTags] = useState<GenericTagType[]>([]);
  const [availableTags, setAvailableTags] = useState<GenericTagType[]>([]);

  const sortOptions = [
    { value: "happening-soon", label: "Happening Soon" },
    { value: "recently-posted", label: "Recently Posted" },
    { value: "none", label: "None" },
  ];

  useEffect(() => {
    async function loadEventsAndTags() {
      try {
        const [baseEvents, tags] = await Promise.all([
          fetchEvents(),
          fetchEventTagOptions(),
        ]);

        const enrichedPromises = baseEvents.map(async (event) => {
          try {
            const [user, attendingCount, eventTags] = await Promise.all([
              fetchUser(event.creator_id),
              getAttendeeCount(event.id),
              fetchEventTags(event.id),
            ]);
            return {
              event,
              user,
              eventTags,
              attendingCount,
            } as EnrichedEvent;
          } catch (err) {
            // biome-ignore lint/suspicious/noConsole: just for testing
            console.error(
              `Failed to fetch extra data for event ${event.id}:`,
              err,
            );
            setHasError(true);
            return;
          }
        });

        const enrichedEvents = await Promise.all(enrichedPromises);
        setEvents(
          enrichedEvents.filter(
            (event): event is EnrichedEvent => event !== undefined,
          ),
        );
        setAvailableTags(tags);
      } catch (error) {
        // biome-ignore lint/suspicious/noConsole: just for testing
        console.error("Failed to load events:", error);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }
    loadEventsAndTags();
  }, []);

  return (
    <>
      <Head>
        <title>Events | Snowcial</title>
      </Head>
      <PageLayout>
        <Typography
          variant="h3"
          component="h1"
          fontWeight={600}
          textAlign="center"
          mb={1}
        >
          Events
        </Typography>
        <SearchFilterBar
          searchTerm={searchTerm}
          setTerm={setSearchTerm}
          sortType={sortType}
          setSortType={setSortType}
          availableTags={availableTags}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          sortOptions={sortOptions}
        />
        {loading ? (
          <CircularProgress />
        ) : hasError ? (
          <Alert severity="error" sx={{ width: "100%", maxWidth: 640 }}>
            Could not load events
          </Alert>
        ) : (
          <EventFeed
            events={events}
            searchTerm={searchTerm}
            sortType={sortType}
            selectedTags={selectedTags}
          />
        )}
      </PageLayout>
    </>
  );
}
