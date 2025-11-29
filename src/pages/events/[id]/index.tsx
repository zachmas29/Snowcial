/** biome-ignore-all lint/style/useNamingConvention: <Using snake_case to make Supabase happy> */
import { Alert, Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CommentThread from "@/components/CommentThread";
import Event from "@/components/Event";
import PageLayout from "@/components/PageLayout";
import {
  fetchEvent,
  fetchEventTags,
  fetchUserFromEventId,
} from "@/lib/db_functions";
// import styles removed; use MUI Box for layout instead
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

  if (hasError || !eventData) {
    return (
      <PageLayout>
        <Alert severity="error" sx={{ width: "100%" }}>
          Unable to load event right now.
        </Alert>
      </PageLayout>
    );
  }

  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : hasError || !eventData ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "40vh",
            width: "100%",
          }}
        >
          <Box component="main" sx={{ width: "100%", maxWidth: 640 }}>
            <Alert severity="error" sx={{ width: "100%" }}>
              Unable to load event right now.
            </Alert>
          </Box>
        </Box>
      ) : (
        <>
          <Event eventData={eventData} userData={userData ?? null} />
          <CommentThread eventId={event_id} />
        </>
      )}
    </div>
  );
}
