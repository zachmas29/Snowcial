/** biome-ignore-all lint/style/useNamingConvention: <supabase format> */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, test, vi } from "vitest";
import EventFeed from "@/components/EventFeed";
import type { EnrichedEvent } from "@/types/app.types";
import type { Tables } from "@/types/database.types";

vi.mock("next/router", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

const mockEvent: Tables<"events"> = {
  id: 1,
  title: "Morning Powder Run at Snowbowl",
  description:
    "Fresh snow expected tonight! Let's meet at the base lodge at 9am for first tracks. All levels welcome, we'll split into groups by ability.",
  event_time: "2025-11-15T12:00:00.000Z",
  creator_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  created_at: "2025-11-01T12:00:00+00:00",
  last_updated: "2025-11-01T12:00:00+00:00",
  capacity: null,
};

const mockUser: Tables<"users"> = {
  id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  first_name: "Emma",
  last_name: "Johnson",
  email: "emma.johnson@middlebury.edu",
  bio_text:
    "Love hitting the slopes early morning! Always looking for powder days at Snowbowl.",
  created_at: "2025-01-01T00:00:00+00:00",
  last_updated: "2025-01-01T00:00:00+00:00",
  banner_photo_path: null,
  profile_photo_path: "https://lh3.googleusercontent.com/a/default-user",
  last_active: "2025-11-13T00:00:00+00:00",
};

const mockAttendeeCount = {
  yes: 3,
  maybe: 0,
  total: 3,
  capacity: null,
  waitlistCount: 0,
};

const mockTags: Tables<"event_tags">[] = [
  {
    id: 1,
    name: "Snowbowl",
  },
];

const mockEnrichedEvent: EnrichedEvent = {
  event: mockEvent,
  user: mockUser,
  eventTags: mockTags,
  attendingCount: mockAttendeeCount,
};

const mockEnrichedEventWithoutUser: EnrichedEvent = {
  event: mockEvent,
  user: undefined,
  eventTags: mockTags,
  attendingCount: mockAttendeeCount,
};

const mockEnrichedEventWithoutTags: EnrichedEvent = {
  event: mockEvent,
  user: mockUser,
  eventTags: [],
  attendingCount: mockAttendeeCount,
};

describe("EventFeed", () => {
  test("Smoke test - renders without crashing", () => {
    render(<EventFeed events={[mockEnrichedEvent]} />);
    expect(
      screen.getByText("Morning Powder Run at Snowbowl"),
    ).toBeInTheDocument();
  });

  test("Snapshot test - renders consistently", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-11-15T12:00:00.000Z"));
    const { asFragment } = render(<EventFeed events={[mockEnrichedEvent]} />);
    expect(asFragment()).toMatchSnapshot();
    vi.useRealTimers();
  });

  test("Displays empty state when no events", () => {
    render(<EventFeed events={[]} />);
    expect(screen.getByText("No events found.")).toBeInTheDocument();
  });

  test("Handles multiple events", () => {
    const mockEvent2: EnrichedEvent = {
      event: { ...mockEvent, id: 2, title: "Park Session at Snowbowl" },
      user: mockUser,
      eventTags: mockTags,
      attendingCount: mockAttendeeCount,
    };

    render(<EventFeed events={[mockEnrichedEvent, mockEvent2]} />);
    expect(
      screen.getByText("Morning Powder Run at Snowbowl"),
    ).toBeInTheDocument();
    expect(screen.getByText("Park Session at Snowbowl")).toBeInTheDocument();
  });

  test("Handles event with missing user gracefully", () => {
    render(<EventFeed events={[mockEnrichedEventWithoutUser]} />);
    expect(
      screen.getByText("Morning Powder Run at Snowbowl"),
    ).toBeInTheDocument();
  });

  test("Handles event with missing tags", () => {
    render(<EventFeed events={[mockEnrichedEventWithoutTags]} />);
    expect(
      screen.getByText("Morning Powder Run at Snowbowl"),
    ).toBeInTheDocument();
  });

  test("Displays user information correctly", () => {
    render(<EventFeed events={[mockEnrichedEvent]} />);
    expect(
      screen.getByText((content) => content.includes("Emma Johnson")),
    ).toBeInTheDocument();
  });

  test("Displays tags correctly", () => {
    render(<EventFeed events={[mockEnrichedEvent]} />);
    expect(screen.getByText("Snowbowl")).toBeInTheDocument();
  });

  test("Filters by search term in title", () => {
    render(
      <EventFeed events={[mockEnrichedEvent]} searchTerm="Morning Powder" />,
    );
    expect(
      screen.getByText("Morning Powder Run at Snowbowl"),
    ).toBeInTheDocument();
  });

  test("Filters by search term in description", () => {
    render(<EventFeed events={[mockEnrichedEvent]} searchTerm="Fresh snow" />);
    expect(
      screen.getByText("Morning Powder Run at Snowbowl"),
    ).toBeInTheDocument();
  });

  test("Filters by search term in creator name", () => {
    render(<EventFeed events={[mockEnrichedEvent]} searchTerm="Emma" />);
    expect(
      screen.getByText("Morning Powder Run at Snowbowl"),
    ).toBeInTheDocument();
  });

  test("Filters out events that don't match search term", () => {
    render(<EventFeed events={[mockEnrichedEvent]} searchTerm="nonexistent" />);
    expect(screen.getByText("No events found.")).toBeInTheDocument();
  });

  test("Filters by selected tags (OR logic)", () => {
    const snowbowlTag: Tables<"event_tags"> = { id: 1, name: "Snowbowl" };
    render(
      <EventFeed events={[mockEnrichedEvent]} selectedTags={[snowbowlTag]} />,
    );
    expect(
      screen.getByText("Morning Powder Run at Snowbowl"),
    ).toBeInTheDocument();
  });
});
