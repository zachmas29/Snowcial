/** biome-ignore-all lint/style/useNamingConvention: <Using snake_case to make Supabase happy> */
import { Alert, Box, CircularProgress, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import AttendeeList from "@/components/AttendeeList";
import CommentThread from "@/components/CommentThread";
import Event from "@/components/Event";
import PageLayout from "@/components/PageLayout";
import RSVPButton from "@/components/RSVPButton";
import { useAuthContext } from "@/hooks/useAuth";
import {
  fetchEvent,
  fetchEventRSVPs,
  fetchEventTags,
  fetchUserFromEventId,
  getCurrentUserRSVP,
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
  const [rsvps, setRsvps] = useState<
    Array<{
      user_id: string;
      status: "yes" | "maybe";
      created_at: string;
      users: {
        first_name: string;
        last_name: string;
        profile_photo_path: string | null;
      };
    }>
  >([]);
  const [eventCapacity, setEventCapacity] = useState<number | null>(null);
  const [userRsvpStatus, setUserRsvpStatus] = useState<"yes" | "maybe" | null>(
    null,
  );
  const { user } = useAuthContext();
  const event_id: number = Number(router.query.id);

  useEffect(() => {
    if (!router.isReady || Number.isNaN(event_id)) {
      return;
    }
    async function loadEvent() {
      // Guard against router not being ready
      if (!event_id || Number.isNaN(event_id)) {
        return;
      }

      // Reset error state when attempting a new fetch
      setHasError(false);

      try {
        const data = await fetchEvent(event_id);
        const tags = await fetchEventTags(event_id);
        const userData = await fetchUserFromEventId(event_id);
        const rsvpList = await fetchEventRSVPs(event_id);
        const userRsvp = user ? await getCurrentUserRSVP(event_id) : null;

        if (!data) {
          setHasError(true);
          return;
        }

        const typedData: EventFormData = {
          title: data.title,
          description: data.description ?? "",
          event_time: new Date(data.event_time),
          tags: tags,
          capacity: data.capacity,
        };

        if (!typedData) {
          throw Error("Event undefined.");
        }

        setEventData(typedData);
        setUserData(userData ?? null);
        setEventCapacity(data.capacity);
        setRsvps(rsvpList);
        setUserRsvpStatus(userRsvp?.status ?? null);
      } catch (_error) {
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [event_id, router.isReady, user]);

  const handleRSVPChange = useCallback(async () => {
    try {
      const rsvpList = await fetchEventRSVPs(event_id);
      const userRsvp = user ? await getCurrentUserRSVP(event_id) : null;
      setRsvps(rsvpList);
      setUserRsvpStatus(userRsvp?.status ?? null);
    } catch (_error) {
      // biome-ignore lint/suspicious/noConsole: error logging
      console.error("Failed to refresh RSVP data..");
    }
  }, [event_id, user]);

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
      <PageLayout>
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
          <Stack spacing={3}>
            <Event eventData={eventData} userData={userData ?? null} />

            {user && (
              <RSVPButton
                eventId={event_id}
                currentStatus={userRsvpStatus}
                capacity={eventCapacity}
                rsvps={rsvps}
                userId={user.id}
                onRSVPChange={handleRSVPChange}
              />
            )}

            <AttendeeList rsvps={rsvps} capacity={eventCapacity} />

            <CommentThread eventId={event_id} />
          </Stack>
        )}
      </PageLayout>
    </div>
  );
}
