import { createGoogleCalendarUrl } from "@/lib/calendar_url_function";
import type { EventFormData } from "@/types/EventCreator.types";

// Hook to add an event to Google Calendar
export function useCalendarAddFeat(eventData: EventFormData) {
  const handleAddToCalendar = () => {
    // event_time is nullable
    if (!eventData.event_time) return;

    const startDate = new Date(eventData.event_time);

    // Same start/end since events have no defined duration
    const calendarUrl = createGoogleCalendarUrl({
      title: eventData.title,
      startDate: startDate,
      endDate: startDate, // duration could be added later
      details: eventData.description,
      location: "",
    });

    window.open(calendarUrl, "_blank");
  };

  return {
    handleAddToCalendar,
    canAddToCalendar: !!eventData.event_time,
  };
}
