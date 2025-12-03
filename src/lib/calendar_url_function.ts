// Creates URL to add an event to Google Calendar

interface CalendarEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  details?: string;
  location?: string;
}

function formatGoogleDate(date: Date): string {
  // format date
  const dateAsString = date.toISOString();
  const withoutDashes = dateAsString.replace(/[-:]/g, "");
  const shortenedTime = withoutDashes.split(".")[0];

  return shortenedTime + "Z";
}

export function createGoogleCalendarUrl(event: CalendarEvent): string {
  const startDate = formatGoogleDate(event.startDate);
  const endDate = formatGoogleDate(event.endDate);

  const EventInfo = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: event.details || "",
    location: event.location || "",
    dates: `${startDate}/${endDate}`,
  });

  const url = `https://calendar.google.com/calendar/render?${EventInfo}`;
  return url;
}
