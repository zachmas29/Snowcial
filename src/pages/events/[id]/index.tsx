/** biome-ignore-all lint/style/useNamingConvention: <Using snake_case to make Supabase happy> */
import { Alert, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CommentThread from "@/components/CommentThread";
import Event from "@/components/Event";
import {
  fetchEvent,
  fetchEventTags,
  fetchUserFromEventId,
} from "@/lib/db_functions";
import styles from "@/styles/Home.module.css";
import type { Tables } from "@/types/database.types";
import type { EventFormData } from "@/types/EventCreator.types";

export default function eventPage() {
  const router = useRouter();
  const [eventData, setEventData] = useState<EventFormData | null>();
  const [userData, setUserData] = useState<Tables<"users"> | null>();
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const event_id: number = Number(router.query.id);

  useEffect(() => {
    if (!router.isReady || Number.isNaN(event_id)) {
      return;
    }
    async function loadEvent() {
      try {
        const data = await fetchEvent(event_id);
        const tags = await fetchEventTags(event_id);
        const userData = await fetchUserFromEventId(event_id);

        if (!data) {
          setHasError(true);
          return;
        }

        const typedData: EventFormData = {
          title: data.title,
          description: data.description ?? "",
          event_time: new Date(data.event_time),
          tags: tags,
        };

        if (!typedData) {
          throw Error("Event undefined.");
        }

        setEventData(typedData);
        setUserData(userData ?? null);
      } catch (_error) {
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [event_id, router.isReady]);

  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : hasError || !eventData ? (
        <div className={styles.page}>
          <main className={styles.main}>
            <Alert severity="error" sx={{ width: "100%", maxWidth: 640 }}>
              Unable to load event right now.
            </Alert>
          </main>
        </div>
      ) : (
        <>
          <Event eventData={eventData} userData={userData ?? null} />
          <CommentThread eventId={event_id} />
        </>
      )}
    </div>
  );
}
