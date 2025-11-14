/** biome-ignore-all lint/style/useNamingConvention: <Using snake_case for DB types to make Supabase happy> */
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import EventCreator from "@/components/EventCreator";
import { useAuthContext } from "@/hooks/useAuth";
import { fetchEventTagOptions, insertEventWithTags } from "@/lib/db_functions";
import styles from "@/styles/Home.module.css";
import type { Tables } from "@/types/database.types";
import type { EventFormData } from "@/types/EventCreator.types";

export default function NewEvent() {
  const router = useRouter();
  const authData = useAuthContext();
  const [clientLoaded, setClientLoaded] = useState(false);

  const [tagOptions, setTagOptions] = useState<Tables<"event_tags">[] | []>([]);
  const [eventFormData, setEventFormData] = useState<EventFormData>({
    title: "",
    description: "",
    event_time: null,
    tags: [],
  });

  // delay initiating event_time value to when client page is rendered
  // to prevent https://react.dev/link/hydration-mismatch
  useEffect(() => {
    setEventFormData((prev) => ({
      ...prev,
      event_time: prev.event_time ?? new Date(),
    }));
    setClientLoaded(true);
  }, []);

  // Load event tag options
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

  // Submits event data to Supabase
  const handleSubmit = async () => {
    if (
      !eventFormData.title.trim() ||
      !eventFormData.description.trim() ||
      !eventFormData.event_time
    ) {
      alert("Please fill in a title, description, and date.");
      return;
    }

    if (!clientLoaded || !authData.user) return null;

    try {
      const inserted = await insertEventWithTags(
        {
          title: eventFormData.title,
          description: eventFormData.description,
          event_time: eventFormData.event_time,
          tags: eventFormData.tags,
        },
        authData.user.id,
      );

      if (inserted) {
        router.push(`/events/${inserted.id}`);
      }
    } catch (err) {
      alert(`Failed to create event: ${err}`);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!clientLoaded) return null;

  return (
    <>
      <Head>
        <title>Create Event | Snowcial</title>
      </Head>

      <div className={styles.page}>
        <main className={styles.main}>
          <h1 style={{ textAlign: "center" }}>CREATE EVENT</h1>
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
