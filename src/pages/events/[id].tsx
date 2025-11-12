/** biome-ignore-all lint/style/useNamingConvention: <Using snake_case to make Supabase happy> */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Event from "@/components/Event";
import { fetchEvent, fetchEventTags } from "@/lib/db_functions";
import type { EventFormData } from "@/types/EventCreator.types";

export default function eventPage() {
  const router = useRouter();
  const [eventData, setEventData] = useState<EventFormData | null>();
  const event_id: number = Number(router.query.id);

  // Load event tag options
  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await fetchEvent(event_id);
        const tags = await fetchEventTags(event_id);

        if (!data) {
          return;
        }

        const typedData: EventFormData = {
          title: data.title,
          description: data.description ?? "",
          event_time: new Date(data.event_time),
          tags: tags,
        };

        setEventData(typedData);
      } catch (error) {
        // biome-ignore lint/suspicious/noConsole: just for testing
        console.error("Failed to fetch tags:", error);
      }
    }
    loadEvent();
  }, [event_id]);

  return (
    <div>
      {eventData ? (
        <Event eventData={eventData} />
      ) : (
        <h1>We couldn't find this event. :(</h1>
      )}
    </div>
  );
}
