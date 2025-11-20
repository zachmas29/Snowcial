/**
 * Date formatting utilities for consistent date display across the application
 */

/**
 * Formats an event date for display in event cards and lists
 * @param date - Date string or Date object
 * @returns Formatted date string (e.g., "Mon, Dec 25, 3:30 PM")
 */
export function formatEventDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
