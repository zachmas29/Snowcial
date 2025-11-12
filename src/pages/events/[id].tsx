import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Event from "@/components/Event";
import { fetchEvent } from "@/lib/db_functions";
import type { EventFormData } from "@/types/EventCreator.types";

export default function eventPage() {

    const router = useRouter();
    const [eventData, setEventData] = useState<EventFormData | null>();

    // Load event tag options
    useEffect(() => {
        async function loadEvent() {
        try {
            const data = await fetchEvent(1);
            setEventData(data);
        } catch (error) {
            // biome-ignore lint/suspicious/noConsole: just for testing
            console.error("Failed to fetch tags:", error);
        }
        }
        loadEvent();
    }, [router.query.id]);

    return <div>
        <Event eventData={}/>
    </div>
}