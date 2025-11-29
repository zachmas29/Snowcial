/** biome-ignore-all lint/style/useNamingConvention: <Using snake_case to make Supabase happy> */
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import EventCreator from "@/components/EventCreator";
import PageLayout from "@/components/PageLayout";
import { useAuthContext } from "@/hooks/useAuth";
import {
  deleteEvent,
  fetchEvent,
  fetchEventTags,
  updateEventWithTags,
} from "@/lib/db_functions";
import type { Tables } from "@/types/database.types";
import type { EventFormData } from "@/types/EventCreator.types";

export default function EditEvent() {
  const router = useRouter();
  const authData = useAuthContext();
  const event_id: number = Number(router.query.id);

  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [originalEventData, setOriginalEventData] =
    useState<Tables<"events"> | null>(null);
  const [eventTags, setEventTags] = useState<Tables<"event_tags">[]>([]);

  // Load event data
  useEffect(() => {
    async function loadEvent() {
      if (!event_id) return;

      try {
        const eventData = await fetchEvent(event_id);
        const tags = await fetchEventTags(event_id);

        if (!eventData) {
          setHasError(true);
          setErrorMessage("Event not found.");
          return;
        }

        if (!authData.user || eventData.creator_id !== authData.user.id) {
          setHasError(true);
          setErrorMessage("You are not authorized to edit this event.");
          return;
        }

        setOriginalEventData(eventData);
        setEventTags(tags);
      } catch {
        setHasError(true);
        setErrorMessage("Unable to load event data.");
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [event_id, authData.user]);

  const handleSubmit = async (formData: EventFormData) => {
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.event_time ||
      !authData.user ||
      !originalEventData
    ) {
      // This should never be called based on when
      // the form data submit button is disabled
      alert("Something went wrong...");
      return;
    }

    try {
      const updatedEventData: Tables<"events"> = {
        ...originalEventData,
        title: formData.title,
        description: formData.description,
        event_time: formData.event_time.toISOString(),
      };

      const result = await updateEventWithTags(updatedEventData, formData.tags);

      if (result) {
        router.push(`/events/${event_id}`);
      }
    } catch (err) {
      alert(`Failed to update event: ${err}`);
    }
  };

  const handleClick = (action?: string) => {
    if (action === "delete") {
      if (originalEventData?.id) {
        deleteEvent(originalEventData.id);
        router.push("/events");
      }
    } else if (action === "cancel") {
      router.back();
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "40vh",
          }}
        >
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  if (hasError) {
    return (
      <PageLayout>
        <Alert severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </PageLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Event | Snowcial</title>
      </Head>
      <PageLayout maxWidth="sm">
        <Typography
          variant="h3"
          component="h1"
          fontWeight={600}
          textAlign="center"
          mb={1}
        >
          Edit Event
        </Typography>
        <EventCreator
          initialData={
            originalEventData
              ? {
                  title: originalEventData.title,
                  description: originalEventData.description ?? "",
                  event_time: new Date(originalEventData.event_time),
                  tags: eventTags,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          handleClick={handleClick}
        />
      </PageLayout>
    </>
  );
}
