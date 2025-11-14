/** biome-ignore-all lint/style/useNamingConvention: <Using snake_case to make Supabase happy> */
import { Alert, CircularProgress } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import EventCreator from "@/components/EventCreator";
import { useAuthContext } from "@/hooks/useAuth";
import {
  fetchEvent,
  fetchEventTagOptions,
  fetchEventTags,
  updateEventWithTags,
} from "@/lib/db_functions";
import styles from "@/styles/Home.module.css";
import type { Tables } from "@/types/database.types";
import type { EventFormData } from "@/types/EventCreator.types";

export default function EditEvent() {
  const router = useRouter();
  const authData = useAuthContext();
  const event_id: number = Number(router.query.id);

  const [tagOptions, setTagOptions] = useState<Tables<"event_tags">[]>([]);
  const [eventFormData, setEventFormData] = useState<EventFormData>({
    title: "",
    description: "",
    event_time: new Date(),
    tags: [],
  });
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [originalEventData, setOriginalEventData] =
    useState<Tables<"events"> | null>(null);

  useEffect(() => {
    async function loadEventTags() {
      try {
        const data = await fetchEventTagOptions();
        setTagOptions(data);
      } catch (error) {
        // biome-ignore lint/suspicious/noConsole: just for testing
        console.error("Failed to fetch tags:", error);
      }
    }
    loadEventTags();
  }, []);

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

        const typedData: EventFormData = {
          title: eventData.title,
          description: eventData.description ?? "",
          event_time: new Date(eventData.event_time),
          tags: tags,
        };

        setEventFormData(typedData);
      } catch (_error) {
        setHasError(true);
        setErrorMessage("Unable to load event data.");
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [event_id, authData.user]);

  // Handle form submission (placeholder for now)
  const handleSubmit = async () => {
    if (
      !eventFormData.title.trim() ||
      !eventFormData.description.trim() ||
      !eventFormData.event_time
    ) {
      alert("Please fill in a title, description, and date.");
      return;
    }

    if (!authData.user) {
      alert("You must be logged in to edit events.");
      return;
    }

    if (!originalEventData) {
      alert("Original event data not loaded.");
      return;
    }

    try {
      const updatedEventData: Tables<"events"> = {
        ...originalEventData,
        title: eventFormData.title,
        description: eventFormData.description,
        event_time: eventFormData.event_time.toISOString(),
      };

      const result = await updateEventWithTags(
        updatedEventData,
        eventFormData.tags,
      );

      if (result) {
        router.push(`/events/${event_id}`);
      }
    } catch (err) {
      alert(`Failed to update event: ${err}`);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <CircularProgress />
        </main>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <Alert severity="error" sx={{ width: "100%", maxWidth: 640 }}>
            {errorMessage}
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Event | Snowcial</title>
      </Head>

      <div className={styles.page}>
        <main className={styles.main}>
          <h1 style={{ textAlign: "center" }}>EDIT EVENT</h1>
          <EventCreator
            eventFormData={eventFormData}
            setEventFormData={setEventFormData}
            tagOptions={tagOptions}
            submit={handleSubmit}
            cancel={handleCancel}
          />
        </main>
      </div>
    </>
  );
}
